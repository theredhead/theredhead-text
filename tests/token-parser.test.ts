/** @format */

import { TokenParser } from "../src/token-parser";

describe("TokenParser", () => {
  it("Breaks a sentence up into tokens", () => {
    const text = "The quick brown fox jumps over the lazy dog.";
    const parser = new TokenParser();
    const result = parser.parse(text);
    const strings = result.map((t) => String(t));

    expect(strings).toEqual([
      "The",
      "quick",
      "brown",
      "fox",
      "jumps",
      "over",
      "the",
      "lazy",
      "dog.",
    ]);
  });
});
