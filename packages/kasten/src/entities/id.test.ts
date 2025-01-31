import { ID, intoID, randomID } from "./id.js";

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
});

function arrayOfRandomIDs(lenght: number): ID[] {
  const ids = [];
  for (let i = 0; i < lenght; i++) {
    ids.push(randomID());
  }
  return ids;
}
