import fs from "fs";
import { runCommand } from "kasten-cli/src/__test__/run_command.js";
import { createTempDir } from "kasten-cli/src/__test__/temp_dir.js";
import path from "path";

describe("`note new` subcommand", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("Creates a new note", () => {
    it("Creates a new file at the directory", () => {
      const title = "Test Note";

      expect(fs.readdirSync(tempDir)).toHaveLength(0);

      const result = runCommand(["note", "new", "-d", tempDir, "-t", title]);
      const filename = result.stdout.trim();

      expect(fs.readdirSync(tempDir)).toHaveLength(1);
      expect(fs.existsSync(filename)).toBeTruthy();
    });

    it("Creates two files at the directory", () => {
      const title1 = "Test Note 1";
      const title2 = "Test Note 2";

      const result1 = runCommand(["note", "new", "-d", tempDir, "-t", title1]);
      const result2 = runCommand(["note", "new", "-d", tempDir, "-t", title2]);
      const filename1 = result1.stdout.trim();
      const filename2 = result2.stdout.trim();

      expect(filename1).not.toEqual(filename2);
      expect(fs.existsSync(filename1)).toBeTruthy();
      expect(fs.existsSync(filename2)).toBeTruthy();
      expect(fs.readdirSync(tempDir)).toHaveLength(2);
    });
  });

  describe("File content validation", () => {
    it("Includes the title on the new file", () => {
      const title = "Test Note with Title";
      const result = runCommand(["note", "new", "-d", tempDir, "-t", title]);

      const filename = result.stdout.trim();
      const rawContents = fs.readFileSync(filename, "utf-8");

      expect(rawContents).toContain(title);
    });
  });

  describe("JSON output", () => {
    it("Returns JSON format when --json is specified", () => {
      const title = "JSON Test Note";

      const result = runCommand([
        "note",
        "new",
        "-d",
        tempDir,
        "-t",
        title,
        "--json",
      ]);

      expect(result.exitCode).toStrictEqual(0);

      const parsed = JSON.parse(result.stdout);

      // Returns the title just in case.
      expect(parsed).toHaveProperty("title", title);

      // Tells us the relative path.
      expect(parsed).toHaveProperty("relativePath");

      // The new file has MDX extension.
      expect(parsed.relativePath).toMatch(/\.mdx$/);

      // The absolute path matches <directory> + <relativePath>.
      const expectedAbsolutePath = path.resolve(tempDir, parsed.relativePath);
      expect(parsed).toHaveProperty("absolutePath", expectedAbsolutePath);

      // And it exists.
      expect(fs.existsSync(parsed.absolutePath)).toBeTruthy();
    });
  });

  describe.skip("Fails when the title is blank", () => {
    const result = runCommand(["note", "new", "-d", tempDir, "-t", "\t"]);

    console.log({ result });
    expect(result.exitCode).not.toEqual(0);
    expect(result.stderr).toContain("Error: Title cannot be blank");
  });
});
