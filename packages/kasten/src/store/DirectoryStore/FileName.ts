import path from "path";
import { z } from "zod";

export const ZettelFileNameSchema = z
  .string()
  .transform((s) => path.normalize(s))
  .refine((s) => s === path.basename(s), {
    message: "File name must not contain parent directories.",
  })
  .brand<"ZettelFileName">();

/**
 * A schema for validating file names.
 * Ensures the string is normalized and does not contain parent directories.
 */
export type ZettelFileName = z.infer<typeof ZettelFileNameSchema>;
