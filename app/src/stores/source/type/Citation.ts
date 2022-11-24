import type { Tag } from "@/model/text/type/Tag";
import type { Word } from "@/model/text/type/Word";

export interface Citation {
  id: number;
  start: Word;
  end: Word;
  tag: Tag;
}
