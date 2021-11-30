/** @format */

export class Parser {
  private readonly handlers: CharacterHandlerMap = {};

  private startHandlers: EmptyCallback[] = [];
  private doneHandlers: EmptyCallback[] = [];

  private position: number = 0;
  private text: string = "";

  parse(text: string) {
    this.text = text;
    this.position = 0;
    let line = 0;
    let column = 0;
    this.begin();

    while (this.position < text.length) {
      let character = this.text.charAt(this.position);
      let charInfo: CharacterInfo = {
        line,
        column,
        character,
      };
      column++;
      this.handle(charInfo);
      if (character == "\n") {
        line++;
        column = 0;
      }
      this.position++;
    }
    this.done();
  }

  begin(): void {
    for (let startHandler of this.startHandlers) {
      startHandler();
    }
  }

  done(): void {
    for (let doneHandler of this.doneHandlers) {
      doneHandler();
    }
  }

  on(char: string | string[], handler: CharacterHandler) {
    const characters = Array.isArray(char) ? char : [char];
    for (let c of characters) {
      const handlers = this.handlers[c] ?? [];
      handlers.push(handler);
      this.handlers[c] = handlers;
    }
  }

  off(char: string | string[], handler: CharacterHandler) {
    const characters = Array.isArray(char) ? char : [char];
    for (let c of characters) {
      const handlers = this.handlers[c] ?? [];
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  onStart(callback: EmptyCallback): void {
    this.startHandlers.push(callback);
  }

  offStart(callback: EmptyCallback): void {
    const index = this.startHandlers.indexOf(callback);
    if (index > -1) {
      this.startHandlers.splice(index, 1);
    }
  }

  onDone(callback: EmptyCallback): void {
    this.doneHandlers.push(callback);
  }

  offDone(callback: EmptyCallback): void {
    const index = this.doneHandlers.indexOf(callback);
    if (index > -1) {
      this.doneHandlers.splice(index, 1);
    }
  }

  handle(info: CharacterInfo): void {
    const handlers: CharacterHandler[] = [
      ...(this.handlers[info.character] ?? []),
      ...(this.handlers["*"] ?? []),
    ];
    for (let handler of handlers) {
      handler(info);
    }
  }
}

export type CharacterHandler = (char: CharacterInfo) => void;
export type CharacterHandlerMap = { [key: string]: CharacterHandler[] };
export type EmptyCallback = () => void;

export interface CharacterInfo {
  line: number;
  column: number;
  character: string;
}
