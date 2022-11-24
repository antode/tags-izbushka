import { defineStore } from "pinia";

import * as StorePersistance from "@/stores/source/SourceStorePersistance";
import * as Repository from "@/model/text/TextRepository";

import type { Word } from "@/model/text/type/Word";
import type { Citation } from "@/stores/source/type/Citation";
import type { Source } from "@/stores/source/type/Source";
import type { Text } from "@/model/text/type/Text";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import type { Tag } from "@/model/text/type/Tag";

export interface SourceState {
  currentSourceId: number;
  sources: Source[];
  tags: Tag[];
}

export const useSourceStore = defineStore("SourceStore", () => {
  const textsData: Text[] = Repository.texts;
  const tagsData: Tag[] = Repository.tags;

  const sourcesInitial: Source[] = StorePersistance.getSources(
    textsData,
    tagsData[0]
  );
  const currentSourceInitialId: number =
    StorePersistance.getCurrentSourceId(sourcesInitial);

  const sources = ref(sourcesInitial);
  const currentSourceId: Ref<number> = ref(currentSourceInitialId);
  const currentSource = computed(() => {
    return sources.value[currentSourceId.value];
  });
  const tags = ref(tagsData);

  watch(
    sources,
    (changedSources: Source[]) =>
      StorePersistance.updateSources(changedSources),
    {
      deep: true,
    }
  );

  watch(currentSourceId, (changedId: number) =>
    StorePersistance.updateCurrentSourceId(changedId)
  );

  function changeTag(id: number): void {
    if (id === currentSource.value.tag.id) {
      return;
    }

    currentSource.value.tag = tags.value[id];
  }

  function changePage(pageNumber: number) {
    currentSource.value.pageNumber = pageNumber;
  }

  function clearSelection(): void {
    currentSource.value.selection.start = null;
    currentSource.value.selection.end = null;
  }

  function setSelectionStart(word: Word): void {
    if (
      currentSource.value.selection.end !== null &&
      word.id > currentSource.value.selection.end.id
    ) {
      alert("Начало не должно быть после конца.");
      return;
    }

    currentSource.value.selection.start = word;
  }

  function setSelectionEnd(word: Word): void {
    if (currentSource.value.selection.start === null) {
      alert("Сначала установите начало.");
      return;
    }

    if (word.id < currentSource.value.selection.start.id) {
      alert("Конец не должен быть раньше начала.");
      return;
    }

    currentSource.value.selection.end = word;
  }

  function addCitation(): void {
    if (currentSource.value.selection.start === null) {
      alert("Не установлено начало.");
      return;
    }

    if (currentSource.value.selection.end === null) {
      alert("Не установлен конец.");
      return;
    }

    currentSource.value.citations.push({
      id: currentSource.value.citations.length,
      start: currentSource.value.selection.start,
      end: currentSource.value.selection.end,
      tag: currentSource.value.tag,
    });
  }

  function deleteCitation(citationIndex: number): void {
    currentSource.value.citations.splice(citationIndex, 1);
  }

  const currentPageWords: ComputedRef<Word[]> = computed(() => {
    const text: Text = textsData[currentSource.value.text_id];
    return text.words.filter(
      (word: Word) =>
        word.page === text.pages[currentSource.value.pageNumber - 1]
    );
  });

  const citationsTexts: ComputedRef<string[]> = computed(() => {
    const text: Text = textsData[currentSource.value.text_id];

    const citationToText = (citation: Citation): string =>
      text.words
        .slice(citation.start.id, citation.end.id + 1)
        .reduce(
          (previousValue: string, word: Word) => previousValue + word.value,
          ""
        );

    return currentSource.value.citations
      .filter((c: Citation) => c.tag === currentSource.value.tag)
      .map(citationToText);
  });

  const pages: ComputedRef<number> = computed(() => {
    const text: Text = textsData[currentSource.value.text_id];

    return text.pages.length;
  });

  const sourceFullName = (s: Source): string => textsData[s.text_id].fullName;

  return {
    currentSourceId,
    sources,
    tags,
    changeTag,
    changePage,
    clearSelection,
    setSelectionStart,
    setSelectionEnd,
    addCitation,
    deleteCitation,
    currentPageWords,
    citationsTexts,
    sourceFullName,
    pages,
    currentSource,
  };
});
