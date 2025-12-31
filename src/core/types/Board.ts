export type BoardConfig = {
  readonly rows: number
  readonly cols: number
  readonly wraparound: boolean
}

export type BoardState = {
  readonly livingCells: ReadonlySet<string> // Hashed coordinates
  readonly generation: number
}
