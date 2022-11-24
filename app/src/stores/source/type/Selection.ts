import type { Word } from "@/model/text/type/Word";

export interface Selection {
  start: Word | null;
  end: Word | null;
}
