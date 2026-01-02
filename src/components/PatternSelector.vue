<script setup lang="ts">
import { computed } from 'vue';
import type { Pattern, Coordinate } from '@/core';
import { getConwayPatterns, getHighLifePatterns } from '@/core';

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
})

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
    <h2>Patterns</h2>

    <div class="pattern-list">
      <div
        v-for="pattern in patterns"
        :key="pattern.getName()"
        class="pattern-item"
      >
        <div class="pattern-info">
          <strong>{{ pattern.getName() }}</strong>
          <span class="pattern-description">{{ pattern.getDescription() }}</span>
        </div>
        <button
          @click="placePattern(pattern)"
          class="btn btn-primary btn-small"
        >
          Place
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pattern-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pattern-selector h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.pattern-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pattern-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
}

.pattern-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pattern-info strong {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.pattern-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-primary {
  background: var(--color-primary);
  color: #000;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>
