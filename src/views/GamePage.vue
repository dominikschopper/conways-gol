<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameBoard from '../components/GameBoard.vue';
import GameSettings from '../components/GameSettings.vue';
import GenerationCounter from '../components/GenerationCounter.vue';
import PatternSelector from '../components/PatternSelector.vue';
import { useGameSettings } from '../composables/useGameSettings';
import { useGameBoard } from '../composables/useGameBoard';
import { useGameEngine } from '../composables/useGameEngine';
import { ConwayRuleSet, HighLifeRuleSet, SeedsRuleSet, type Pattern, type Coordinate } from '../core';

const route = useRoute();
const router = useRouter();

// Collapsible state
const settingsOpen = ref(true);
const patternsOpen = ref(true);

// Determine ruleset from route
const rulesetName = computed(() => route.params.ruleset as string);

const rulesetConfig = computed(() => {
  switch (rulesetName.value) {
    case 'conway':
      return {
        title: "Conway's Game of Life",
        notation: 'B3/S23',
        ruleSet: new ConwayRuleSet(),
        showConwayPatterns: true,
        showHighLifePatterns: false
      };
    case 'highlife':
      return {
        title: 'HighLife',
        notation: 'B36/S23',
        ruleSet: new HighLifeRuleSet(),
        showConwayPatterns: true,
        showHighLifePatterns: true
      };
    case 'seeds':
      return {
        title: 'Seeds',
        notation: 'B2/S',
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

// Close collapsibles when starting
watch(isRunning, (running) => {
  if (running) {
    settingsOpen.value = false;
    patternsOpen.value = false;
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

// Speed control
const speedLabel = computed(() => {
  const fps = 1000 / tickRate.value;
  return `${fps.toFixed(1)} gen/s`;
});

const handleSpeedChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const sliderValue = Number(target.value);
  const invertedValue = 1010 - sliderValue;
  setTickRate(invertedValue);
};
</script>

<template>
  <div v-if="rulesetConfig" class="game-page">
    <!-- Header -->
    <header class="game-header">
      <button @click="goBack" class="back-button">← Back</button>
      <div class="header-title">
        <h1>{{ rulesetConfig.title }}</h1>
        <span class="notation">{{ rulesetConfig.notation }}</span>
      </div>
      <GenerationCounter :generation="generation" :living-cells="livingCellCount" />
    </header>

    <!-- Main content area with collapsibles -->
    <div class="game-content">
      <div class="controls-area">
        <!-- Settings Collapsible -->
        <div class="collapsible">
          <button
            class="collapsible-header"
            @click="settingsOpen = !settingsOpen"
          >
            <span>{{ settingsOpen ? '▼' : '▶' }} Settings</span>
          </button>
          <div v-show="settingsOpen" class="collapsible-content">
            <GameSettings
              :rows="rows"
              :cols="cols"
              :wraparound="wraparound"
              :disabled="isRunning"
              @update:settings="handleSettingsChange"
            />
          </div>
        </div>

        <!-- Patterns Collapsible -->
        <div class="collapsible">
          <button
            class="collapsible-header"
            @click="patternsOpen = !patternsOpen"
          >
            <span>{{ patternsOpen ? '▼' : '▶' }} Patterns</span>
          </button>
          <div v-show="patternsOpen" class="collapsible-content">
            <PatternSelector
              :rows="rows"
              :cols="cols"
              :living-cells="livingCells"
              :show-conway-patterns="rulesetConfig.showConwayPatterns"
              :show-highlife-patterns="rulesetConfig.showHighLifePatterns"
              @select-pattern="handleSelectPattern"
            />
          </div>
        </div>
      </div>

      <!-- Board Container -->
      <main class="board-container">
        <GameBoard
          :rows="rows"
          :cols="cols"
          :living-cells="livingCells"
          @toggle-cell="toggleCell"
        />
      </main>
    </div>

    <!-- Fixed playback controls at bottom -->
    <footer class="playback-controls">
      <div class="button-group">
        <button
          v-if="!isRunning"
          @click="start"
          class="btn btn-primary"
        >
          ▶ Play
        </button>
        <button
          v-else
          @click="pause"
          class="btn btn-warning"
        >
          ⏸ Pause
        </button>

        <button
          @click="step"
          :disabled="isRunning"
          class="btn btn-secondary"
        >
          ⏭ Step
        </button>

        <button
          @click="stop"
          :disabled="!isRunning && !isPaused"
          class="btn btn-secondary"
        >
          ⏹ Stop
        </button>

        <button
          @click="clear"
          :disabled="isRunning"
          class="btn btn-danger"
        >
          🗑 Clear
        </button>
      </div>

      <div class="speed-control">
        <label for="speed-slider">
          Speed: {{ speedLabel }}
        </label>
        <input
          id="speed-slider"
          type="range"
          min="10"
          max="1000"
          step="10"
          :value="1010 - tickRate"
          @input="handleSpeedChange"
          :disabled="isRunning"
        />
      </div>
    </footer>
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

/* Header */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
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
  white-space: nowrap;
}

.back-button:hover {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
}

.notation {
  display: inline-block;
  background: var(--bg-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: monospace;
  color: var(--color-primary);
}

/* Main content */
.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.controls-area {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Collapsible */
.collapsible {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.collapsible-header {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: none;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.collapsible-header:hover {
  background: var(--bg-primary);
}

.collapsible-content {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Board container */
.board-container {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Playback controls */
.playback-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 600;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: #000;
}

.btn-secondary {
  background: var(--color-secondary);
  color: white;
}

.btn-warning {
  background: var(--color-warning);
  color: #000;
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn:not(:disabled):hover {
  opacity: 0.9;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 300px;
}

.speed-control label {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  min-width: 100px;
}

.speed-control input[type="range"] {
  flex: 1;
  cursor: pointer;
}

.speed-control input[type="range"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .header-title h1 {
    font-size: 1.2rem;
  }

  .playback-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .speed-control {
    max-width: none;
  }
}
</style>
