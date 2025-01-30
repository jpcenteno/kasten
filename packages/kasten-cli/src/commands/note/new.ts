import { Command, Flags } from "@oclif/core";
import { Zettelkasten } from "kasten";

interface Output {
  title: string;
  relativePath: string;
  absolutePath: string;
}

export default class NoteNew extends Command {
  static override description = "Create a new note Zettel";
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
    title: Flags.string({
      char: "t",
      required: true,
      helpValue: "<title>",
      summary: "Title for the new note",
    }),
  };

  public async run(): Promise<Output> {
    const { flags } = await this.parse(NoteNew);
    const { title } = flags;

    const zk = new Zettelkasten(flags.directory);
    const filename = zk.newNote({ title: flags.title, content: "" });
    const absolutePath = zk.getFullPath(filename);
    this.log(absolutePath);

    return {
      title,
      relativePath: filename,
      absolutePath,
    };
  }
}
