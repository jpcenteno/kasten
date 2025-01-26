import matter from "gray-matter";
import { z } from "zod";

const FrontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "Must be non-blank"),
  })
  .required();

export class NoteZettel {
  readonly content: string;
  readonly title: string;

  private constructor(props: { content: string; title: string }) {
    this.content = props.content;
    this.title = props.title;
  }

  static fromMarkdown(input: string): NoteZettel {
    const { content, data } = matter(input);
    const { title } = FrontmatterSchema.parse(data);
    return new NoteZettel({ content, title });
  }
}
