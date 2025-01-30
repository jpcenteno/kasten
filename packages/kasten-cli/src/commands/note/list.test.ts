import { spawnSync } from "child_process";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import * as fs from "fs";

const testNotes = [
  {
    relativePath: "note-1.mdx",
    txt: "---\ntitle: Title 1\n---\nContent 1\n",
    title: "Title 1",
  },
  {
    relativePath: "note-2.mdx",
    txt: "---\ntitle: Title 2\n---\nContent 2\n",
    title: "Title 2",
  },
];

describe("`note list` subcommand", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "test-"));
  });

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
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
        fs.writeFileSync(join(tempDir, o.relativePath), o.txt);
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
        fs.writeFileSync(join(tempDir, o.relativePath), o.txt);
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
          absolutePath: join(tempDir, testNote.relativePath),
        }))
        .forEach((expectedObject) => {
          expect(parsed).toContainEqual(expectedObject);
        });
    });
  });
});

interface CommandResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

function runCommand(args: string[] = []): CommandResult {
  const result = spawnSync("./bin/run.js", args, {
    shell: true,
    encoding: "utf-8",
    cwd: "./packages/kasten-cli",
  });
  return {
    exitCode: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}
