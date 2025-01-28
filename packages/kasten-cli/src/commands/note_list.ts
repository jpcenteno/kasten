import { Command } from "commander";
import { Zettelkasten } from "kasten";

export const command = new Command("list")
  .option("-d, --directory <directory>", "Path to the Zettelkasten directory")
  .action((args: { directory: string | undefined; title: string }) => {
    const directory = args.directory ?? process.env.KASTEN_DIR;

    if (!directory || directory.trim() === "") {
      throw new Error(
        "The directory must be specified using -d/--directory or KASTEN_DIR must be defined.",
      );
    }

    const zk = new Zettelkasten(directory);
    const notes = zk.listNotes();
    notes.forEach(({ id, title }) => {
      console.log(`${id}\t${title}`);
    });
  });
