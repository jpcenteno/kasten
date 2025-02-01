import { Command, Flags } from "@oclif/core";
import { Zettelkasten } from "kasten";
import { DirectoryStore } from "kasten/dist/store/index.js";

export type NoteListOutput = OutputRecord[];

interface OutputRecord {
  title: string;
  relativePath: string;
  absolutePath: string;
}

export default class NoteList extends Command {
  static override description = "List note zettels";
  static override examples = ["<%= config.bin %> <%= command.id %> --help"];
  static override enableJsonFlag = true;
  static override flags = {
    directory: Flags.string({
      char: "d",
      required: true,
      env: "KASTEN_DIR",
      helpValue: "<directory>",
      summary: "Path to the Zettelkasten directory",
    }),
  };

  public async run(): Promise<NoteListOutput> {
    const { flags } = await this.parse(NoteList);

    const directoryStore = new DirectoryStore(flags.directory);
    const zk = new Zettelkasten(directoryStore);
    const notes: NoteListOutput = zk.listNotes().map((note) => ({
      title: note.title,
      relativePath: note.id,
      absolutePath: directoryStore.absolutePath(note.id),
    }));

    if (notes.length === 0) {
      this.warn("Notes store is empty");
    }

    notes.forEach(({ relativePath, title }) => {
      this.log(`${relativePath}\t${title}`);
    });

    return notes;
  }
}
