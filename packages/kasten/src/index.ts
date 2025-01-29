import * as fs from "fs";
import path from "path";
import { randomID } from "./entities/id.js";
import { NoteZettel } from "./entities/note_zettel.js";
import matter from "gray-matter";

export class Zettelkasten {
  protected readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  newNote({ title, content }: { title: string; content: string }): string {
    const filename = randomID() + ".mdx";
    const fullpath = path.join(this.directory, filename);
    const data = matter.stringify(content, { title });
    fs.writeFileSync(fullpath, data);
    return filename;
  }

  getFullPath(id: string): string {
    return path.resolve(this.directory, id);
  }

  listNotes(): { id: string; title: string }[] {
    return fs.readdirSync(this.directory).map((fileName) => ({
      id: fileName,
      title: getTitle(this.getFullPath(fileName)),
    }));
  }
}

// FIXME this is an horrible solution for the naive case. Delete this once the
// NoteZettel entity is implemented.
function getTitle(fullPath: string): string {
  const md = fs.readFileSync(fullPath, "utf8");
  const note = NoteZettel.fromMarkdown(md);
  return note.title;
}
