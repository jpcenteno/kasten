export type ZettelId = string & { readonly __brand: unique symbol };

export function intoZettelId(value: string): ZettelId {
  if (value === "") {
    throw new Error("Id cannot be empty.");
  }

  return value as ZettelId;
}
