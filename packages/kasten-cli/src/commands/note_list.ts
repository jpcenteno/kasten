import { Command } from "commander";
import { Zettelkasten } from "kasten";

export const command = new Command("list")
  .requiredOption(
    "-d, --directory <directory>",
    "Path to the Zettelkasten directory",
  )
  .action((args: { directory: string; title: string }) => {
    const zk = new Zettelkasten(args.directory);
    const notes = zk.listNotes();
    notes.forEach(({ id, title }) => {
      console.log(`${id}\t${title}`);
    });
  });
