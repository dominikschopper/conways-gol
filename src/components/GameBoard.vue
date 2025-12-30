<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { Coordinate } from '@/core'
import { useCellRenderer } from '@/composables/useCellRenderer'
import { coord } from '@/core'

const props = defineProps<{
  rows: number
  cols: number
  livingCells: Coordinate[]
}>()

const emit = defineEmits<{
  toggleCell: [coordinate: Coordinate]
}>()

const boardRef = ref<HTMLDivElement | null>(null);
const { cellSize, renderCell, removeCell, clearAllCells, updateCellSize } = useCellRenderer();

// Calculate optimal cell size based on board dimensions and constraints
const calculateCellSize = () => {
  const minSize = 3; // --cell-size-min
  const maxSize = 20; // --cell-size-max
  const maxWidth = window.innerWidth * 0.9; // 90vw
  const maxHeight = window.innerHeight * 0.8; // 80vh

  // Calculate size that fits within viewport
  const widthBasedSize = Math.floor(maxWidth / props.cols);
  const heightBasedSize = Math.floor(maxHeight / props.rows);

  // Take the smaller of the two to ensure it fits
  const calculatedSize = Math.min(widthBasedSize, heightBasedSize);

  // Clamp between min and max
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
};

// Calculate board dimensions
const boardWidth = computed(() => props.cols * cellSize.value);
const boardHeight = computed(() => props.rows * cellSize.value);

// Track rendered cells
const renderedCells = new Set<string>();

// Watch for board size changes and clear all cells
watch(() => [props.rows, props.cols] as const, () => {
  const newSize = calculateCellSize();
  updateCellSize(newSize);

  clearAllCells();
  renderedCells.clear();
  // Re-render current living cells
  if (boardRef.value) {
    for (const cell of props.livingCells) {
      const key = `${cell.row},${cell.col}`;
      renderCell(boardRef.value, cell);
      renderedCells.add(key);
    }
  }
}, { immediate: true })

// Render cells when they change
watch(() => props.livingCells, (newCells, oldCells) => {
  if (!boardRef.value) return

  const newSet = new Set(newCells.map(c => `${c.row},${c.col}`))
  const oldSet = new Set(oldCells?.map(c => `${c.row},${c.col}`) ?? [])

  // Remove dead cells
  for (const key of oldSet) {
    if (!newSet.has(key)) {
      const [row, col] = key.split(',').map(Number)
      removeCell(coord(row!, col!))
      renderedCells.delete(key)
    }
  }

  // Add new cells
  for (const cell of newCells) {
    const key = `${cell.row},${cell.col}`
    if (!renderedCells.has(key)) {
      renderCell(boardRef.value, cell)
      renderedCells.add(key)
    }
  }
}, { deep: true })

// Handle click - event delegation
const handleBoardClick = (event: MouseEvent) => {
  if (!boardRef.value) return

  const rect = boardRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const col = Math.floor(x / cellSize.value)
  const row = Math.floor(y / cellSize.value)

  if (row >= 0 && row < props.rows && col >= 0 && col < props.cols) {
    emit('toggleCell', coord(row, col))
  }
}

// Clear on mount
onMounted(() => {
  clearAllCells()
})
</script>

<template>
  <div
    ref="boardRef"
    class="game-board"
    :style="{
      width: `${boardWidth}px`,
      height: `${boardHeight}px`,
      backgroundSize: `${cellSize}px ${cellSize}px`
    }"
    @click="handleBoardClick"
  />
</template>

<style scoped>
.game-board {
  position: relative;
  background-image:
    linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
  background-color: var(--board-bg);
  cursor: crosshair;
  margin: 2rem;
}

.game-board :deep(.cell) {
  background-color: var(--cell-color);
  border-radius: 1px;
  transition: opacity 0.1s;
}
</style>
