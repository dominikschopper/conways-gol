<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  rows: number
  cols: number
  wraparound: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:settings': [settings: { rows?: number, cols?: number, wraparound?: boolean }]
  'apply': []
}>()

const localRows = ref(props.rows)
const localCols = ref(props.cols)
const localWraparound = ref(props.wraparound)

const applySettings = () => {
  emit('update:settings', {
    rows: localRows.value,
    cols: localCols.value,
    wraparound: localWraparound.value
  })
  emit('apply')
}

const autoSelect = (event: Event) => {
  if ('target' in event && event.target instanceof HTMLInputElement) {
    event.target.select();
  }
}
</script>

<template>
  <section class="game-settings">
    <h2>Settings</h2>

    <div class="setting-group">
      <label for="rows-input">Rows:</label>
      <input
        id="rows-input"
        v-model.number="localRows"
        type="number"
        min="10"
        max="1000"
        :disabled="disabled"
        @focus="($ev) => autoSelect($ev)"
      />
    </div>

    <div class="setting-group">
      <label for="cols-input">Columns:</label>
      <input
        id="cols-input"
        v-model.number="localCols"
        type="number"
        min="10"
        max="2000"
        :disabled="disabled"
        @focus="($ev) => autoSelect($ev)"
      />
    </div>

    <div class="setting-group checkbox">
      <label for="wraparound-checkbox">
        <input
          id="wraparound-checkbox"
          v-model="localWraparound"
          type="checkbox"
          :disabled="disabled"
        />
        Wraparound (Torus)
      </label>
    </div>

    <button
      @click="applySettings"
      :disabled="disabled"
      class="btn btn-primary"
    >
      Apply Settings
    </button>
  </section>
</template>

<style scoped>
.game-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-settings h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-group.checkbox {
  flex-direction: row;
  align-items: center;
}

.setting-group label {
  font-size: 0.9rem;
  font-weight: 500;
}

.setting-group input[type="number"] {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-primary);
}

.setting-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: #000;
  font-weight: 600;
}

.btn-primary:not(:disabled):hover {
  opacity: 0.9;
}
</style>
