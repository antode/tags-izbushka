import { formatPages } from "@/model/text/TextParser";
import type { Tag } from "@/model/text/type/Tag";
import type { Text } from "@/model/text/type/Text";
import type { Word } from "@/model/text/type/Word";
import type { ISelection } from "./Selection";
import type { ISource } from "./Source";

export interface ICitation {
  id: number;
  start: Word;
  end: Word;
  tag: Tag;
}

export function add(
  citations: ICitation[],
  selection: ISelection,
  tag: Tag
): void {
  const start = selection.start;
  const end = selection.end;

  checkWords(start, end);

  if (start === null) {
    throw new Error("Selection must have start.");
  }

  citations.push({
    id: citations.length,
    start: start,
    end: end !== null ? end : start,
    tag: tag,
  });
}

export function remove(citations: ICitation[], citation: ICitation): void {
  const citationIndex: number = citations.findIndex(
    (c: ICitation) => c.id === citation.id
  );

  citations.splice(citationIndex, 1);
}

export function byTag(citations: ICitation[], tag: Tag): ICitation[] {
  return citations.filter((c: ICitation) => c.tag.id === tag.id);
}

export function toString(source: ISource, texts: Text[], citation: ICitation) {
  const text: Text = texts[source.textId];

  const citationText: string = text.words
    .slice(citation.start.id, citation.end.id + 1)
    .reduce(
      (previousValue: string, word: Word) => previousValue + word.value,
      ""
    );

  const citationPagesFormatted: string = formatPages(
    citation.start.page.value,
    citation.end.page.value,
    text.shortName
  );

  return `${citationText} ${citationPagesFormatted}`;
}

function checkWords(start: Word | null, end: Word | null): void {
  if (start === null && end === null) {
    return;
  }

  if (start === null && end !== null) {
    throw new Error("End can't exists without start.");
  }

  if (start !== null && end !== null && start.id === end.id) {
    throw new Error("Start can't be equal to end.");
  }

  if (start !== null && end !== null && start.id > end.id) {
    throw new Error("Start can't be greater than end.");
  }
}
