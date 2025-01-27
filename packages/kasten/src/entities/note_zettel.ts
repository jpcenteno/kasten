import matter from "gray-matter";
import { z } from "zod";

const NoteZettelRawContent = z
  .string()
  .transform((s) => s.trim())
  .brand<"NoteZettelContent">();
type NoteZettelRawContent = z.infer<typeof NoteZettelRawContent>;

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
  readonly content: NoteZettelRawContent;
  readonly title: ZettelTitle;

  private constructor(props: {
    content: NoteZettelRawContent;
    title: ZettelTitle;
  }) {
    this.content = props.content;
    this.title = props.title;
  }

  static fromMarkdown(input: string): NoteZettel {
    const grayMatterFile = matter(input);
    const content = NoteZettelRawContent.parse(grayMatterFile.content);
    const { title } = FrontmatterSchema.parse(grayMatterFile.data);
    return new NoteZettel({ content, title });
  }
}
