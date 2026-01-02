<script setup lang="ts">
import { ref } from 'vue';
import { ConwayRuleSet, HighLifeRuleSet, type RuleSet } from '@/core';

const emit = defineEmits<{
  'change-ruleset': [ruleSet: RuleSet]
}>();

type RuleSetOption = {
  name: string
  description: string
  ruleSet: RuleSet
};

const ruleSetOptions: RuleSetOption[] = [
  {
    name: "Conway's Game of Life",
    description: 'B3/S23 - Classic rules',
    ruleSet: new ConwayRuleSet()
  },
  {
    name: 'HighLife',
    description: 'B36/S23 - Creates replicators',
    ruleSet: new HighLifeRuleSet()
  }
];

const selectedIndex = ref(0);

const handleChange = (index: number) => {
  selectedIndex.value = index;
  emit('change-ruleset', ruleSetOptions[index].ruleSet);
};
</script>

<template>
  <section class="ruleset-selector">
    <h2>Rule Set</h2>

    <div class="ruleset-options">
      <div
        v-for="(option, index) in ruleSetOptions"
        :key="index"
        class="ruleset-option"
        :class="{ active: selectedIndex === index }"
        @click="handleChange(index)"
      >
        <div class="ruleset-name">{{ option.name }}</div>
        <div class="ruleset-description">{{ option.description }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ruleset-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ruleset-selector h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.ruleset-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ruleset-option {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--input-bg);
}

.ruleset-option:hover {
  border-color: var(--color-primary);
  background: var(--bg-primary);
}

.ruleset-option.active {
  border-color: var(--color-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.ruleset-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.ruleset-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
