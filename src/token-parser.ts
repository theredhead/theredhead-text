/** @format */

import { CharacterInfo, Parser } from "./parser";

export class TokenParser {
  private parser: Parser;
  private tokens: Token[] = [];
  private token: Token = new Token();

  constructor() {
    this.parser = new Parser();

    // whitespace
    this.parser.on([" ", "\t", "\n"], (_) => {
      if (this.token.length > 0) {
        this.tokens.push(this.token);
        this.token = new Token();
      }
    });
    // single char seperators
    this.parser.on([",", ";"], (c) => {
      if (this.token.length > 0) {
        this.tokens.push(this.token);
        this.token = new Token();
      }
      const token = new Token();
      token.append(c);
      this.tokens.push(token);
    });
    this.parser.on("*", (c) => {
      switch (c.character) {
        case " ":
          break;
        default:
          this.token.append(c);
          break;
      }
    });

    this.parser.onStart(() => {
      this.tokens = [];
      this.token = new Token();
    });
    this.parser.onDone(() => {
      if (this.token.length > 0) {
        this.tokens.push(this.token);
        this.token = new Token();
      }
    });
  }

  parse(text: string): Token[] {
    this.parser.parse(text);
    return this.tokens;
  }
}

export class Token {
  private readonly chars: CharacterInfo[] = [];

  append(char: CharacterInfo): void {
    this.chars.push(char);
  }

  toString(): string {
    return this.chars.map((c) => c.character).join("");
  }

  get length(): number {
    return this.chars.length;
  }
}
