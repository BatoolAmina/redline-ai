import { describe, expect, it } from "vitest";
import { decryptDocument, encryptDocument } from "./secureStore";

describe("document encryption", () => {
  it("round-trips structured document data", () => {
    const value = { workspaceId: "workspace-1", pages: [{ pageNumber: 1, text: "private" }] };
    const encrypted = encryptDocument(value);
    expect(encrypted).not.toContain("private");
    expect(decryptDocument(encrypted)).toEqual(value);
  });
});
