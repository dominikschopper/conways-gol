<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameBoard from '../components/GameBoard.vue';
import GameControls from '../components/GameControls.vue';
import GameSettings from '../components/GameSettings.vue';
import GenerationCounter from '../components/GenerationCounter.vue';
import PatternSelector from '../components/PatternSelector.vue';
import { useGameSettings } from '../composables/useGameSettings';
import { useGameBoard } from '../composables/useGameBoard';
import { useGameEngine } from '../composables/useGameEngine';
import { ConwayRuleSet, HighLifeRuleSet, SeedsRuleSet, type Pattern, type Coordinate } from '../core';

const route = useRoute();
const router = useRouter();

// Determine ruleset from route
const rulesetName = computed(() => route.params.ruleset as string);

const rulesetConfig = computed(() => {
  switch (rulesetName.value) {
    case 'conway':
      return {
        title: "Conway's Game of Life",
        ruleSet: new ConwayRuleSet(),
        showConwayPatterns: true,
        showHighLifePatterns: false
      };
    case 'highlife':
      return {
        title: 'HighLife',
        ruleSet: new HighLifeRuleSet(),
        showConwayPatterns: true,
        showHighLifePatterns: true
      };
    case 'seeds':
      return {
        title: 'Seeds',
        ruleSet: new SeedsRuleSet(),
        showConwayPatterns: true,
        showHighLifePatterns: false
      };
    default:
      return null;
  }
});

// Redirect if invalid ruleset
if (!rulesetConfig.value) {
  router.push('/');
}

// Settings
const { rows, cols, wraparound, config, updateSettings } = useGameSettings({
  rows: 100,
  cols: 100,
  wraparound: true
});

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
} = useGameBoard(config);

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
  setRuleSet,
  recreateEngine
} = useGameEngine(board, updateState, 100);

// Set initial ruleset
onMounted(() => {
  if (rulesetConfig.value) {
    setRuleSet(rulesetConfig.value.ruleSet);
  }
});

// Handle settings change (recreate board & engine)
const handleSettingsChange = (newSettings: Partial<typeof config.value>) => {
  const wasRunning = isRunning.value;
  if (wasRunning) stop();

  updateSettings(newSettings);
  recreateEngine();

  // Reapply ruleset after recreation
  if (rulesetConfig.value) {
    setRuleSet(rulesetConfig.value.ruleSet);
  }
};

// Handle pattern placement
const handleSelectPattern = (pattern: Pattern, position: Coordinate) => {
  placePattern(pattern, position);
};

// Navigate back to landing
const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div v-if="rulesetConfig" class="game-page">
    <header class="game-header">
      <div class="header-left">
        <button @click="goBack" class="back-button">← Back</button>
        <h1>{{ rulesetConfig.title }}</h1>
      </div>
      <GenerationCounter :generation="generation" :living-cells="livingCellCount" />
    </header>

    <div class="game-content">
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
          :show-conway-patterns="rulesetConfig.showConwayPatterns"
          :show-highlife-patterns="rulesetConfig.showHighLifePatterns"
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
.game-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-button:hover {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.game-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.game-content {
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
