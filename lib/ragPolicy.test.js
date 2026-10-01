import { describe, expect, it } from "vitest";
import { getMinimumRelevance, shouldAnswer } from "./ragPolicy";

describe("RAG refusal policy", () => {
  it("uses the configured threshold only when it is valid", () => {
    expect(getMinimumRelevance("0.42")).toBe(0.42);
    expect(getMinimumRelevance("not-a-number")).toBe(0.18);
    expect(getMinimumRelevance("1.2")).toBe(0.18);
  });

  it("answers only when similarity reaches the threshold", () => {
    expect(shouldAnswer(0.42, 0.42)).toBe(true);
    expect(shouldAnswer(0.419, 0.42)).toBe(false);
    expect(shouldAnswer(Number.NaN, 0.1)).toBe(false);
  });
});
