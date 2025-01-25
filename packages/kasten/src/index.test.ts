import { Zettelkasten } from "./index";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("Zettelkasten", () => {
  it("Creates a new file at the directory", () => {
    // Arrange:
    const dir = tmpDir();
    const zk = new Zettelkasten(dir);
    const params = { title: "Some title", content: "Some content" };

    // Act:
    const filename = zk.newNote(params);

    // Assert:
    const notePath = path.join(dir, filename);
    expect(fs.existsSync(notePath)).toBeTruthy();
  });

  it("Creates a two files at the directory", () => {
    // Arrange:
    const dir = tmpDir();
    const zk = new Zettelkasten(dir);
    const params1 = { title: "Some title 1", content: "Some content" };
    const params2 = { title: "Some title 2", content: "Some content" };

    // Act:
    const filename1 = zk.newNote(params1);
    const filename2 = zk.newNote(params2);

    // Assert:
    expect(filename1).not.toEqual(filename2);
    expect(fs.existsSync(path.join(dir, filename1))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, filename2))).toBeTruthy();
    expect(fs.readdirSync(dir)).toHaveLength(2);
  });
});

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zk-test-"));
  return dir;
}
