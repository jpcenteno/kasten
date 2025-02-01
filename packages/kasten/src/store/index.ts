import fs from "fs";
import path from "path";
import { z } from "zod";

/**
 * This type brands a path string with the semantic meaning of it being the path
 * of a {@link DirectoryStore}.
 *
 * A `DirectoryStorePath` is absolute, normalized and branded.
 *
 * FIXME implement a Zod Schema that acts as a constructor that enforces the constraints mentioned above.
 */
export type DirectoryStorePath = string;

export type DirectoryStoreZettelAbsolutePath = string & {
  readonly __brand: unique symbol;
};

/**
 * Contains all the metadata known by the store about a Zettel except from it's
 * contents.
 */
export interface StoreObjectHeader {
  id: RelativePath;
}

/**
 * Contains all the data known by the store about a Zettel.
 */
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

  absolutePath(relativePath: RelativePath): DirectoryStoreZettelAbsolutePath {
    const resolved = path.resolve(this.directoryPath, relativePath);
    return resolved as DirectoryStoreZettelAbsolutePath;
  }
}
