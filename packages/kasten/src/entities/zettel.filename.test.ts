import path from "path";
import { expect } from "chai";
import {
  generateRandomZettelFileName,
  ZettelFileNameSchema,
} from "./zettel.filename.js";

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

describe("generateRandomZettelFileName", () => {
  it("Should generate a different value each time it's called", () => {
    const results = Array.from({ length: 50 }, () =>
      generateRandomZettelFileName(),
    );
    const distinctResults = new Set(results);
    expect(distinctResults).to.have.length(results.length);
  });

  it("Should set the specified extension", () => {
    const result = generateRandomZettelFileName("mdx");
    expect(path.extname(result)).to.equal(".mdx");
  });
});
