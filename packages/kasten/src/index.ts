import { randomID } from "./entities/id.js";
import { NoteZettel } from "./entities/note_zettel.js";
import matter from "gray-matter";
import { Title } from "./entities/title.js";
import { DirectoryStore } from "./storage-backend/index.js";

export class Zettelkasten {
  protected readonly storageBackend: DirectoryStore;

  constructor(storageBackend: DirectoryStore) {
    this.storageBackend = storageBackend;
  }

  newNote({ title, content }: { title: Title; content: string }): string {
    const filename = randomID() + ".mdx";
    const data = matter.stringify(content, { title });
    this.storageBackend.writeSync(filename, data);
    return filename;
  }

  listNotes(): { id: string; title: string }[] {
    const result: { id: string; title: string }[] = [];

    this.storageBackend.listSync().forEach(({ id }) => {
      // FIXME use a type safe Result type instead of a try-catch
      try {
        const rawContent = this.storageBackend.readSync(id).content;
        const { title } = NoteZettel.fromMarkdown(rawContent);
        result.push({ id, title });
      } catch {
        // FIXME
      }
    });

    return result;
  }
}
