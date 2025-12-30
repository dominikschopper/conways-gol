import type { Coordinate } from './Cell'

export type PatternDefinition = {
  readonly name: string
  readonly description: string
  readonly cells: readonly Coordinate[] // Relative coordinates
  readonly width: number
  readonly height: number
}
