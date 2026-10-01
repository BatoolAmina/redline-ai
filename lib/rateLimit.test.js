import { describe, expect, it } from "vitest";
import { checkGuestChatLimit, checkRateLimit } from "./rateLimit";

describe("request rate limit", () => {
  it("allows requests up to the limit and blocks the next one", async () => {
    const client = `test-${Date.now()}-${Math.random()}`;
    const request = { headers: new Headers({ "x-forwarded-for": client }) };
    const results = await Promise.all([
      checkRateLimit(request, "test", 2, 60_000),
      checkRateLimit(request, "test", 2, 60_000),
      checkRateLimit(request, "test", 2, 60_000),
    ]);

    expect(results.filter((result) => result.allowed)).toHaveLength(2);
    expect(results.filter((result) => !result.allowed)).toHaveLength(1);
  });

  it("accepts the header shape supplied to a credentials provider", async () => {
    const client = `credentials-${Date.now()}-${Math.random()}`;
    const request = { headers: { "x-forwarded-for": client } };
    const result = await checkRateLimit(request, "credentials-test", 1, 60_000);

    expect(result.allowed).toBe(true);
  });
});

describe("guest chat limit", () => {
  it("allows four questions and blocks the fifth", async () => {
    const guestId = `test-${Date.now()}-${Math.random()}`;
    const results = [];
    for (let index = 0; index < 5; index += 1) {
      results.push(await checkGuestChatLimit(guestId, 4));
    }
    expect(results.slice(0, 4).every((result) => result.allowed)).toBe(true);
    expect(results[4].allowed).toBe(false);
  });
});
