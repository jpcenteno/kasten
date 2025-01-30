import { tmpdir } from "os";
import { join } from "path";
import * as fs from "fs";

export function createTempDir(): string {
  return fs.mkdtempSync(join(tmpdir(), "test-"));
}
