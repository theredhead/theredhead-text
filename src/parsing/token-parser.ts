/** @format */

import { CharacterInfo, Parser } from "./parser";

export class TokenParser {
  private parser: Parser;
  private tokens: Token[] = [];
  private token: Token = new Token();

  private readonly handlers: TokenHandlerMap = {};

  constructor() {
    this.parser = new Parser();

    // whitespace
    this.parser.on([" ", "\t", "\n"], (_) => {
      if (this.token.length > 0) {
        this.tokenParsed(this.token);
        this.token = new Token();
      }
    });
    // single char seperators
    this.parser.on([",", ";"], (c) => {
      if (this.token.length > 0) {
        this.tokenParsed(this.token);
        this.token = new Token();
      }
      const token = new Token();
      token.append(c);
      this.tokenParsed(token);
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
        this.tokenParsed(this.token);
        this.token = new Token();
      }
    });
  }

  on(token: string | string[], handler: TokenHandler) {
    const words = Array.isArray(token) ? token : [token];
    for (let word of words) {
      const lowered = word.toLowerCase();
      const handlers = this.handlers[lowered] ?? [];
      handlers.push(handler);
      this.handlers[word.toLowerCase()] = handlers;
    }
  }

  tokenParsed(token: Token) {
    this.tokens.push(token);

    this.handle(token);
  }

  handle(token: Token) {
    const lowered = token.toString().toLowerCase();
    const handlers = [
      ...(this.handlers[lowered] ?? []),
      ...(this.handlers["*"] ?? []),
    ];
    for (let handler of handlers) {
      handler(token);
    }
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

export type TokenHandler = (token: Token) => void;
export type TokenHandlerMap = { [key: string]: TokenHandler[] };
