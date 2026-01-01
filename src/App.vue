<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
import GameControls from './components/GameControls.vue'
import GameSettings from './components/GameSettings.vue'
import GenerationCounter from './components/GenerationCounter.vue'
import PatternSelector from './components/PatternSelector.vue'
import { useGameSettings } from './composables/useGameSettings'
import { useGameBoard } from './composables/useGameBoard'
import { useGameEngine } from './composables/useGameEngine'
import type { Pattern, Coordinate } from './core'

// Settings
const { rows, cols, wraparound, config, updateSettings } = useGameSettings({
  rows: 100,
  cols: 100,
  wraparound: true
})

// Board state
const {
  board,
  livingCells,
  generation,
  livingCellCount,
  toggleCell,
  clear,
  placePattern,
  updateState
} = useGameBoard(config)

// Engine
const {
  isRunning,
  isPaused,
  tickRate,
  start,
  stop,
  pause,
  step,
  setTickRate,
  recreateEngine
} = useGameEngine(board, updateState, 100)

// Handle settings change (recreate board & engine)
const handleSettingsChange = (newSettings: Partial<typeof config.value>) => {
  const wasRunning = isRunning.value
  if (wasRunning) stop()

  updateSettings(newSettings)
  recreateEngine()
}

// Handle pattern placement
const handleSelectPattern = (pattern: Pattern, position: Coordinate) => {
  placePattern(pattern, position)
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Conway's Game of Life</h1>
      <GenerationCounter :generation="generation" :living-cells="livingCellCount" />
    </header>

    <div class="app-content">
      <aside class="sidebar">
        <GameSettings
          :rows="rows"
          :cols="cols"
          :wraparound="wraparound"
          :disabled="isRunning"
          @update:settings="handleSettingsChange"
        />

        <PatternSelector
          :rows="rows"
          :cols="cols"
          :living-cells="livingCells"
          @select-pattern="handleSelectPattern"
        />

        <GameControls
          :is-running="isRunning"
          :is-paused="isPaused"
          :tick-rate="tickRate"
          @start="start"
          @stop="stop"
          @pause="pause"
          @step="step"
          @clear="clear"
          @update:tick-rate="setTickRate"
        />
      </aside>

      <main class="board-container">
        <GameBoard
          :rows="rows"
          :cols="cols"
          :living-cells="livingCells"
          @toggle-cell="toggleCell"
        />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.board-container {
  flex: 1;
  overflow: auto;
  position: relative;
}
</style>
