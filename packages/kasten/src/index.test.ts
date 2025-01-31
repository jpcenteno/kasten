import { Zettelkasten } from "./index.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { randomID } from "./entities/id.js";

const params = { title: "Some title", content: "Some content" };

describe("Zettelkasten", () => {
  let dir: string;
  let zk: Zettelkasten;

  beforeEach(() => {
    dir = tmpDir();
    zk = new Zettelkasten(dir);
  });

  afterEach(() => {
    fs.rmdirSync(dir, { recursive: true });
  });

  describe("newNote", () => {
    it("Creates a new file at the directory", () => {
      // Act:
      const filename = zk.newNote(params);

      // Assert:
      expect(fileExistsInDirSync(filename)).toBeTruthy();
    });

    it("Creates two files at the directory", () => {
      // Act:
      const filename1 = zk.newNote(params);
      const filename2 = zk.newNote(params);

      // Assert:
      expect(filename1).not.toEqual(filename2);
      expect(fileExistsInDirSync(filename1)).toBeTruthy();
      expect(fileExistsInDirSync(filename2)).toBeTruthy();
      expect(fs.readdirSync(dir)).toHaveLength(2);
    });

    // TODO Refactor the test using an actual note parser once we have the
    // implementation.
    it("Includes the title on the new file", () => {
      // Act:
      const filename = zk.newNote(params);

      // Assert:
      const rawContents = readRawFileSync(filename);
      expect(rawContents).toContain(params.title);
    });

    // TODO Refactor the test using an actual note parser once we have the
    // implementation.
    it("Includes the content on the new file", () => {
      // Act:
      const filename = zk.newNote(params);

      // Assert:
      const rawContents = readRawFileSync(filename);
      expect(rawContents).toContain(params.content);
    });
  });

  describe("getFullPath", () => {
    it("Returns the full given a Zettel ID", () => {
      const fileName = randomID() + ".mdx";
      const result = zk.getFullPath(fileName);
      expect(result).toStrictEqual(dir + "/" + fileName);
    });
  });

  describe("listNotes", () => {
    it("Returns [] when the directory is empty", () => {
      expect(zk.listNotes()).toHaveLength(0);
    });

    it("Should have the same lenght as the number of notes in the directory", () => {
      // Arrange:
      zk.newNote({ title: "Title 1", content: "content 1" });
      zk.newNote({ title: "Title 2", content: "content 2" });
      zk.newNote({ title: "Title 3", content: "content 3" });

      // Act:
      const notes = zk.listNotes();

      // Assert:
      expect(notes).toHaveLength(3);
    });

    it("Should list the titles of each note in the directory", () => {
      // Arrange:
      zk.newNote({ title: "Title 1", content: "content 1" });
      zk.newNote({ title: "Title 2", content: "content 2" });
      zk.newNote({ title: "Title 3", content: "content 3" });

      // Act:
      const notes = zk.listNotes();

      // Assert:
      const titles = new Set(notes.map((note) => note.title));
      expect(titles).toContain("Title 1");
      expect(titles).toContain("Title 2");
      expect(titles).toContain("Title 3");
    });

    it("Should list the IDs of each note in the directory", () => {
      // Arrange:
      const ids: Set<string> = new Set();
      ids.add(zk.newNote({ title: "Title 1", content: "content 1" }));
      ids.add(zk.newNote({ title: "Title 2", content: "content 2" }));
      ids.add(zk.newNote({ title: "Title 3", content: "content 3" }));

      // Act:
      const notes = zk.listNotes();

      // Assert:
      expect(new Set(notes.map((note) => note.id))).toEqual(ids);
    });
  });

  function readRawFileSync(filename: string): string {
    return fs.readFileSync(path.join(dir, filename), "utf-8");
  }

  function fileExistsInDirSync(filename: string): boolean {
    return fs.existsSync(path.join(dir, filename));
  }
});

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zk-test-"));
  return dir;
}
