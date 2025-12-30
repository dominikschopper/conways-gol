import { ref, computed, watch, type Ref, triggerRef } from 'vue'
import type { Coordinate, BoardConfig } from '@/core'
import { Board, Pattern } from '@/core'

export function useGameBoard(config: Ref<BoardConfig>) {
  const board = ref<Board>(new Board(config.value))
  const livingCells = ref<Coordinate[]>([])
  const generation = ref(0)
  const livingCellCount = computed(() => livingCells.value.length)

  // Recreate board when config changes
  watch(config, (newConfig) => {
    const currentCells = board.value.getLivingCells()
    board.value = new Board(newConfig)

    // Restore cells that still fit
    for (const cell of currentCells) {
      if (cell.row < newConfig.rows && cell.col < newConfig.cols) {
        board.value.setAlive(cell)
      }
    }

    updateState()
  }, { deep: true })

  const updateState = () => {
    livingCells.value = board.value.getLivingCells()
    generation.value = board.value.getGeneration()
  }

  const toggleCell = (coordinate: Coordinate) => {
    board.value.toggle(coordinate)
    updateState()
  }

  const clear = () => {
    board.value.clear()
    updateState()
  }

  const placePattern = (pattern: Pattern, position: Coordinate) => {
    pattern.placeOnBoard(board.value, position)
    updateState()
  }

  return {
    board,
    livingCells,
    generation,
    livingCellCount,
    toggleCell,
    clear,
    placePattern,
    updateState
  }
}
