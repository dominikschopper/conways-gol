import { ref, computed, watch, type Ref } from 'vue';
import { Engine, type EngineState, Board, type RuleSet } from '@/core';

export function useGameEngine(
  board: Ref<Board>,
  onTick: () => void,
  initialTickRate: number = 200
) {
  const engine = ref<Engine>(new Engine(board.value, { tickRate: initialTickRate }));
  const state = ref<EngineState>('stopped');
  const tickRate = ref(initialTickRate);

  // Update engine callback
  engine.value.onTick(onTick);

  // Watch for board changes and recreate engine automatically
  watch(board, (newBoard) => {
    const wasRunning = state.value === 'running';
    engine.value.stop();
    engine.value = new Engine(newBoard, { tickRate: tickRate.value });
    engine.value.onTick(onTick);
    if (wasRunning) {
      engine.value.start();
    }
    state.value = engine.value.getState();
  });

  // Manual recreate engine (for explicit calls)
  const recreateEngine = () => {
    const wasRunning = state.value === 'running';
    engine.value.stop();
    engine.value = new Engine(board.value, { tickRate: tickRate.value });
    engine.value.onTick(onTick);
    if (wasRunning) {
      engine.value.start();
    }
    state.value = engine.value.getState();
  };

  const start = () => {
    engine.value.start();
    state.value = engine.value.getState();
  };

  const stop = () => {
    engine.value.stop();
    state.value = engine.value.getState();
  };

  const pause = () => {
    engine.value.pause();
    state.value = engine.value.getState();
  };

  const step = () => {
    engine.value.step();
  };

  const setTickRate = (rate: number) => {
    tickRate.value = rate;
    engine.value.setTickRate(rate);
  };

  const setRuleSet = (ruleSet: RuleSet) => {
    engine.value.setRuleSet(ruleSet);
  };

  const isRunning = computed(() => state.value === 'running');
  const isStopped = computed(() => state.value === 'stopped');
  const isPaused = computed(() => state.value === 'paused');

  return {
    engine,
    state,
    tickRate,
    isRunning,
    isStopped,
    isPaused,
    start,
    stop,
    pause,
    step,
    setTickRate,
    setRuleSet,
    recreateEngine
  };
}
