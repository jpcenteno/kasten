import { NoteZettel } from "./note_zettel";

const markdown = ["---", "title: Some title", "---", "Some content"].join("\n");

describe("NoteZettel", () => {
  describe("fromMarkdown", () => {
    it("Should extract the content", () => {
      const note = NoteZettel.fromMarkdown(markdown);
      expect(note.content).toEqual("Some content");
    });

    it("Should extract the title", () => {
      const note = NoteZettel.fromMarkdown(markdown);
      expect(note.title).toEqual("Some title");
    });

    it("Fails when the input has no title", () => {
      expect(() => {
        console.log(NoteZettel.fromMarkdown("---\n---\nSome content"));
      }).toThrow();
    });

    it("Throws when the title is blank", () => {
      expect(() => {
        console.log(
          NoteZettel.fromMarkdown('---\ntitle: \" \t\"\n---\nSome content'),
        );
      }).toThrow();
    });

    it("Trims the content part of the input string", () => {
      const markdown = [
        "---",
        "title: Some title",
        "---",
        " Some content",
        " \t",
      ].join("\n");
      const note = NoteZettel.fromMarkdown(markdown);
      expect(note.content).toStrictEqual("Some content");
    });
  });
});
