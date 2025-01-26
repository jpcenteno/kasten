import { Command } from "commander";
import { Zettelkasten } from "kasten";

const program = new Command("kasten");

const noteSubcomamnd = program.command("note");

noteSubcomamnd
  .command("new")
  .requiredOption(
    "-d, --directory <directory>",
    "Path to the Zettelkasten directory",
  )
  .requiredOption("-t, --title <title>", "Note title")
  .action((args: { directory: string; title: string }) => {
    const zk = new Zettelkasten(args.directory);
    const fileName = zk.newNote({ title: args.title, content: "some content" });
    console.log(zk.getFullPath(fileName));
  });

program.parse();
