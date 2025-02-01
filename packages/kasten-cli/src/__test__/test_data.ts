import path from "path";
import fs from "fs";

export interface TestNote {
  relativePath: string;
  txt: string;
  title: string;
}

export const testNotes: TestNote[] = [
  {
    relativePath: "note-1.mdx",
    txt: "---\ntitle: Title 1\n---\nContent 1\n",
    title: "Title 1",
  },
  {
    relativePath: "note-2.mdx",
    txt: "---\ntitle: Title 2\n---\nContent 2\n",
    title: "Title 2",
  },
];

/**
 * Writes a "good" and a "corrupted" note to the directory.
 *
 * The "good" note should not have any issue with the parser while the
 * "corrupted" note should trigger a parser error.
 */
export async function writeGoodNoteAndCorruptedNote(directory: string) {
  const noteData = [
    { name: "good.mdx", txt: "---\ntitle: Some title\n---\n" },
    { name: "bad.mdx", txt: "---\n---\n" },
  ];

  const promises = noteData.map(({ name, txt }) => {
    const absolutePath = path.resolve(directory, name);
    return fs.promises.writeFile(absolutePath, txt);
  });

  return Promise.all(promises);
}
