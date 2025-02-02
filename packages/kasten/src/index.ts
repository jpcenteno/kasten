import { randomID } from "./entities/id.js";
import { NoteZettel } from "./entities/note_zettel.js";
import matter from "gray-matter";
import { Title } from "./entities/title.js";
import {
  DirectoryStore,
  ZettelFileName,
  ZettelFileNameSchema,
} from "./store/index.js";

export class Zettelkasten {
  protected readonly storageBackend: DirectoryStore;

  constructor(storageBackend: DirectoryStore) {
    this.storageBackend = storageBackend;
  }

  newNote({
    title,
    content,
  }: {
    title: Title;
    content: string;
  }): ZettelFileName {
    const filename = ZettelFileNameSchema.parse(randomID() + ".mdx");
    const data = matter.stringify(content, { title });
    this.storageBackend.writeSync(filename, data);
    return filename;
  }

  listNotes(): { id: ZettelFileName; title: string }[] {
    const result: { id: ZettelFileName; title: string }[] = [];

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
