import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { canAccess } from "./rbac";
import { hashPassword } from "./password";

let client;

function getClient() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("Database is not configured. Add DATABASE_URL to the server environment.");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}

export async function ensureUserWorkspace({ id, email, name }) {
  const sql = getClient();
  const userId = String(id || email);
  const rows = await sql`
    INSERT INTO app_users (id, email, display_name)
    VALUES (${userId}, ${email}, ${name || email})
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, display_name = EXCLUDED.display_name
    RETURNING id
  `;
  const workspace = await sql`
    SELECT w.id, w.name, wm.role
    FROM workspaces w
    JOIN workspace_members wm ON wm.workspace_id = w.id
    WHERE wm.user_id = ${userId} AND wm.role = 'owner'
    ORDER BY w.created_at
    LIMIT 1
  `;
  if (!workspace.length) {
    const workspaceId = randomUUID();
    await sql`
      INSERT INTO workspaces (id, name, owner_id) VALUES (${workspaceId}, ${name ? `${name}'s workspace` : "Personal workspace"}, ${userId})
    `;
    await sql`
      INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (${workspaceId}, ${userId}, 'owner')
    `;
    return { userId: rows[0].id, workspaceId, role: "owner" };
  }
  return { userId: rows[0].id, workspaceId: workspace[0].id, role: workspace[0].role };
}

export async function createPasswordUser({ email, password, name }) {
  const sql = getClient();
  const userId = `user:${randomUUID()}`;
  const passwordHash = await hashPassword(password);
  const rows = await sql`
    INSERT INTO app_users (id, email, display_name, password_hash)
    VALUES (${userId}, ${email}, ${name || email}, ${passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email
  `;
  if (!rows.length) {
    const error = new Error("An account with that email already exists.");
    error.code = "USER_EXISTS";
    error.status = 409;
    throw error;
  }
  return { id: rows[0].id, email: rows[0].email, name: name || email };
}

export async function findPasswordUser(email) {
  const sql = getClient();
  const rows = await sql`
    SELECT id, email, display_name, password_hash
    FROM app_users
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function ensureGuestWorkspace(guestId) {
  return ensureUserWorkspace({
    id: `guest:${guestId}`,
    email: `guest-${guestId}@guest.redline.local`,
    name: "Guest",
  });
}

export async function getWorkspaceRole(userId, workspaceId) {
  const sql = getClient();
  const rows = await sql`
    SELECT role FROM workspace_members WHERE user_id = ${userId} AND workspace_id = ${workspaceId}
  `;
  return rows[0]?.role || null;
}

export async function requireWorkspaceRole(userId, workspaceId, allowedRoles = ["owner", "editor", "viewer"]) {
  const role = await getWorkspaceRole(userId, workspaceId);
  if (!role || !allowedRoles.some((requiredRole) => canAccess(role, requiredRole))) {
    const error = new Error("You do not have access to this workspace.");
    error.code = "WORKSPACE_FORBIDDEN";
    error.status = 403;
    throw error;
  }
  return role;
}

export async function createDocumentRecord({ id, workspaceId, userId, filename, expiresAt }) {
  const sql = getClient();
  await requireWorkspaceRole(userId, workspaceId, ["owner", "editor"]);
  await sql`
    INSERT INTO documents (id, workspace_id, owner_id, filename, expires_at)
    VALUES (${id}, ${workspaceId}, ${userId}, ${filename}, ${expiresAt})
  `;
}

export async function getDocumentRecord(userId, documentId) {
  const sql = getClient();
  const rows = await sql`
    SELECT d.*
    FROM documents d
    JOIN workspace_members wm ON wm.workspace_id = d.workspace_id
    WHERE d.id = ${documentId} AND wm.user_id = ${userId} AND d.deleted_at IS NULL
  `;
  return rows[0] || null;
}

export async function markDocumentDeleted(userId, documentId) {
  const sql = getClient();
  const rows = await sql`
    SELECT d.workspace_id
    FROM documents d
    JOIN workspace_members wm ON wm.workspace_id = d.workspace_id
    WHERE d.id = ${documentId} AND wm.user_id = ${userId} AND d.deleted_at IS NULL
  `;
  if (!rows.length) return false;
  await requireWorkspaceRole(userId, rows[0].workspace_id, ["owner", "editor"]);
  await sql`UPDATE documents SET deleted_at = NOW(), encrypted_payload = NULL WHERE id = ${documentId}`;
  return true;
}

export async function saveDocumentBlob(documentId, encryptedPayload) {
  const sql = getClient();
  await sql`UPDATE documents SET encrypted_payload = ${encryptedPayload} WHERE id = ${documentId} AND deleted_at IS NULL`;
}

export async function getDocumentBlob(documentId) {
  const sql = getClient();
  const rows = await sql`SELECT encrypted_payload FROM documents WHERE id = ${documentId} AND deleted_at IS NULL AND expires_at > NOW()`;
  return rows[0]?.encrypted_payload || null;
}

export async function purgeExpiredDocuments() {
  const sql = getClient();
  const expired = await sql`
    UPDATE documents
    SET deleted_at = NOW(), encrypted_payload = NULL
    WHERE expires_at <= NOW() AND deleted_at IS NULL
    RETURNING id
  `;
  return expired.length;
}
