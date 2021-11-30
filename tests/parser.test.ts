/** @format */

import { CharacterInfo, Parser } from "../src";

describe("Parser", () => {
  it("processes every character of the given text (includes newlines)", () => {
    const text = "Hello, World!\nGoodbye World!";
    const parser = new Parser();
    let counter = 0;
    parser.on("*", (_) => counter++);
    parser.parse(text);

    expect(counter).toBe(text.length);
  });

  it("attempts to handle charactesr of the given text", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    spyOn(parser, "handle");
    parser.parse(text);

    expect(parser.handle).toHaveBeenCalled();
  });

  it("can be configured for specific characters", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    const helpers = {
      callback: (_: CharacterInfo): void => {},
    };
    spyOn(helpers, "callback");
    parser.on("W", helpers.callback);
    parser.parse(text);
    expect(helpers.callback).toHaveBeenCalledTimes(1);
  });

  it("configured handlers can be removed", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    const helpers = {
      callback: (_: CharacterInfo): void => {},
    };
    spyOn(helpers, "callback");
    parser.on("W", helpers.callback);
    parser.off("W", helpers.callback);
    parser.parse(text);
    expect(helpers.callback).not.toHaveBeenCalled();
  });

  it("can tell you when it starts", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    const helpers = {
      start: () => {},
    };
    spyOn(helpers, "start");
    parser.onStart(helpers.start);
    parser.parse(text);
    expect(helpers.start).toHaveBeenCalledTimes(1);
  });

  it("onStart callbacks are removable", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    const helpers = {
      start: () => {},
    };
    spyOn(helpers, "start");
    parser.onStart(helpers.start);
    parser.offStart(helpers.start);
    parser.parse(text);
    expect(helpers.start).not.toHaveBeenCalled();
  });

  it("can tell you when it finishes", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    const helpers = {
      done: () => {},
    };
    spyOn(helpers, "done");
    parser.onDone(helpers.done);
    parser.parse(text);
    expect(helpers.done).toHaveBeenCalledTimes(1);
  });

  it("onDone callbacks are removable", () => {
    const text = "Hello, World!";
    const parser = new Parser();
    const helpers = {
      done: () => {},
    };
    spyOn(helpers, "done");
    parser.onDone(helpers.done);
    parser.offDone(helpers.done);
    parser.parse(text);
    expect(helpers.done).not.toHaveBeenCalled();
  });

  it("removing onStart callbacks that don't exist throws", () => {
    const parser = new Parser();
    const helpers = {
      start: () => {},
    };
    spyOn(helpers, "start");
    parser.onDone(helpers.start);
    expect(() => {
      parser.offStart(() => {});
    }).toThrow();
  });

  it("removing onDone callbacks that don't exist throws", () => {
    const parser = new Parser();
    const helpers = {
      done: () => {},
    };
    spyOn(helpers, "done");
    parser.onDone(helpers.done);
    expect(() => {
      parser.offDone(() => {});
    }).toThrow();
  });
});
