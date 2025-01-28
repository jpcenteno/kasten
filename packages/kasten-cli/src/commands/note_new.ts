import { Command } from "commander";
import { Zettelkasten } from "kasten";

export const command = new Command("new")
  .option(
    "-d, --directory <directory>",
    "Path to the Zettelkasten directory. Defaults to KASTEN_DIR",
  )
  .requiredOption("-t, --title <title>", "Note title")
  .action((args: { directory: string | undefined; title: string }) => {
    const directory = args.directory ?? process.env.KASTEN_DIR;

    if (!directory || directory.trim() === "") {
      throw new Error(
        "The directory must be specified using -d/--directory or KASTEN_DIR must be defined.",
      );
    }

    const zk = new Zettelkasten(directory);
    const fileName = zk.newNote({ title: args.title, content: "" });
    console.log(zk.getFullPath(fileName));
  });
