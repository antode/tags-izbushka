import { defineStore } from "pinia";
import { computed, reactive, watch, type ComputedRef } from "vue";

import * as StorePersistance from "@/stores/source/SourceStorePersistance";
import * as Repository from "@/model/text/TextRepository";

import type { Word } from "@/model/text/type/Word";
import type { Citation } from "@/stores/source/type/Citation";
import type { Source } from "@/stores/source/type/Source";
import type { Text } from "@/model/text/type/Text";
import type { Tag } from "@/model/text/type/Tag";
import { formatPages } from "@/model/text/TextParser";

export const useSourceStore = defineStore("SourceStore", () => {
  const textsData: Text[] = Repository.texts;
  const tags: Tag[] = Repository.tags;

  const sourcesInitial: Source[] = StorePersistance.getSources(
    textsData,
    tags[0]
  );

  const currentSourceInitialId: number = StorePersistance.getCurrentSourceId();

  const state = reactive({
    sources: sourcesInitial,
    currentSource: sourcesInitial[currentSourceInitialId],
  });

  watch(
    state,
    (newState) => {
      StorePersistance.updateSources(newState.sources);
      StorePersistance.updateCurrentSourceId(newState.currentSource.id);
    },
    {
      deep: true,
    }
  );

  function clearSelection(): void {
    state.currentSource.selection.start = null;
    state.currentSource.selection.end = null;
  }

  function setSelectionStart(word: Word): void {
    if (
      state.currentSource.selection.end !== null &&
      word.id > state.currentSource.selection.end.id
    ) {
      alert("Начало не должно быть после конца.");
      return;
    }

    state.currentSource.selection.start = word;
  }

  function setSelectionEnd(word: Word): void {
    if (state.currentSource.selection.start === null) {
      alert("Сначала установите начало.");
      return;
    }

    if (word.id < state.currentSource.selection.start.id) {
      alert("Конец не должен быть раньше начала.");
      return;
    }

    state.currentSource.selection.end = word;
  }

  function addCitation(): void {
    if (state.currentSource.selection.start === null) {
      alert("Не установлено начало.");
      return;
    }

    if (state.currentSource.selection.end === null) {
      alert("Не установлен конец.");
      return;
    }

    state.currentSource.citations.push({
      id: state.currentSource.citations.length,
      start: state.currentSource.selection.start,
      end: state.currentSource.selection.end,
      tag: state.currentSource.tag,
    });
  }

  function deleteCitation(citationIndex: number): void {
    state.currentSource.citations.splice(citationIndex, 1);
  }

  const currentPageWords: ComputedRef<Word[]> = computed(() => {
    const text: Text = textsData[state.currentSource.text_id];
    return text.words.filter(
      (word: Word) =>
        word.page === text.pages[state.currentSource.pageNumber - 1]
    );
  });

  const citationsTexts: ComputedRef<string[]> = computed(() => {
    const citations = state.currentSource.citations.filter(
      (c: Citation) => c.tag.id === state.currentSource.tag.id
    );

    const text: Text = textsData[state.currentSource.text_id];
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
    return textsData[state.currentSource.text_id].pages.length;
  });

  const sourceFullName = (s: Source): string => textsData[s.text_id].fullName;

  return {
    tags,
    clearSelection,
    setSelectionStart,
    setSelectionEnd,
    addCitation,
    deleteCitation,
    currentPageWords,
    citationsTexts,
    sourceFullName,
    pages,
    state,
  };
});
