<script setup lang="ts">
import { ref, watch } from "vue";

export interface Option {
  key: number;
  text: string;
}

export interface Props {
  options: Option[];
  initialValue: Option;
}

const props = defineProps<Props>();
const emit = defineEmits(["valueChanged"]);

const currentValue = ref(props.initialValue);
watch(currentValue, (newValue: Option) => {
  emit("valueChanged", newValue);
});
</script>

<template>
  <select class="app-select" v-model="currentValue">
    <option v-for="option in options" :key="option.key" :value="option">
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped>
.app-select {
  text-align: center;
  padding: 0 10px;
  font-size: 5vh;
}
</style>
