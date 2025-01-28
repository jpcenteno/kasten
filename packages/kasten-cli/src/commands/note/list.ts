import { Command, Flags } from "@oclif/core";
import { Zettelkasten } from "kasten";

export default class NoteList extends Command {
  static override description = "List note zettels";
  static override examples = ["<%= config.bin %> <%= command.id %> --help"];
  static override flags = {
    directory: Flags.string({
      char: "d",
      required: true,
      env: "KASTEN_DIR",
      helpValue: "<directory>",
      summary: "Path to the Zettelkasten directory",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(NoteList);

    const zk = new Zettelkasten(flags.directory);
    const notes = zk.listNotes();

    notes.forEach(({ id, title }) => {
      console.log(`${id}\t${title}`);
    });
  }
}
