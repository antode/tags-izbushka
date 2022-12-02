import { defineStore } from "pinia";
import { computed, reactive, watch, type ComputedRef } from "vue";

import * as StorePersistance from "@/stores/source/SourceStorePersistance";

import * as Repository from "@/model/text/TextRepository";

import type { Word } from "@/model/text/type/Word";
import type { Source } from "@/stores/source/Source";
import type { Text } from "@/model/text/type/Text";
import type { Tag } from "@/model/text/type/Tag";
import type { Sources } from "@/stores/source/Sources";
import { formatPages } from "@/model/text/TextParser";
import type { Citation } from "./type/Citation";

const textsData: Text[] = Repository.texts;
const tags: Tag[] = Repository.tags;

const sourcesInitial: Source[] = StorePersistance.getSources(
  textsData,
  tags[0]
);
const currentSourceInitialId: number = StorePersistance.getCurrentSourceId();

export const useSourceStore = defineStore("SourceStore", () => {
  const sources: Sources = reactive({
    all: sourcesInitial,
    current: sourcesInitial[currentSourceInitialId],
  });

  watch(
    sources,
    (changedSources: Sources) => {
      StorePersistance.persistSources(changedSources.all);
      StorePersistance.persistSourceId(changedSources.current.id);
    },
    {
      deep: true,
    }
  );

  const currentPageWords: ComputedRef<Word[]> = computed(() => {
    const text: Text = textsData[sources.current.text_id];
    return text.words.filter(
      (word: Word) => word.page === text.pages[sources.current.pageNumber - 1]
    );
  });

  function addCitation(): void {
    if (sources.current.selection.start === null) {
      alert("Не установлено начало.");
      return;
    }

    if (sources.current.selection.end === null) {
      alert("Не установлен конец.");
      return;
    }

    sources.current.citations.push({
      id: sources.current.citations.length,
      start: sources.current.selection.start,
      end: sources.current.selection.end,
      tag: sources.current.tag,
    });
  }

  function deleteCitation(citationIndex: number): void {
    sources.current.citations.splice(citationIndex, 1);
  }

  const citationsTexts: ComputedRef<string[]> = computed(() => {
    const citations = sources.current.citations.filter(
      (c: Citation) => c.tag.id === sources.current.tag.id
    );

    const text: Text = textsData[sources.current.text_id];
    const citationTexts = [];
    for (const citation of citations) {
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

      citationTexts.push(citationText + citationPagesFormatted);
    }

    return citationTexts;
  });


  const pages: ComputedRef<number> = computed(() => {
    return textsData[sources.current.text_id].pages.length;
  });

  const sourceFullName = (s: Source): string => textsData[s.text_id].fullName;

  return {
    tags,
    addCitation,
    deleteCitation,
    currentPageWords,
    sourceFullName,
    pages,
    sources,
    citationsTexts,
  };
});
