<script setup lang="ts">
export interface Props {
  citationsTexts: string[];
}

defineProps<Props>();

defineEmits(["citationDelete"]);
</script>

<template>
  <div
    v-for="(citationText, index) in citationsTexts"
    class="tagged"
    :key="index"
    @click.ctrl.alt="$emit('citationDelete', index)"
  >
    <span>{{ citationText }}</span>
    <span>&nbsp;</span>
    <!-- <span>{{ citation.pagesInfo }}</span> -->
  </div>
</template>

<style scoped>
.tagged {
  padding-bottom: 10px;
}
</style>
