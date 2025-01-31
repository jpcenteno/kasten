import matter from "gray-matter";
import { z } from "zod";
import { Title, TitleSchema } from "./title.js";

const NoteZettelRawContent = z
  .string()
  .transform((s) => s.trim())
  .brand<"NoteZettelContent">();
type NoteZettelRawContent = z.infer<typeof NoteZettelRawContent>;

const FrontmatterSchema = z.object({
  title: TitleSchema,
});

export class NoteZettel {
  readonly content: NoteZettelRawContent;
  readonly title: Title;

  private constructor(props: { content: NoteZettelRawContent; title: Title }) {
    this.content = props.content;
    this.title = props.title;
  }

  static fromMarkdown(input: string): NoteZettel {
    const grayMatterFile = matter(input);
    const content = NoteZettelRawContent.parse(grayMatterFile.content);
    const { title } = FrontmatterSchema.parse(grayMatterFile.data);
    return new NoteZettel({ content, title });
  }

  stringify(): string {
    return matter.stringify(this.content, { title: this.title });
  }
}
