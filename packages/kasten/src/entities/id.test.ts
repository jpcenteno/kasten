import { expect } from "chai";
import { ID, intoID, randomID } from "./id.js";

describe("intoId", () => {
  it("Should reject empty strings", () => {
    expect(() => intoID("")).to.throw();
  });

  describe("Given non-blank strings", () => {
    const tests = ["foo", "foo bar ", "foo.txt"];

    tests.forEach((s) => {
      it(`Should type any non-blank string as ID: '${s}'`, () => {
        expect(intoID(s)).to.equal(s);
      });
    });
  });

  describe("Given non-empty blank strings (Those are valid filenames)", () => {
    const tests = [
      { s: " ", display: " " },
      { s: "\n", display: "\\n" },
      { s: "\t", display: "\\t" },
    ];

    tests.forEach(({ s, display }) => {
      it(`Should accept the string: ${display}`, () => {
        expect(intoID(s)).to.equal(s);
      });
    });
  });
});

describe("randomID", () => {
  const testIDs = Array.from({ length: 50 }, (_) => randomID());

  it("Should generate a different value each time it's called", () => {
    expect(new Set(testIDs).size).to.equal(testIDs.length);
  });
});
