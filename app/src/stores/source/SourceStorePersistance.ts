import type { Tag } from "@/model/text/type/Tag";
import type { Text } from "@/model/text/type/Text";
import type { Source } from "@/stores/source/Source";
import type { Selection } from "@/stores/source/type/Selection";

function createDefaultSources(texts: Text[], tag: Tag) {
  const sources: Source[] = [];

  for (const text of texts) {
    sources.push({
      id: sources.length,
      name: text.shortName,
      tag,
      pageNumber: 1,
      selection: {start: null, end: null},
      citations: [],
      text_id: text.id,
    });
  }

  return sources;
}

export function getSources(texts: Text[], defaultTag: Tag): Source[] {
  const sourcesRaw: string | null = localStorage.getItem("sources");

  if (sourcesRaw === null) {
    return createDefaultSources(texts, defaultTag);
  }

  try {
    return JSON.parse(sourcesRaw);
  } catch (error) {
    console.log(`Can't parse sources localStorage item!`);
    return createDefaultSources(texts, defaultTag);
  }
}

export function getCurrentSourceId(): number {
  const currentSource: string | null = localStorage.getItem("currentSourceId");

  if (currentSource === null) {
    return 0;
  }

  return JSON.parse(currentSource);
}

export function persistSources(sources: Source[]): void {
  try {
    localStorage.setItem("sources", JSON.stringify(sources));
  } catch (error) {
    console.log(error);
  }
}

export function persistSourceId(sourceId: number): void {
  try {
    localStorage.setItem("sourceId", JSON.stringify(sourceId));
  } catch (error) {
    console.log(error);
  }
}
