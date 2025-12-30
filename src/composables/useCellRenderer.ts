import { ref, onUnmounted } from 'vue'
import type { Coordinate } from '@/core'

/**
 * Flyweight pattern for cell rendering
 * Reuses DOM elements for performance
 */
export function useCellRenderer() {
  const cellPool: HTMLDivElement[] = []
  const activeCells = new Map<string, HTMLDivElement>()
  const cellSize = ref(8) // pixels

  const createCellElement = (): HTMLDivElement => {
    const cell = document.createElement('div')
    cell.className = 'cell'
    cell.style.width = `${cellSize.value}px`
    cell.style.height = `${cellSize.value}px`
    cell.style.position = 'absolute'
    cell.style.backgroundColor = 'var(--cell-color, #00ff41)'
    return cell
  }

  const getCellFromPool = (): HTMLDivElement => {
    return cellPool.pop() ?? createCellElement()
  }

  const returnCellToPool = (cell: HTMLDivElement): void => {
    cell.style.display = 'none'
    cellPool.push(cell)
  }

  const renderCell = (
    container: HTMLElement,
    coordinate: Coordinate
  ): HTMLDivElement => {
    const key = `${coordinate.row},${coordinate.col}`
    let cell = activeCells.get(key)

    if (!cell) {
      cell = getCellFromPool()
      cell.style.display = 'block'
      cell.style.transform = `translate(${coordinate.col * cellSize.value}px, ${coordinate.row * cellSize.value}px)`
      container.appendChild(cell)
      activeCells.set(key, cell)
    }

    return cell
  }

  const removeCell = (coordinate: Coordinate): void => {
    const key = `${coordinate.row},${coordinate.col}`
    const cell = activeCells.get(key)

    if (cell) {
      cell.remove()
      returnCellToPool(cell)
      activeCells.delete(key)
    }
  }

  const clearAllCells = (): void => {
    for (const cell of activeCells.values()) {
      cell.remove()
      returnCellToPool(cell)
    }
    activeCells.clear()
  }

  const updateCellSize = (newSize: number): void => {
    cellSize.value = newSize
    // Update all active cells
    for (const [key, cell] of activeCells) {
      const [row, col] = key.split(',').map(Number)
      cell.style.width = `${newSize}px`
      cell.style.height = `${newSize}px`
      cell.style.transform = `translate(${col! * newSize}px, ${row! * newSize}px)`
    }
  }

  onUnmounted(() => {
    clearAllCells()
    cellPool.length = 0
  })

  return {
    cellSize,
    renderCell,
    removeCell,
    clearAllCells,
    updateCellSize
  }
}
