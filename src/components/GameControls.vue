<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isRunning: boolean
  isPaused: boolean
  tickRate: number
}>()

const emit = defineEmits<{
  start: []
  stop: []
  pause: []
  step: []
  clear: []
  'update:tickRate': [rate: number]
}>()

const speedLabel = computed(() => {
  const fps = 1000 / props.tickRate
  return `${fps.toFixed(1)} gen/s`
})

const handleSpeedChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Invert the slider value so left = slow, right = fast
  const sliderValue = Number(target.value);
  const invertedValue = 1010 - sliderValue;
  emit('update:tickRate', invertedValue);
};
</script>

<template>
  <section class="game-controls">
    <h2>Controls</h2>

    <div class="button-group">
      <button
        v-if="!isRunning"
        @click="emit('start')"
        class="btn btn-primary"
      >
        Start
      </button>
      <button
        v-else
        @click="emit('pause')"
        class="btn btn-warning"
      >
        Pause
      </button>

      <button
        @click="emit('step')"
        :disabled="isRunning"
        class="btn btn-secondary"
      >
        Step
      </button>

      <button
        @click="emit('clear')"
        :disabled="isRunning"
        class="btn btn-danger"
      >
        Clear
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
  </section>
</template>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-controls h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 600;
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
  flex-direction: column;
  gap: 0.5rem;
}

.speed-control label {
  font-size: 0.9rem;
  font-weight: 500;
}

.speed-control input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.speed-control input[type="range"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
