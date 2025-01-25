import { ID, intoID, randomID } from "./id";
import * as words from "./id.words.json";

describe("intoId", () => {
  it("Cannot be empty", () => {
    expect(() => intoID("")).toThrow();
  });

  it.each(["foo", "foo bar ", "foo.txt"])(
    "Accepts any non-empty string",
    (s) => {
      expect(intoID(s)).toStrictEqual(s);
    },
  );

  it("Even accepts blank strings", () => {
    expect(intoID(" ")).toStrictEqual(" ");
    expect(intoID("\n")).toStrictEqual("\n");
    expect(intoID("\t")).toStrictEqual("\t");
  });
});

describe("randomID", () => {
  const testIDs = arrayOfRandomIDs(50);

  it("Generates a distinct ID each time", () => {
    expect(new Set(testIDs).size).toStrictEqual(testIDs.length);
  });

  it.each(testIDs)("Returns a valid ID: %s", () => {
    const s = randomID();
    expect(intoID(s)).toStrictEqual(s);
  });

  it.each(testIDs)(
    "Consists of 4 dash separated words from the list: %s",
    (id) => {
      const idWords = id.split("-");
      expect(idWords).toHaveLength(4);
      expect(words).toContain(idWords[0]);
      expect(words).toContain(idWords[1]);
      expect(words).toContain(idWords[2]);
      expect(words).toContain(idWords[3]);
    },
  );
});

function arrayOfRandomIDs(lenght: number): ID[] {
  const ids = [];
  for (let i = 0; i < lenght; i++) {
    ids.push(randomID());
  }
  return ids;
}
