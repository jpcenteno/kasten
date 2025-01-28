import { Command } from "commander";
import { command as noteCommand } from "./commands/note";

new Command("kasten").addCommand(noteCommand).parse();
