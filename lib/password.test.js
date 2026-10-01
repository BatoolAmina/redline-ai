import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password credentials", () => {
  it("hashes and verifies passwords without storing the plain text", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toContain("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });
});
