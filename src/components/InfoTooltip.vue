<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  text: string;
}>();

const isOpen = ref(false);

const show = () => {
  isOpen.value = true;
};

const hide = () => {
  isOpen.value = false;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

// Close on click outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.info-tooltip-wrapper')) {
    hide();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    class="info-tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <button
      @click.stop="toggle"
      class="info-button"
      :class="{ active: isOpen }"
      aria-label="Show info"
      type="button"
    >
      ℹ
    </button>
    <div
      :class="{'visible': isOpen}"
      class="tooltip-content"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.info-tooltip-wrapper {
  --anchor-name: random();
  display: inline-block;
}

.info-button {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  anchor-name: var(--anchor-name);
}

.info-button:hover,
.info-button.active {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.tooltip-content {
  display:none;
  position: fixed;
  position-anchor: var(--anchor-name);
  top: anchor(top);
  left: anchor(center);
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: normal;
  max-width: 250px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.tooltip-content.visible {
  display:unset;
}

/* Fallback for browsers without anchor positioning */
@supports not (position-anchor: --info-button) {
  .tooltip-content {
    position: fixed;
    top: auto;
    left: auto;
    transform: translateY(0.5rem);
  }
}
</style>
