<script setup lang="ts">
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

import TextSelection from "@/components/TextSelection.vue";
import TaggedCitationList from "@/components/CitationList.vue";

import { useSourceStore } from "@/stores/source/SourceStore";
import { storeToRefs } from "pinia";
import * as Selection from "@/stores/source/type/Selection";

const sourceStore = useSourceStore();
const { sources } = storeToRefs(sourceStore);

document.addEventListener("keyup", function (evt) {
  if (evt.ctrlKey && evt.key === "Enter") {
    sourceStore.addCitation();
    Selection.clear(sources.value.current.selection);
  }
});

document.addEventListener("keyup", function (evt) {
  if (evt.key === "Escape") {
    // sources.value.current.selection.clear();
    Selection.clear(sources.value.current.selection);
  }
});

const setStart = (w, z) => {
  console.log(w, z);
  Selection.setStart(sources.value.current.selection, w);
};
</script>

<template>
  <div class="container">
    <div class="main-panel-row">
      <article aria-label="Текст" class="main-panel-column">
        <TextSelection
          :words="sourceStore.currentPageWords"
          :selection="sources.current.selection"
          @selection-start-change="setStart"
          @selection-end-change="sources.current.selection.setEnd"
        />
      </article>
      <article aria-label="Цитаты" class="main-panel-column">
        <TaggedCitationList
          :citations-texts="sourceStore.citationsTexts"
          @citationDelete="sourceStore.deleteCitation"
        />
      </article>
    </div>

    <div class="bottom-panel-row">
      <nav
        aria-label="Нумерация страниц"
        class="bottom-panel-pagination-column"
      >
        <VPagination
          v-model="sources.current.pageNumber"
          :pages="sourceStore.pages"
          :hideFirstButton="true"
          :hideLastButton="true"
        />
      </nav>
      <div class="bottom-panel-select-column">
        <select
          aria-label="Тег"
          class="app-select"
          v-model="sources.current.tag"
        >
          <option v-for="tag in sourceStore.tags" :key="tag.id" :value="tag">
            {{ tag.value }}
          </option>
        </select>
      </div>
      <div class="bottom-panel-select-column">
        <select
          aria-label="Источник"
          class="app-select"
          v-model="sources.current"
        >
          <option
            v-for="source in sources.all"
            :key="source.id"
            :value="source"
          >
            {{ sourceStore.sourceFullName(source) }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
}

.main-panel-row {
  height: 90%;
  display: flex;
}

.main-panel-column {
  flex: 50%;
  padding: 10px;
  overflow: scroll;
}

.bottom-panel-row {
  height: 10%;
  text-align: center;
  display: flex;
  align-items: center;
}

.bottom-panel-pagination-column {
  text-align: center;
  flex: 50%;
}

.bottom-panel-select-column {
  text-align: center;
  flex: 25%;
}
</style>
