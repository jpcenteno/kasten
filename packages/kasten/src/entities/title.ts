import { z } from "zod";

export type Title = z.infer<typeof TitleSchema>;

export const TitleSchema = z
  .string()
  .trim()
  .min(1, "Must be non-blank")
  .brand<"Title">();
