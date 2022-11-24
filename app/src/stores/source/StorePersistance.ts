import type { Tag } from "@/model/text/type/Tag";
import type { Text } from "@/model/text/type/Text";
import type { Source } from "@/stores/source/type/Source";

function createDefaultSources(texts: Text[], tag: Tag) {
  const sources: Source[] = [];

  for (const text of texts) {
    sources.push({
      id: sources.length,
      name: text.shortName,
      tag,
      pageNumber: 1,
      selection: {
        start: null,
        end: null,
      },
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

export function getCurrentSourceId(sources: Source[]): number {
  const currentSourceId: string | null =
    localStorage.getItem("currentSourceId");

  if (currentSourceId === null) {
    return sources[0].id;
  }

  return JSON.parse(currentSourceId);
}

export function updateSources(sources: Source[]): void {
  try {
    localStorage.setItem("sources", JSON.stringify(sources));
  } catch (error) {
    console.log(error);
  }
}

export function updateCurrentSourceId(sourceId: number): void {
  try {
    localStorage.setItem("currentSourceId", JSON.stringify(sourceId));
  } catch (error) {
    console.log(error);
  }
}
