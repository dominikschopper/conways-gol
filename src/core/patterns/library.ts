import type { PatternDefinition } from '../types/Pattern'
import { Pattern } from './Pattern'
import { coord } from '../types/Cell'

// Glider pattern (moves diagonally)
const GLIDER: PatternDefinition = {
  name: 'Glider',
  description: 'Ein kleines Raumschiff, das sich diagonal bewegt',
  width: 3,
  height: 3,
  cells: [
    coord(0, 1),
    coord(1, 2),
    coord(2, 0),
    coord(2, 1),
    coord(2, 2)
  ]
}

// Blinker pattern (period-2 oscillator)
const BLINKER: PatternDefinition = {
  name: 'Blinker',
  description: 'Ein einfacher Period-2 Oszillator',
  width: 3,
  height: 1,
  cells: [
    coord(0, 0),
    coord(0, 1),
    coord(0, 2)
  ]
}

// Toad pattern (period-2 oscillator)
const TOAD: PatternDefinition = {
  name: 'Toad',
  description: 'Ein Period-2 Oszillator',
  width: 4,
  height: 2,
  cells: [
    coord(0, 1),
    coord(0, 2),
    coord(0, 3),
    coord(1, 0),
    coord(1, 1),
    coord(1, 2)
  ]
}

// Export pattern library
export const PATTERN_LIBRARY = {
  GLIDER: new Pattern(GLIDER),
  BLINKER: new Pattern(BLINKER),
  TOAD: new Pattern(TOAD)
}

export const getAllPatterns = (): Pattern[] => Object.values(PATTERN_LIBRARY)
