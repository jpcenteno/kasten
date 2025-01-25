import { writeFileSync } from "fs";
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
    writeFileSync(fullpath, "");
    return filename;
  }
}
