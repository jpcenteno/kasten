import fs from "fs";
import { beforeEach, it } from "mocha";
import { expect } from "chai";
import { runCommand } from "@oclif/test";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { Errors as OclifErrors } from "@oclif/core";

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

describe("Given an existing directory and a valid title", () => {
  it("Should create a new file in the directory", async () => {
    expect(fs.readdirSync(dir)).to.have.length(0);

    await runCommand(`note new -d ${dir} -t "Some title"`, { root });

    expect(fs.readdirSync(dir)).to.have.length(1);
  });

  it("Should print the absolute path to the new file", async () => {
    const capture = await runCommand(`note new -d ${dir} -t "Some title"`, {
      root,
    });

    // Here we are assuming the command execution created a file and that it's
    // the only file in the `testDirectory`. This assumption is covered by a
    // previous test, which at the time of writing is called "Creates a new
    // file".
    const actualRelativePath = fs.readdirSync(dir)[0];
    const actualAbsolutePath = path.resolve(dir, actualRelativePath);
    expect(capture.stdout.trim()).to.equal(actualAbsolutePath);
  });

  it("Should return the path to an MDX file", async () => {
    const capture = await runCommand(`note new -d ${dir} -t "Some title"`, {
      root,
    });
    const printedPath = capture.stdout.trim();
    expect(path.extname(printedPath)).to.equal(".mdx");
  });

  describe("It should generate a blank MDX document", () => {
    it.skip("Should be parseable by the core library", async () => {});
    it.skip("Should have the title given by the user", async () => {});
    it.skip("Should have no content", async () => {});
  });
});

describe("When given an un-trimmed title", () => {
  it.skip("Should trim it before saving to disk", () => {});
});

describe("When running the command multiple times", () => {
  const N = 5;
  let captures: CaptureResult<unknown>[];

  beforeEach(async () => {
    captures = [];
    for (let i = 0; i < N; i++) {
      const capture = await runCommand(`note new -d ${dir} -t "Note ${i}"`, {
        root,
      });

      captures.push(capture);
    }
  });

  it("Should create N new files in the directory", async () => {
    expect(fs.readdirSync(dir)).to.have.length(N);
  });

  it("Should output N distinct filenames", () => {
    const distinctOutputs = new Set(
      captures.map((capture) => capture.stdout.trim()),
    );
    expect(distinctOutputs).to.have.length(N);
  });

  it("Each printed filename should correspond to a file in the directory", () => {
    const directoryFiles = fs.readdirSync(dir);
    captures.forEach((capture) => {
      const printedAbsolutePath = capture.stdout.trim();
      const printedRelativePath = path.relative(dir, printedAbsolutePath);
      expect(printedRelativePath).to.be.oneOf(directoryFiles);
    });
  });
});

describe("When passing the --json flag", () => {
  let capture: CaptureResult<unknown>;
  beforeEach(async () => {
    capture = await runCommand(`note new --json -d ${dir} -t "some title"`, {
      root,
    });
  });

  it("should return a valid JSON object", async () => {
    expect(parseCapturedStdout).not.to.throw(SyntaxError);
  });

  it("Should include the title in the JSON output", () => {
    const output = parseCapturedStdout();
    expect(output).to.include.keys("title");
    expect(parseCapturedStdout()["title"]).to.equal("some title");
  });

  it("Should include an absolute path to a file in the JSON output", () => {
    const output = parseCapturedStdout();
    expect(output).to.include.keys("absolutePath");
    expect(fs.existsSync(output["absolutePath"])).to.equal(true);
  });

  it("Should include a relative path in the JSON output", () => {
    const output = parseCapturedStdout();
    expect(output).to.include.keys("relativePath");

    const relativePath = output["relativePath"];
    expect(relativePath).to.be.a("string");
  });

  it("Should return matching absolute and relative paths", () => {
    const { relativePath, absolutePath } = parseCapturedStdout() as {
      relativePath: string;
      absolutePath: string;
    };

    expect(path.join(dir, relativePath)).to.equal(absolutePath);
  });

  function parseCapturedStdout(): object {
    return JSON.parse(capture.stdout);
  }
});

describe("When passed bad arguments", () => {
  it("Should fail when the title is empty", async () => {
    const capture = await runCommand(`note new -d ${dir} -t ""`, {
      root,
    });

    expect(capture.error).to.be.instanceOf(OclifErrors.CLIError);
    expect(capture.error?.message).to.be.equal(
      "Zettel title must be non-blank",
    );
  });

  it("Should fail when the title is blank (but not empty)", async () => {
    const capture = await runCommand(`note new -d ${dir} -t "\t "`, {
      root,
    });

    expect(capture.error).to.be.instanceOf(OclifErrors.CLIError);
    expect(capture.error?.message).to.be.equal(
      "Zettel title must be non-blank",
    );
  });

  it.skip("Should print an informative error when the directory does not exist", () => {});
});
