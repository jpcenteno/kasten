import fs from "fs";
import path from "path";
import {
  ZettelFileName,
  ZettelFileNameSchema,
} from "./DirectoryStore/FileName.js";

export * from "./DirectoryStore/FileName.js";

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
  id: ZettelFileName;
}

/**
 * Contains all the data known by the store about a Zettel.
 */
export interface StoreObject extends StoreObjectHeader {
  content: string;
}

export class DirectoryStore {
  readonly directoryPath: DirectoryStorePath;

  constructor(directoryPath: DirectoryStorePath) {
    this.directoryPath = directoryPath;
  }

  writeSync(relativePath: ZettelFileName, data: string): void {
    fs.writeFileSync(this.absolutePath(relativePath), data);
  }

  existsSync(relativePath: ZettelFileName): boolean {
    return fs.existsSync(this.absolutePath(relativePath));
  }

  listSync(): StoreObjectHeader[] {
    return fs
      .readdirSync(this.directoryPath)
      .map((s) => ZettelFileNameSchema.parse(s))
      .map((relativePath) => ({
        id: relativePath,
      }));
  }

  readSync(id: ZettelFileName): StoreObject {
    const content = fs.readFileSync(this.absolutePath(id), "utf8");
    return { id, content };
  }

  absolutePath(relativePath: ZettelFileName): DirectoryStoreZettelAbsolutePath {
    const resolved = path.resolve(this.directoryPath, relativePath);
    return resolved as DirectoryStoreZettelAbsolutePath;
  }
}
