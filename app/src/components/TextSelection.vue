<script setup lang="ts">
import type { Word } from "@/model/text/type/Word";
import type { Selection } from "@/stores/source/type/Selection";
import * as Selection1 from "@/stores/source/type/Selection";

export interface Props {
  words: Word[];
  selection: Selection;
}

const props = defineProps<Props>();

defineEmits(["selectionStartChange", "selectionEndChange"]);

const resolveBackgroundColor = (word: Word): string => {
  if (Selection1.isWordInSelection(props.selection, word)) {
    return "Wheat";
  }

  return "White";
};
</script>
<template>
  <span class="text">
    <span
      v-for="word in words"
      :key="word.id"
      v-bind:style="{ 'background-color': resolveBackgroundColor(word) }"
      @click.ctrl="$emit('selectionStartChange', word)"
      @click.alt="$emit('selectionEndChange', word)"
    >
      {{ word.value }}
    </span>
  </span>
</template>

<style scoped>
.text {
  white-space: pre-wrap;
}
</style>
