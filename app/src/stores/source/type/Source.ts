import type { Tag } from "@/model/text/type/Tag";
import type { Citation } from "@/stores/source/type/Citation";
import type { Selection } from "@/stores/source/type/Selection";

export interface Source {
  id: number;
  name: string;
  tag: Tag;
  pageNumber: number;
  selection: Selection;
  citations: Citation[];
  text_id: number;
}
