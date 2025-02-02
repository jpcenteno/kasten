import path from "path";
import { expect } from "chai";
import { ZettelFileNameSchema } from "./zettel.filename.js";

describe("Parsing a string into a RelativePath", () => {
  describe("Given a simple filename", () => {
    const testCases = [
      "file.txt",
      "document.pdf",
      "image.jpeg",
      "my_script.sh",
      "data.json",
    ];

    testCases.forEach((input) => {
      it(`Should accept: ${input}`, () => {
        const result = ZettelFileNameSchema.safeParse(input);
        expect(result.success).to.equal(true);
        expect(result.data).to.equal(input);
      });
    });
  });

  describe("Given a path with directories that normalizes to a filename", () => {
    const testCases = [
      "./filename.txt",
      "dir/../file.txt",
      "./dir/../file.txt",
    ];

    testCases.forEach((testCase) => {
      it(`Should transform and validate: ${testCase}`, () => {
        const expectedBasename = path.basename(testCase);
        const result = ZettelFileNameSchema.safeParse(testCase);
        expect(result.success).to.equal(true);
        expect(result.data).to.equal(expectedBasename);
      });
    });
  });

  describe("Given a path with directories that can't be normalized to a single filename", () => {
    const testCases = [
      "../filename.txt",
      "folder/filename.txt",
      "/absolute/path.txt",
    ];

    testCases.forEach((testCase) => {
      it(`Should fail for: '${testCase}'`, () => {
        const result = ZettelFileNameSchema.safeParse(testCase);
        expect(result.success).to.equal(false);
      });
    });
  });
});
