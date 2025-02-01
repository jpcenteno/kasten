import * as fs from "fs";
import path from "path";
import { randomID } from "./entities/id.js";
import { NoteZettel } from "./entities/note_zettel.js";
import matter from "gray-matter";
import { Title } from "./entities/title.js";

export class Zettelkasten {
  protected readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  newNote({ title, content }: { title: Title; content: string }): string {
    const filename = randomID() + ".mdx";
    const data = matter.stringify(content, { title });
    fs.writeFileSync(this.getFullPath(filename), data);
    return filename;
  }

  getFullPath(id: string): string {
    return path.resolve(this.directory, id);
  }

  listNotes(): { id: string; title: string }[] {
    // FIXME This code is horrible. Refactor `fromMarkdown` to return a
    // type-safe result type and refactor this into some functional code.
    const result: { id: string; title: string }[] = [];
    const relativePaths = fs.readdirSync(this.directory);
    for (let i = 0; i < relativePaths.length; i++) {
      try {
        const relativePath = relativePaths[i];
        const title = getTitle(this.getFullPath(relativePath));
        result.push({ id: relativePath, title });
      } catch (error) {
        // FIXME handle the error.
      }
    }

    return result;
  }
}

// FIXME this is an horrible solution for the naive case. Delete this once the
// NoteZettel entity is implemented.
function getTitle(fullPath: string): string {
  const md = fs.readFileSync(fullPath, "utf8");
  const note = NoteZettel.fromMarkdown(md);
  return note.title;
}
