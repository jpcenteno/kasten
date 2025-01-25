import { randomBytes } from "crypto";
import * as words from "./id.words.json";

export type ID = string & { readonly __brand: unique symbol };

/**
 * Validates a string and brands it as an ID.
 */
export function intoID(value: string): ID {
  if (value === "") throw new Error("ID Cannot be blank");
  return value as ID;
}

/**
 * Generates a new random ID.
 */
export function randomID(): ID {
  const randomWords: string[] = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = randomBytes(2).readUint16LE() % 2048;
    randomWords.push(words[randomIndex]);
  }

  return randomWords.join("-") as ID;
}
