import path from "path";
import fs from "fs";
import { runCommand } from "kasten-cli/src/__test__/run_command";
import { testNotes } from "kasten-cli/src/__test__/test_data";
import { createTempDir } from "kasten-cli/src/__test__/temp_dir";

describe("`note list` subcommand", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("`-d <dir>` (text output)", () => {
    it("With an empty store", () => {
      const result = runCommand(["note", "list", "-d", tempDir]);

      expect(result.exitCode).toStrictEqual(0);
      expect(result.stderr).toContain("Warning: Notes store is empty");
      expect(result.stdout).toEqual("");
    });

    it("Given a store with some notes", () => {
      testNotes.forEach((o) => {
        fs.writeFileSync(path.join(tempDir, o.relativePath), o.txt);
      });

      const result = runCommand(["note", "list", "-d", tempDir]);
      const outputLines = result.stdout.trim().split("\n");

      expect(outputLines).toHaveLength(testNotes.length);
      testNotes.forEach((note) => {
        expect(outputLines).toContain(`${note.relativePath}\t${note.title}`);
      });
    });
  });

  describe("`--json -d <dir>`", () => {
    it("Given an empty store", () => {
      const result = runCommand(["note", "list", "--json", "-d", tempDir]);

      expect(result.exitCode).toStrictEqual(0);
      expect(JSON.parse(result.stdout)).toEqual([]);
    });

    it("Given a store with some notes", () => {
      testNotes.forEach((o) => {
        fs.writeFileSync(path.join(tempDir, o.relativePath), o.txt);
      });

      const result = runCommand(["note", "list", "--json", "-d", tempDir]);
      const parsed = JSON.parse(result.stdout);
      expect(Object.prototype.toString.call(parsed)).toEqual("[object Array]");

      expect(result.exitCode).toStrictEqual(0);
      expect(parsed).toHaveLength(testNotes.length);
      testNotes
        .map((testNote) => ({
          title: testNote.title,
          relativePath: testNote.relativePath,
          absolutePath: path.join(tempDir, testNote.relativePath),
        }))
        .forEach((expectedObject) => {
          expect(parsed).toContainEqual(expectedObject);
        });
    });
  });
});
