import { z } from "zod";

export type Title = z.infer<typeof TitleSchema>;

export const TitleSchema = z
  .string()
  .trim()
  .min(1, "Zettel title must be non-blank")
  .brand<"Title">();
