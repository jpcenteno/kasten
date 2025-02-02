import { randomID } from "./entities/id.js";
import { NoteZettel } from "./entities/note_zettel.js";
import matter from "gray-matter";
import { Title } from "./entities/title.js";
import { Store, ZettelFileName, ZettelFileNameSchema } from "./store/index.js";

export class Zettelkasten {
  protected readonly store: Store;

  constructor(store: Store) {
    this.store = store;
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
    this.store.writeSync(filename, data);
    return filename;
  }

  listNotes(): { id: ZettelFileName; title: string }[] {
    const result: { id: ZettelFileName; title: string }[] = [];

    this.store.listSync().forEach(({ id }) => {
      // FIXME use a type safe Result type instead of a try-catch
      try {
        const rawContent = this.store.readSync(id).content;
        const { title } = NoteZettel.fromMarkdown(rawContent);
        result.push({ id, title });
      } catch {
        // FIXME
      }
    });

    return result;
  }
}
