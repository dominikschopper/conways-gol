import { type Coordinate, coord, coordHash, CELL_STATE, type CellState } from '../types/Cell';
import type { BoardConfig } from '../types/Board';
import { CellSet } from './CellSet';

/**
 * Sparse grid that only tracks living cells and their neighbors
 * Optimized for Game of Life where most cells are dead
 */
export class SparseGrid {
  private livingCells: CellSet;
  private dyingCells: CellSet;
  private neighborCounts: Map<string, number>; // Hash -> count
  private config?: BoardConfig;

  constructor(initialCells?: Coordinate[], config?: BoardConfig) {
    this.livingCells = new CellSet(initialCells);
    this.dyingCells = new CellSet();
    this.neighborCounts = new Map();
    this.config = config;
    this.recalculateNeighborCounts();
  }

  isAlive(coordinate: Coordinate): boolean {
    return this.livingCells.has(coordinate);
  }

  isDying(coordinate: Coordinate): boolean {
    return this.dyingCells.has(coordinate);
  }

  setAlive(coordinate: Coordinate): void {
    if (!this.livingCells.has(coordinate)) {
      this.livingCells.add(coordinate);
      this.dyingCells.delete(coordinate); // Remove from dying if present
      this.incrementNeighbors(coordinate);
    }
  }

  setDying(coordinate: Coordinate): void {
    if (!this.dyingCells.has(coordinate)) {
      // Dying cells don't count as neighbors, so decrement if was alive
      const wasAlive = this.livingCells.has(coordinate);
      if (wasAlive) {
        this.livingCells.delete(coordinate);
        this.decrementNeighbors(coordinate);
      }
      this.dyingCells.add(coordinate);
    }
  }

  setDead(coordinate: Coordinate): void {
    const wasAlive = this.livingCells.has(coordinate);
    if (wasAlive) {
      this.livingCells.delete(coordinate);
      this.decrementNeighbors(coordinate);
    }
    this.dyingCells.delete(coordinate); // Also remove from dying
  }

  toggle(coordinate: Coordinate): void {
    if (this.isAlive(coordinate)) {
      this.setDead(coordinate);
    } else {
      this.setAlive(coordinate);
    }
  }

  getNeighborCount(coordinate: Coordinate): number {
    return this.neighborCounts.get(coordHash(coordinate)) ?? 0;
  }

  getLivingCells(): Coordinate[] {
    return this.livingCells.toArray();
  }

  getDyingCells(): Coordinate[] {
    return this.dyingCells.toArray();
  }

  getState(coordinate: Coordinate): CellState {
    if (this.livingCells.has(coordinate)) {
      return CELL_STATE.ALIVE;
    }
    if (this.dyingCells.has(coordinate)) {
      return CELL_STATE.DYING;
    }
    return CELL_STATE.DEAD;
  }

  // Get all cells that need to be evaluated (living cells + dying cells + their neighbors)
  getCellsToEvaluate(): Coordinate[] {
    const cells = new Set<string>();

    // Add all living cells
    for (const cell of this.livingCells) {
      cells.add(coordHash(cell));
    }

    // Add all dying cells (they can be reanimated)
    for (const cell of this.dyingCells) {
      cells.add(coordHash(cell));
    }

    // Add all cells with neighbors (potential births)
    for (const hash of this.neighborCounts.keys()) {
      cells.add(hash);
    }

    return Array.from(cells, hash => {
      const [row, col] = hash.split(',').map(Number);
      return coord(row!, col!);
    });
  }

  clear(): void {
    this.livingCells.clear();
    this.dyingCells.clear();
    this.neighborCounts.clear();
  }

  get size(): number {
    return this.livingCells.size;
  }

  private incrementNeighbors(coordinate: Coordinate): void {
    for (const neighbor of this.getNeighborCoordinates(coordinate)) {
      const hash = coordHash(neighbor);
      this.neighborCounts.set(hash, (this.neighborCounts.get(hash) ?? 0) + 1);
    }
  }

  private decrementNeighbors(coordinate: Coordinate): void {
    for (const neighbor of this.getNeighborCoordinates(coordinate)) {
      const hash = coordHash(neighbor);
      const count = (this.neighborCounts.get(hash) ?? 0) - 1;
      if (count <= 0) {
        this.neighborCounts.delete(hash);
      } else {
        this.neighborCounts.set(hash, count);
      }
    }
  }

  private recalculateNeighborCounts(): void {
    this.neighborCounts.clear();
    for (const cell of this.livingCells) {
      this.incrementNeighbors(cell);
    }
  }

  private *getNeighborCoordinates(coordinate: Coordinate): Generator<Coordinate> {
    const { row, col } = coordinate;

    // If we don't have config, use simple neighbor calculation (no wraparound)
    if (!this.config) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          yield coord(row + dr, col + dc);
        }
      }
      return;
    }

    // Use config for wraparound support
    const { rows, cols, wraparound } = this.config;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        let newRow = row + dr;
        let newCol = col + dc;

        if (wraparound) {
          // Torus topology: wrap around edges
          newRow = ((newRow % rows) + rows) % rows;
          newCol = ((newCol % cols) + cols) % cols;
        } else {
          // Skip out-of-bounds neighbors
          if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
            continue;
          }
        }

        yield coord(newRow, newCol);
      }
    }
  }
}
