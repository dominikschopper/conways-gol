<script setup lang="ts">
defineProps<{
  generation: number
  livingCells: number
}>()
</script>

<template>
  <div class="generation-counter">
    <div class="stat">
      <span class="label">Generation:</span>
      <span class="value">{{ generation }}</span>
    </div>
    <div class="stat">
      <span class="label">Living Cells:</span>
      <span class="value">{{ livingCells }}</span>
    </div>
  </div>
</template>

<style scoped>
.generation-counter {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
