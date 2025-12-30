import { ref, computed, type Ref } from 'vue'
import type { BoardConfig } from '@/core/types/Board'

export type GameSettings = {
  rows: number
  cols: number
  wraparound: boolean
}

export function useGameSettings(initialSettings?: Partial<GameSettings>) {
  const rows = ref(initialSettings?.rows ?? 100)
  const cols = ref(initialSettings?.cols ?? 100)
  const wraparound = ref(initialSettings?.wraparound ?? true)

  const config = computed<BoardConfig>(() => ({
    rows: rows.value,
    cols: cols.value,
    wraparound: wraparound.value
  }))

  const updateSettings = (settings: Partial<GameSettings>) => {
    if (settings.rows !== undefined) rows.value = settings.rows
    if (settings.cols !== undefined) cols.value = settings.cols
    if (settings.wraparound !== undefined) wraparound.value = settings.wraparound
  }

  return {
    rows,
    cols,
    wraparound,
    config,
    updateSettings
  }
}
