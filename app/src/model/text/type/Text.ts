import type { Word } from "@/model/text/type/Word";
import type { Page } from "@/model/text/type/Page";

export interface Text {
  readonly id: number;
  readonly shortName: string;
  readonly fullName: string;
  readonly words: Word[];
  readonly pages: Page[];
}
