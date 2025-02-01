import { expect } from "chai";
import { NoteZettel } from "./note_zettel.js";

const markdown = ["---", "title: Some title", "---", "Some content"].join("\n");

describe("NoteZettel", () => {
  describe("fromMarkdown", () => {
    describe("Given a well-formed note", () => {
      it("Should extract the content", () => {
        const note = NoteZettel.fromMarkdown(markdown);
        expect(note.content).to.equal("Some content");
      });

      it("Should extract the title", () => {
        const note = NoteZettel.fromMarkdown(markdown);
        expect(note.title).to.equal("Some title");
      });

      it("Should trim the content part of the input string", () => {
        const markdown = [
          "---",
          "title: Some title",
          "---",
          " Some content",
          " \t",
        ].join("\n");
        const note = NoteZettel.fromMarkdown(markdown);
        expect(note.content).to.equal("Some content");
      });
    });

    describe("Given notes with invalid titles", () => {
      it("Should fail when the input has no title", () => {
        expect(() => {
          NoteZettel.fromMarkdown("---\n---\nSome content");
        }).to.throw();
      });

      it("Throws when the title is blank", () => {
        expect(() => {
          NoteZettel.fromMarkdown('---\ntitle: " \t"\n---\nSome content');
        }).to.throw();
      });
    });
  });

  describe("stringify", () => {
    it("Should produce a string that can be recovered with fromMarkdown", () => {
      // Arrange:
      const note = NoteZettel.fromMarkdown(markdown);

      // Act:
      const s = note.stringify();

      // Assert:
      expect(NoteZettel.fromMarkdown(s)).to.deep.equal(note);
    });
  });
});
