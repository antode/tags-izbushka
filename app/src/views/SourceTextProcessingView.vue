<script setup lang="ts">
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

import TextSelection from "@/components/TextSelection.vue";
import TaggedCitationList from "@/components/CitationList.vue";

import { useSourceStore } from "@/stores/source/SourceStore";

const sourceStore = useSourceStore();

document.addEventListener("keyup", function (evt) {
  if (evt.ctrlKey && evt.key === "Enter") {
    sourceStore.addCitation();
    sourceStore.clearSelection();
  }
});

document.addEventListener("keyup", function (evt) {
  if (evt.key === "Escape") {
    sourceStore.clearSelection();
  }
});
</script>

<template>
  <div class="container">
    <div class="main-panel-row">
      <div class="main-panel-column">
        <TextSelection
          :words="sourceStore.currentPageWords"
          :selection-start="sourceStore.currentSource.selection.start"
          :selection-end="sourceStore.currentSource.selection.end"
          @selection-start-change="sourceStore.setSelectionStart"
          @selection-end-change="sourceStore.setSelectionEnd"
        />
      </div>
      <div class="main-panel-column">
        <TaggedCitationList
          :citations-texts="sourceStore.citationsTexts"
          @citationDelete="sourceStore.deleteCitation"
        />
      </div>
    </div>

    <div class="bottom-panel-row">
      <div class="bottom-panel-pagination-column">
        <VPagination
          v-model="sourceStore.currentSource.pageNumber"
          :pages="sourceStore.pages"
          :hideFirstButton="true"
          :hideLastButton="true"
          @update:modelValue="sourceStore.changePage"
        />
      </div>
      <div class="bottom-panel-select-column">
        <select class="app-select" v-model="sourceStore.currentSource.tag">
          <option v-for="tag in sourceStore.tags" :key="tag.id" :value="tag">
            {{ tag.value }}
          </option>
        </select>
      </div>
      <div class="bottom-panel-select-column">
        <select class="app-select" v-model="sourceStore.currentSourceId">
          <option
            v-for="source in sourceStore.sources"
            :key="source.id"
            :value="source.id"
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
