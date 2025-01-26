import matter from "gray-matter";
import { z } from "zod";

const ZettelTitle = z
  .string()
  .trim()
  .min(1, "Must be non-blank")
  .brand<"ZettelTitle">();
type ZettelTitle = z.infer<typeof ZettelTitle>;

const FrontmatterSchema = z.object({
  title: ZettelTitle,
});

export class NoteZettel {
  readonly content: string;
  readonly title: ZettelTitle;

  private constructor(props: { content: string; title: ZettelTitle }) {
    this.content = props.content;
    this.title = props.title;
  }

  static fromMarkdown(input: string): NoteZettel {
    const { content, data } = matter(input);
    const { title } = FrontmatterSchema.parse(data);
    return new NoteZettel({ content, title });
  }
}
