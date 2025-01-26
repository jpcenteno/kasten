import * as fs from "fs";
import path from "path";
import { randomID } from "./entities/id";

export class Zettelkasten {
  protected readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  newNote({ title, content }: { title: string; content: string }): string {
    const filename = randomID() + ".mdx";
    const fullpath = path.join(this.directory, filename);
    fs.writeFileSync(fullpath, `${title}\n${content}`);
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
  return fs.readFileSync(fullPath, "utf8").split("\n")[0];
}
