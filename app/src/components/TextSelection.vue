<script setup lang="ts">
import type { Word } from "@/model/text/type/Word";

export interface Props {
  words: Word[];
  selectionStart: Word | null;
  selectionEnd: Word | null;
}

const props = defineProps<Props>();

defineEmits(["selectionStartChange", "selectionEndChange"]);

const resolveBackgroundColor = (word: Word): string => {
  if (props.selectionStart === null && props.selectionEnd === null) {
    return "White";
  }

  if (word.id === props.selectionStart?.id && props.selectionEnd === null) {
    return "Wheat";
  }

  if (
    props.selectionStart !== null &&
    props.selectionEnd !== null &&
    word.id >= props.selectionStart.id &&
    word.id <= props.selectionEnd.id
  ) {
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
