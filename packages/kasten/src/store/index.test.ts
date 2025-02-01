import fs from "fs";
import path from "path";
import os from "os";
import { expect } from "chai";
import { DirectoryStore, RelativePath } from "./index.js";

beforeEach(() => {});

describe("DirectoryStore", () => {
  let dir: string;
  let directoryStore: DirectoryStore;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "zk-test-"));
    directoryStore = new DirectoryStore(dir);
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true });
  });

  describe("After calling `.writeSync`", () => {
    const expectedID = "some-file.txt";
    const expectedContent = "Some content";

    beforeEach(() => {
      directoryStore.writeSync(expectedID, expectedContent);
    });

    it("Should report that the zettel exists in the store", () => {
      expect(directoryStore.existsSync(expectedID)).to.equal(true);
    });

    it("Should be able to read the new zettel", () => {
      const storedObject = directoryStore.readSync(expectedID);
      expect(storedObject.content).to.equal(expectedContent);
      expect(storedObject.id).to.equal(expectedID);
    });

    it("Should list the new zettel", () => {
      const data = directoryStore.listSync()[0]; // There should be only 1 object.
      expect(data.id).to.equal(expectedID);
    });
  });

  describe("Calling .listSync", () => {
    describe("Given an empty store", () => {
      it("Should return an empty collection", () => {
        const zettels = directoryStore.listSync();
        expect(zettels).to.have.length(0);
      });
    });

    describe("Given a store with some Zettels", () => {
      const numberOfTestZettels = 3;
      let expectedIDs: RelativePath[];

      beforeEach(() => {
        expectedIDs = [];
        for (let i = 0; i < numberOfTestZettels; i++) {
          const id = `id-${i}`;
          directoryStore.writeSync(id, `Content ${i}`);
          expectedIDs.push(id);
        }
      });

      it("Should return a collection with the same length as the number of zettels", () => {
        const zettels = directoryStore.listSync();
        expect(zettels).to.have.length(expectedIDs.length);
      });

      it("Should return each distinct ID", () => {
        const zettels = directoryStore.listSync();
        const actualIDs = new Set(zettels.map((obj) => obj.id));
        expectedIDs.forEach((expectedID) => {
          expect(actualIDs).to.include(expectedID);
        });
      });
    });

    describe("Calling .existsSync", () => {
      beforeEach(() => {
        directoryStore.writeSync("stored-id", "some content");
      });

      it("Should return false given a non-stored id", () => {
        expect(directoryStore.existsSync("non-stored-id")).to.equal(false);
      });

      it("Should return true given a stored id", () => {
        expect(directoryStore.existsSync("stored-id")).to.equal(true);
      });
    });

    describe("Calling .readSync", () => {
      describe("When given a stored id", () => {
        const expectedID = "some-id";
        const expectedContent = "some content";

        beforeEach(() => {
          directoryStore.writeSync(expectedID, expectedContent);
        });

        it("Should return an object with the expected .id", () => {
          const result = directoryStore.readSync(expectedID);
          expect(result.id).to.equal(expectedID);
        });

        it("Should return an object with the expected .content", () => {
          const result = directoryStore.readSync(expectedID);
          expect(result.content).to.equal(expectedContent);
        });
      });
    });
  });
});
