import { defineStore } from "pinia";
import { computed, reactive, watch, type ComputedRef } from "vue";

import * as StorePersistance from "@/stores/source/SourceStorePersistance";
import * as Repository from "@/model/text/TextRepository";

import type { Word } from "@/model/text/type/Word";
import type { Text } from "@/model/text/type/Text";
import type { Tag } from "@/model/text/type/Tag";

import type { ISource } from "@/stores/source/Source";
import type { ICitation } from "@/stores/source/Citation";

import * as Source from "@/stores/source/Source";
import * as Selection from "@/stores/source/Selection";
import * as Citation from "@/stores/source/Citation";

export interface SourcesState {
  all: ISource[];
  current: ISource;
}

const texts: Text[] = Repository.texts;
const tags: Tag[] = Repository.tags;

const sources: ISource[] = StorePersistance.getSources(texts, tags[0]);
const currentSourceInitialId: number = StorePersistance.getCurrentSourceId();

const initial = { all: sources, current: sources[currentSourceInitialId] };

export const useSourceStore = defineStore("SourceStore", () => {
  const sources: SourcesState = reactive(initial);

  // source
  watch(
    sources,
    (changedSources: SourcesState) => {
      StorePersistance.persistSources(changedSources.all);
      StorePersistance.persistSourceId(changedSources.current.id);
    },
    { deep: true }
  );

  const sourceWords: ComputedRef<Word[]> = computed(() =>
    Source.getWordsForPage(sources.current, texts)
  );

  const sourceFullName = (source: ISource) => Source.fullName(source, texts);

  const sourcePages: ComputedRef<number> = computed(() =>
    Source.pagesCount(sources.current, texts)
  );

  // selection
  const selectionClear = () => Selection.clear(sources.current.selection);

  const selectionSetStart = (start: Word) =>
    Selection.setStart(sources.current.selection, start);

  const selectionSetEnd = (end: Word) =>
    Selection.setEnd(sources.current.selection, end);

  const selectionContainWord = (word: Word) =>
    Selection.isWordInSelection(sources.current.selection, word);

  // citations
  const citationsByTag: ComputedRef<ICitation[]> = computed(() =>
    Citation.byTag(sources.current.citations, sources.current.tag)
  );

  const citationToString = (citation: ICitation) =>
    Citation.toString(sources.current, texts, citation);

  const citationAdd = () =>
    Citation.add(
      sources.current.citations,
      sources.current.selection,
      sources.current.tag
    );

  const citationRemove = (citation: ICitation) =>
    Citation.remove(sources.current.citations, citation);

  return {
    sources,
    sourceWords,
    sourceFullName,
    sourcePages,
    selectionClear,
    selectionSetStart,
    selectionSetEnd,
    selectionContainWord,
    citationsByTag,
    citationToString,
    citationAdd,
    citationRemove,
    tags,
  };
});
