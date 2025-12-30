import { type Coordinate, coordHash, coord } from '../types/Cell'

/**
 * Efficient set-based storage for living cells
 * Uses coordinate hashing for O(1) lookup
 */
export class CellSet {
  private cells: Set<string>

  constructor(initialCells?: Coordinate[]) {
    this.cells = new Set(initialCells?.map(coordHash) ?? [])
  }

  add(coordinate: Coordinate): void {
    this.cells.add(coordHash(coordinate))
  }

  delete(coordinate: Coordinate): void {
    this.cells.delete(coordHash(coordinate))
  }

  has(coordinate: Coordinate): boolean {
    return this.cells.has(coordHash(coordinate))
  }

  clear(): void {
    this.cells.clear()
  }

  get size(): number {
    return this.cells.size
  }

  // Iterator for all living cells
  *[Symbol.iterator](): Iterator<Coordinate> {
    for (const hash of this.cells) {
      const [row, col] = hash.split(',').map(Number)
      if (row !== undefined && col !== undefined) {
        yield coord(row, col)
      }
    }
  }

  toArray(): Coordinate[] {
    return Array.from(this)
  }

  clone(): CellSet {
    const cloned = new CellSet()
    cloned.cells = new Set(this.cells)
    return cloned
  }
}
