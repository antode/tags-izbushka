import type { Tag } from "@/model/text/type/Tag";
import type { Text } from "@/model/text/type/Text";
import type { Word } from "@/model/text/type/Word";

import type { ICitation } from "@/stores/source/Citation";
import type { ISelection } from "@/stores/source/Selection";

export interface ISource {
  id: number;
  name: string;
  tag: Tag;
  pageNumber: number;
  selection: ISelection;
  citations: ICitation[];
  textId: number;
}

export function getWordsForPage(source: ISource, texts: Text[]): Word[] {
  const text: Text = texts[source.textId];
  const page = text.pages[source.pageNumber - 1];

  return text.words.filter((word: Word) => word.page === page);
}

export function fullName(source: ISource, texts: Text[]) {
  return texts[source.textId].fullName;
}

export function pagesCount(source: ISource, texts: Text[]) {
  return texts[source.textId].pages.length;
}
