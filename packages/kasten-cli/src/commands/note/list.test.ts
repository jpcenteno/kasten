import fs from "fs";
import { beforeEach, it } from "mocha";
import { expect } from "chai";
import { runCommand } from "@oclif/test";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { Errors as OclifErrors } from "@oclif/core";
import { testNotes } from "kasten-cli/src/__test__/test_data.js";

type CaptureResult<T> = {
  error?: Error & Partial<OclifErrors.CLIError>;
  result?: T;
  stderr: string;
  stdout: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "test-"));
});

afterEach(() => {
  if (dir) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
describe("When calling `note list -d <dir>`", () => {
  describe("Given an empty directory", () => {
    let capture: CaptureResult<unknown>;

    beforeEach(async () => {
      capture = await runCommand(`note list -d ${dir}`, { root });
    });

    it("Should warn the user that the store is empty", async () => {
      expect(capture.stderr).to.contain("Warning: Notes store is empty");
    });

    it("Should not print anything to the STDOUT", async () => {
      expect(capture.stdout).to.equal("");
    });
  });

  describe("Given a store with some notes.", () => {
    let stdoutLines: string[];
    let capture: CaptureResult<unknown>;

    beforeEach(async () => {
      await writeTestNotesToDirectory(dir);

      capture = await runCommand(`note list -d ${dir}`, { root });
      stdoutLines = capture.stdout.trim().split("\n");
    });

    it("Should print the same amount of lines than notes in the directory.", async () => {
      expect(stdoutLines).to.have.length(testNotes.length);
    });

    it("It should print a line with the data for each note in the directory.", async () => {
      testNotes.forEach((note) => {
        const expectedLine = `${note.relativePath}\t${note.title}`;
        expect(stdoutLines).to.contain(expectedLine);
      });
    });

    it("Should not print anything to the STDERR (in this case)", async () => {
      expect(capture.stderr).to.equal("");
    });
  });
});

describe("When calling `note list --json -d <dir>`", () => {
  describe("Given an empty directory:", () => {
    let capture: CaptureResult<unknown>;

    beforeEach(async () => {
      capture = await runCommand(`note list --json -d ${dir}`, { root });
    });

    it("It should not print anything to STDERR.", () => {
      expect(capture.stderr).to.equal("");
    });

    it("It should print an empty JSON array", () => {
      expect(JSON.parse(capture.stdout)).to.deep.equal([]);
    });
  });

  describe("Given a store with some notes:", () => {
    let capture: CaptureResult<unknown>;

    beforeEach(async () => {
      await writeTestNotesToDirectory(dir);

      capture = await runCommand(`note list --json -d ${dir}`, { root });
    });

    it("It should return an array", () => {
      expect(JSON.parse(capture.stdout)).to.be.an("array");
    });

    it("It Should return a list with the same number of elements than notes in the store.", () => {
      const expectedLength = testNotes.length;
      expect(JSON.parse(capture.stdout)).to.have.length(expectedLength);
    });

    it("It should set the note attributes correctly", () => {
      const parsed = JSON.parse(capture.stdout);

      testNotes
        .map((testNote) => ({
          title: testNote.title,
          relativePath: testNote.relativePath,
          absolutePath: path.join(dir, testNote.relativePath),
        }))
        .forEach((expected) => {
          expect(parsed).to.deep.contain(expected);
        });
    });
  });
});

async function writeTestNotesToDirectory(directory: string): Promise<void> {
  const promises = testNotes.map((testNote) => {
    const absolutePath = path.join(directory, testNote.relativePath);
    return fs.promises.writeFile(absolutePath, testNote.txt);
  });
  Promise.all(promises);
}
