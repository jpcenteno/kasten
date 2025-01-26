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

noteSubcomamnd
  .command("list")
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

program.parse();
