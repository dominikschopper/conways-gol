import type { Coordinate, CellState } from '../types/Cell';
import type { BoardConfig, BoardState } from '../types/Board';
import { SparseGrid } from '../data-structures/SparseGrid';
import { NeighborCounter } from './NeighborCounter';
import { coordHash } from '../types/Cell';

/**
 * Board manages the game state and provides operations
 * Uses sparse grid for efficient storage
 */
export class Board {
  private grid: SparseGrid;
  private neighborCounter: NeighborCounter;
  private generation: number = 0;

  constructor(
    private config: BoardConfig,
    initialCells?: Coordinate[]
  ) {
    this.grid = new SparseGrid(initialCells, config);
    this.neighborCounter = new NeighborCounter(config);
  }

  isAlive(coordinate: Coordinate): boolean {
    return this.isValidCoordinate(coordinate) && this.grid.isAlive(coordinate);
  }

  isDying(coordinate: Coordinate): boolean {
    return this.isValidCoordinate(coordinate) && this.grid.isDying(coordinate);
  }

  setAlive(coordinate: Coordinate): void {
    if (this.isValidCoordinate(coordinate)) {
      this.grid.setAlive(coordinate);
    }
  }

  setDying(coordinate: Coordinate): void {
    if (this.isValidCoordinate(coordinate)) {
      this.grid.setDying(coordinate);
    }
  }

  setDead(coordinate: Coordinate): void {
    if (this.isValidCoordinate(coordinate)) {
      this.grid.setDead(coordinate);
    }
  }

  toggle(coordinate: Coordinate): void {
    if (this.isValidCoordinate(coordinate)) {
      this.grid.toggle(coordinate);
    }
  }

  clear(): void {
    this.grid.clear();
    this.generation = 0;
  }

  getLivingCells(): Coordinate[] {
    return this.grid.getLivingCells();
  }

  getDyingCells(): Coordinate[] {
    return this.grid.getDyingCells();
  }

  getCellState(coordinate: Coordinate): CellState {
    return this.grid.getState(coordinate);
  }

  getGeneration(): number {
    return this.generation;
  }

  getConfig(): BoardConfig {
    return { ...this.config };
  }

  getState(): BoardState {
    return {
      livingCells: new Set(this.grid.getLivingCells().map(coordHash)),
      generation: this.generation
    };
  }

  setState(cells: Coordinate[], dyingCells?: Coordinate[], generation?: number): void {
    this.grid.clear();
    for (const cell of cells) {
      this.grid.setAlive(cell);
    }
    if (dyingCells) {
      for (const cell of dyingCells) {
        this.grid.setDying(cell);
      }
    }
    if (generation !== undefined) {
      this.generation = generation;
    }
  }

  incrementGeneration(): void {
    this.generation++;
  }

  getNeighborCount(coordinate: Coordinate): number {
    return this.neighborCounter.countLivingNeighbors(
      coordinate,
      (coord) => this.grid.isAlive(coord)
    );
  }

  getCellsToEvaluate(): Coordinate[] {
    return this.grid.getCellsToEvaluate();
  }

  get livingCellCount(): number {
    return this.grid.size;
  }

  private isValidCoordinate(coordinate: Coordinate): boolean {
    const { row, col } = coordinate;
    const { rows, cols } = this.config;
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }
}
