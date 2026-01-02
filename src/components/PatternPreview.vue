<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Pattern, Coordinate } from '@/core';
import { coord } from '@/core';

const props = defineProps<{
  pattern: Pattern | null
  cellSize: number
  rows: number
  cols: number
}>();

const previewCells = ref<Coordinate[]>([]);
const isValidPosition = ref(true);

// Check if pattern fits at current position
const validatePosition = (position: Coordinate): boolean => {
  if (!props.pattern) return false;

  const cells = props.pattern.getCellsAtPosition(position);
  return cells.every(
    cell => cell.row >= 0 && cell.row < props.rows &&
            cell.col >= 0 && cell.col < props.cols
  );
};

// Handle drag over to update preview position
const handleDragOver = (event: DragEvent) => {
  if (!props.pattern) {
    previewCells.value = [];
    return;
  }

  // Get the board element (parent of this preview overlay)
  const boardElement = (event.currentTarget as HTMLElement).parentElement;
  if (!boardElement) {
    return;
  }

  const rect = boardElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const col = Math.floor(x / props.cellSize);
  const row = Math.floor(y / props.cellSize);

  if (row >= 0 && row < props.rows && col >= 0 && col < props.cols) {
    const position = coord(row, col);
    isValidPosition.value = validatePosition(position);
    previewCells.value = props.pattern.getCellsAtPosition(position);
  } else {
    previewCells.value = [];
  }
};

// Clear preview when pattern changes to null
watch(() => props.pattern, (newPattern) => {
  if (!newPattern) {
    previewCells.value = [];
  }
});
</script>

<template>
  <div
    v-if="pattern"
    class="pattern-preview-overlay"
    @dragover="handleDragOver"
    @dragleave="previewCells = []"
  >
    <div
      v-for="cell in previewCells"
      :key="`${cell.row}-${cell.col}`"
      class="preview-cell"
      :class="{ invalid: !isValidPosition }"
      :style="{
        left: `${cell.col * cellSize}px`,
        top: `${cell.row * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`
      }"
    />
  </div>
</template>

<style scoped>
.pattern-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: all;
  z-index: 10;
}

.preview-cell {
  position: absolute;
  background-color: rgba(255, 255, 0, 0.3);
  border: 2px solid rgba(255, 255, 0, 0.9);
  border-radius: 2px;
  transition: background-color 0.1s;
  pointer-events: none;
  box-shadow: 0 0 4px rgba(255, 255, 0, 0.5);
}

.preview-cell.invalid {
  background-color: rgba(255, 0, 0, 0.5);
  border-color: rgba(255, 0, 0, 0.9);
  box-shadow: 0 0 4px rgba(255, 0, 0, 0.5);
}
</style>
