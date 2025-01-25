import { Zettelkasten } from "./index";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const params = { title: "Some title", content: "Some content" };

describe("Zettelkasten", () => {
  let dir: string;
  let zk: Zettelkasten;

  beforeEach(() => {
    dir = tmpDir();
    zk = new Zettelkasten(dir);
  });

  it("Creates a new file at the directory", () => {
    // Act:
    const filename = zk.newNote(params);

    // Assert:
    const notePath = path.join(dir, filename);
    expect(fs.existsSync(notePath)).toBeTruthy();
  });

  it("Creates a two files at the directory", () => {
    // Act:
    const filename1 = zk.newNote(params);
    const filename2 = zk.newNote(params);

    // Assert:
    expect(filename1).not.toEqual(filename2);
    expect(fs.existsSync(path.join(dir, filename1))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, filename2))).toBeTruthy();
    expect(fs.readdirSync(dir)).toHaveLength(2);
  });

  // TODO Refactor the test using an actual note parser once we have the
  // implementation.
  it("Includes the title on the new file", () => {
    // Act:
    const filename = zk.newNote(params);

    // Assert:
    const rawContents = fs.readFileSync(path.join(dir, filename), "utf-8");
    expect(rawContents).toContain(params.title);
  });

  // TODO Refactor the test using an actual note parser once we have the
  // implementation.
  it("Includes the content on the new file", () => {
    // Act:
    const filename = zk.newNote(params);

    // Assert:
    const rawContents = fs.readFileSync(path.join(dir, filename), "utf-8");
    expect(rawContents).toContain(params.content);
  });
});

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zk-test-"));
  return dir;
}
