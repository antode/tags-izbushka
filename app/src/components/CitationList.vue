<script setup lang="ts">
import type { ICitation } from "@/stores/source/Citation";

export interface Props {
  citations: ICitation[];
  citationToString: (citation: ICitation) => string;
}

const props = defineProps<Props>();

defineEmits(["citationDelete"]);
</script>

<template>
  <div
    v-for="citation in citations"
    class="tagged"
    :key="citation.id"
    @click.ctrl.alt="$emit('citationDelete', citation)"
  >
    <span>{{ props.citationToString(citation) }}</span>
  </div>
</template>

<style scoped>
.tagged {
  padding-bottom: 10px;
}
</style>
