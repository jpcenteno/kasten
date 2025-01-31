import { intoZettelId } from "./entities.js";

describe("ZettelId", () => {
  describe("intoZettelId", () => {
    it("Cannot be empty", () => {
      expect(() => {
        intoZettelId("");
      }).toThrow("Id cannot be empty.");
    });

    it("Does not trim strings", () => {
      expect(intoZettelId(" some-title")).toStrictEqual(" some-title");
    });

    it.each([[" ", "\t", "\n", " \n\t", "foo"]])(
      "Accepts non-empty strings (Yeah, filenames allow whitespace)",
      (s) => {
        expect(intoZettelId(s)).toStrictEqual(s);
      },
    );
  });
});
