import { Command, Flags } from "@oclif/core";
import { Zettelkasten } from "kasten";

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

  public async run(): Promise<OutputRecord[]> {
    const { flags } = await this.parse(NoteList);

    const zk = new Zettelkasten(flags.directory);
    const notes: OutputRecord[] = zk.listNotes().map((note) => ({
      title: note.title,
      relativePath: note.id,
      absolutePath: zk.getFullPath(note.id),
    }));

    notes.forEach(({ relativePath, title }) => {
      this.log(`${relativePath}\t${title}`);
    });

    return notes;
  }
}
