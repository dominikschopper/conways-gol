import type { Coordinate } from '../types/Cell';
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
    console.log('🎮 Board created with config:', JSON.stringify(config));
    this.grid = new SparseGrid(initialCells, config);
    this.neighborCounter = new NeighborCounter(config);
  }

  isAlive(coordinate: Coordinate): boolean {
    return this.isValidCoordinate(coordinate) && this.grid.isAlive(coordinate);
  }

  setAlive(coordinate: Coordinate): void {
    if (this.isValidCoordinate(coordinate)) {
      this.grid.setAlive(coordinate);
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

  setState(cells: Coordinate[], generation?: number): void {
    this.grid.clear();
    for (const cell of cells) {
      this.grid.setAlive(cell);
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
