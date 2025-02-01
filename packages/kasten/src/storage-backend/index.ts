import fs from "fs";
import path from "path";

// FIXME: Check that this is an absolute path.
export type DirectoryStorePath = string;

export type AbsolutePath = string; // FIXME validate before instantiation; Brand it.

export interface StoreObjectHeader {
  id: RelativePath;
}

export interface StoreObject extends StoreObjectHeader {
  content: string;
}

// FIXME Make this more strict:
//   - FIXME reject non-relative paths.
//   - FIXME reject non-normalized paths.
//   - FIXME reject normalized paths starting with ../
export type RelativePath = string;

export class DirectoryStore {
  readonly directoryPath: DirectoryStorePath;

  constructor(directoryPath: DirectoryStorePath) {
    this.directoryPath = directoryPath;
  }

  writeSync(relativePath: RelativePath, data: string): void {
    fs.writeFileSync(this.absolutePath(relativePath), data);
  }

  existsSync(relativePath: RelativePath): boolean {
    return fs.existsSync(this.absolutePath(relativePath));
  }

  listSync(): StoreObjectHeader[] {
    return fs.readdirSync(this.directoryPath).map((relativePath) => ({
      id: relativePath,
    }));
  }

  readSync(id: RelativePath): StoreObject {
    const content = fs.readFileSync(this.absolutePath(id), "utf8");
    return { id, content };
  }

  private absolutePath(relativePath: RelativePath): AbsolutePath {
    return path.resolve(this.directoryPath, relativePath);
  }
}
