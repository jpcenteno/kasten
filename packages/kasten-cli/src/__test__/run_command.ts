import { spawnSync } from "child_process";

export interface CommandResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

export function runCommand(args: string[] = []): CommandResult {
  const result = spawnSync("./bin/run.js", args, {
    shell: true,
    encoding: "utf-8",
    cwd: "./packages/kasten-cli",
  });
  return {
    exitCode: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}
