import { describe, expect, it } from "vitest";
import { canAccess } from "./rbac";

describe("workspace RBAC", () => {
  it("allows roles to access only their level and below", () => {
    expect(canAccess("owner", "editor")).toBe(true);
    expect(canAccess("editor", "viewer")).toBe(true);
    expect(canAccess("viewer", "editor")).toBe(false);
    expect(canAccess("unknown", "viewer")).toBe(false);
  });
});
