import { ZettelFileName } from "../entities/zettel.filename.js";

export interface StoreObjectHeader {
  id: ZettelFileName;
}

export interface StoreObject extends StoreObjectHeader {
  content: string;
}

export interface Store {
  writeSync(relativePath: ZettelFileName, data: string): void;
  existsSync(relativePath: ZettelFileName): boolean;
  listSync(): StoreObjectHeader[];
  readSync(fileName: ZettelFileName): StoreObject;
}
