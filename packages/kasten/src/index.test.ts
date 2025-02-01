import { Zettelkasten } from "./index.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { randomID } from "./entities/id.js";
import { TitleSchema } from "./entities/title.js";
import { expect } from "chai";

const title = TitleSchema.parse("Some title");
const params = { title: title, content: "Some content" };

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
      expect(fileExistsInDirSync(filename)).to.equal(true);
    });

    it("Creates two files at the directory", () => {
      // Act:
      const filename1 = zk.newNote(params);
      const filename2 = zk.newNote(params);

      // Assert:
      expect(filename1).not.to.equal(filename2);
      expect(fileExistsInDirSync(filename1)).to.equal(true);
      expect(fileExistsInDirSync(filename2)).to.equal(true);
      expect(fs.readdirSync(dir)).to.have.length(2);
    });

    // TODO Refactor the test using an actual note parser once we have the
    // implementation.
    it("Includes the title on the new file", () => {
      // Act:
      const filename = zk.newNote(params);

      // Assert:
      const rawContents = readRawFileSync(filename);
      expect(rawContents).to.contain(params.title);
    });

    // TODO Refactor the test using an actual note parser once we have the
    // implementation.
    it("Includes the content on the new file", () => {
      // Act:
      const filename = zk.newNote(params);

      // Assert:
      const rawContents = readRawFileSync(filename);
      expect(rawContents).to.contain(params.content);
    });
  });

  describe("getFullPath", () => {
    it("Returns the full given a Zettel ID", () => {
      const fileName = randomID() + ".mdx";
      const result = zk.getFullPath(fileName);
      expect(result).to.equal(dir + "/" + fileName);
    });
  });

  describe("listNotes", () => {
    it("Returns [] when the directory is empty", () => {
      expect(zk.listNotes()).to.have.length(0);
    });

    describe("Given a directory with notes", () => {
      it("Should have the same lenght as the number of notes in the directory", () => {
        // Arrange:
        zk.newNote({
          title: TitleSchema.parse("Title 1"),
          content: "content 1",
        });
        zk.newNote({
          title: TitleSchema.parse("Title 2"),
          content: "content 2",
        });
        zk.newNote({
          title: TitleSchema.parse("Title 3"),
          content: "content 3",
        });

        // Act:
        const notes = zk.listNotes();

        // Assert:
        expect(notes).to.have.length(3);
      });

      it("Should list the titles of each note in the directory", () => {
        // Arrange:
        zk.newNote({
          title: TitleSchema.parse("Title 1"),
          content: "content 1",
        });
        zk.newNote({
          title: TitleSchema.parse("Title 2"),
          content: "content 2",
        });
        zk.newNote({
          title: TitleSchema.parse("Title 3"),
          content: "content 3",
        });

        // Act:
        const notes = zk.listNotes();

        // Assert:
        const titles = new Set(notes.map((note) => note.title));
        expect(titles).to.contain("Title 1");
        expect(titles).to.contain("Title 2");
        expect(titles).to.contain("Title 3");
      });

      it("Should list the IDs of each note in the directory", () => {
        // Arrange:
        const ids: Set<string> = new Set();
        ids.add(
          zk.newNote({
            title: TitleSchema.parse("Title 1"),
            content: "content 1",
          }),
        );
        ids.add(
          zk.newNote({
            title: TitleSchema.parse("Title 2"),
            content: "content 2",
          }),
        );
        ids.add(
          zk.newNote({
            title: TitleSchema.parse("Title 3"),
            content: "content 3",
          }),
        );

        // Act:
        const notes = zk.listNotes();

        // Assert:
        expect(new Set(notes.map((note) => note.id))).to.deep.equal(ids);
      });
    });

    describe("Given a directory with a corrupted note", () => {
      beforeEach(async () => {
        await writeGoodNoteAndCorruptedNote(dir);
      });

      it("Should not fail", () => {
        expect(() => zk.listNotes()).not.to.throw();
      });

      it("Should return an array with only the uncorrupted notes", () => {
        const result = zk.listNotes();
        expect(result).to.have.length(1);
        expect(result[0].title).to.equal("Some title");
        expect(result[0].id).to.equal("good.mdx");
      });
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

/**
 * Writes a "good" and a "corrupted" note to the directory.
 *
 * The "good" note should not have any issue with the parser while the
 * "corrupted" note should trigger a parser error.
 */
export async function writeGoodNoteAndCorruptedNote(directory: string) {
  const noteData = [
    { name: "good.mdx", txt: "---\ntitle: Some title\n---\n" },
    { name: "bad.mdx", txt: "---\n---\n" },
  ];

  const promises = noteData.map(({ name, txt }) => {
    const absolutePath = path.resolve(directory, name);
    return fs.promises.writeFile(absolutePath, txt);
  });

  // FIXME is it the same if I return this?
  await Promise.all(promises);
}
