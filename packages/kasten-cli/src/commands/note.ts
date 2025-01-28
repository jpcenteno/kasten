import { Command } from "commander";
import { command as noteNewCommand } from "./note_new";
import { command as noteListCommand } from "./note_list";

export const command = new Command("note")
  .addCommand(noteNewCommand)
  .addCommand(noteListCommand);
