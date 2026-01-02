<script setup lang="ts">
import { computed } from 'vue';
import type { Pattern, Coordinate } from '@/core';
import { getConwayPatterns, getHighLifePatterns } from '@/core';
import InfoTooltip from './InfoTooltip.vue';

const props = defineProps<{
  rows: number
  cols: number
  livingCells: Coordinate[]
  showConwayPatterns?: boolean
  showHighLifePatterns?: boolean
}>();

const emit = defineEmits<{
  selectPattern: [pattern: Pattern, position: Coordinate]
}>();

const patterns = computed(() => {

  const result: Pattern[] = [];

  if (props.showConwayPatterns !== false) {
    result.push(...getConwayPatterns());
  }

  if (props.showHighLifePatterns) {
    result.push(...getHighLifePatterns());
  }

  return result;
});

// Find a random free position for pattern
const findRandomPosition = (pattern: Pattern): Coordinate => {
  const livingSet = new Set(props.livingCells.map(c => `${c.row},${c.col}`))
  const patternWidth = pattern.getWidth()
  const patternHeight = pattern.getHeight()

  // Try to find a free spot (max 100 attempts)
  for (let attempt = 0; attempt < 100; attempt++) {
    const row = Math.floor(Math.random() * (props.rows - patternHeight))
    const col = Math.floor(Math.random() * (props.cols - patternWidth))

    // Check if all pattern cells at this position would be free
    let isFree = true
    const patternCells = pattern.getCells()
    for (const cell of patternCells) {
      const checkRow = row + cell.row
      const checkCol = col + cell.col
      if (livingSet.has(`${checkRow},${checkCol}`)) {
        isFree = false
        break
      }
    }

    if (isFree) {
      return { row, col }
    }
  }

  // Fallback: place in top-left area
  return { row: 5, col: 5 }
}

const placePattern = (pattern: Pattern) => {
  const position = findRandomPosition(pattern)
  emit('selectPattern', pattern, position)
}
</script>

<template>
  <section class="pattern-selector">
    <div class="pattern-list">
      <div
        v-for="pattern in patterns"
        :key="pattern.getName()"
        class="pattern-item"
      >
        <button
          @click="placePattern(pattern)"
          class="pattern-button"
        >
          {{ pattern.getName() }}
        </button>
        <InfoTooltip :text="pattern.getDescription()" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.pattern-selector {
  display: flex;
  flex-direction: column;
}

.pattern-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
}

.pattern-item {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.pattern-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.pattern-button:hover {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}
</style>
