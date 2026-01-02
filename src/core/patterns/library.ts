import type { PatternDefinition } from '../types/Pattern';
import { Pattern } from './Pattern';
import { coord } from '../types/Cell';

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
};

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
};

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
};

// Beacon pattern (period-2 oscillator)
const BEACON: PatternDefinition = {
  name: 'Beacon',
  description: 'Ein Period-2 Oszillator aus zwei 2x2 Blöcken',
  width: 4,
  height: 4,
  cells: [
    coord(0, 0),
    coord(0, 1),
    coord(1, 0),
    coord(2, 3),
    coord(3, 2),
    coord(3, 3)
  ]
};

// Pulsar pattern (period-3 oscillator)
const PULSAR: PatternDefinition = {
  name: 'Pulsar',
  description: 'Ein großer Period-3 Oszillator',
  width: 13,
  height: 13,
  cells: [
    // Top rows
    coord(0, 2), coord(0, 3), coord(0, 4), coord(0, 8), coord(0, 9), coord(0, 10),
    // Second section
    coord(2, 0), coord(2, 5), coord(2, 7), coord(2, 12),
    coord(3, 0), coord(3, 5), coord(3, 7), coord(3, 12),
    coord(4, 0), coord(4, 5), coord(4, 7), coord(4, 12),
    // Middle gaps at row 5 and 7
    coord(5, 2), coord(5, 3), coord(5, 4), coord(5, 8), coord(5, 9), coord(5, 10),
    coord(7, 2), coord(7, 3), coord(7, 4), coord(7, 8), coord(7, 9), coord(7, 10),
    // Lower section (mirror of upper)
    coord(8, 0), coord(8, 5), coord(8, 7), coord(8, 12),
    coord(9, 0), coord(9, 5), coord(9, 7), coord(9, 12),
    coord(10, 0), coord(10, 5), coord(10, 7), coord(10, 12),
    // Bottom rows
    coord(12, 2), coord(12, 3), coord(12, 4), coord(12, 8), coord(12, 9), coord(12, 10)
  ]
};

// Lightweight Spaceship (LWSS)
const LWSS: PatternDefinition = {
  name: 'LWSS',
  description: 'Lightweight Spaceship - bewegt sich horizontal',
  width: 5,
  height: 4,
  cells: [
    coord(0, 1),
    coord(0, 4),
    coord(1, 0),
    coord(2, 0),
    coord(2, 4),
    coord(3, 0),
    coord(3, 1),
    coord(3, 2),
    coord(3, 3)
  ]
};

// Gosper Glider Gun
const GOSPER_GLIDER_GUN: PatternDefinition = {
  name: 'Gosper Glider Gun',
  description: 'Erzeugt unendlich viele Glider',
  width: 36,
  height: 9,
  cells: [
    // Left square
    coord(4, 0),
    coord(4, 1),
    coord(5, 0),
    coord(5, 1),
    // Left part
    coord(2, 12),
    coord(2, 13),
    coord(3, 11),
    coord(3, 15),
    coord(4, 10),
    coord(4, 16),
    coord(5, 10),
    coord(5, 14),
    coord(5, 16),
    coord(5, 17),
    coord(6, 10),
    coord(6, 16),
    coord(7, 11),
    coord(7, 15),
    coord(8, 12),
    coord(8, 13),
    // Middle part
    coord(1, 24),
    coord(2, 22),
    coord(2, 24),
    coord(3, 20),
    coord(3, 21),
    coord(4, 20),
    coord(4, 21),
    coord(5, 20),
    coord(5, 21),
    coord(6, 22),
    coord(6, 24),
    coord(7, 24),
    // Right square
    coord(4, 34),
    coord(4, 35),
    coord(5, 34),
    coord(5, 35)
  ]
};

// Pentadecathlon pattern (period-15 oscillator)
const PENTADECATHLON: PatternDefinition = {
  name: 'Pentadecathlon',
  description: 'Ein Period-15 Oszillator',
  width: 10,
  height: 8,
  cells: [
    coord(1, 2),
    coord(1, 7),
    coord(2, 2),
    coord(2, 7),
    coord(3, 1),
    coord(3, 3),
    coord(3, 6),
    coord(3, 8),
    coord(4, 2),
    coord(4, 7),
    coord(5, 2),
    coord(5, 7),
    coord(6, 1),
    coord(6, 3),
    coord(6, 6),
    coord(6, 8),
    coord(7, 2),
    coord(7, 7)
  ]
};

// Acorn pattern (Methuselah)
const ACORN: PatternDefinition = {
  name: 'Acorn',
  description: 'Methuselah-Muster - stabilisiert sich nach 5206 Generationen',
  width: 7,
  height: 3,
  cells: [
    coord(0, 1),
    coord(1, 3),
    coord(2, 0),
    coord(2, 1),
    coord(2, 4),
    coord(2, 5),
    coord(2, 6)
  ]
};

// HighLife-specific patterns

// Replicator pattern (HighLife only - B36/S23)
const REPLICATOR: PatternDefinition = {
  name: 'Replicator',
  description: 'HighLife: Self-replicating pattern that creates copies of itself',
  width: 3,
  height: 3,
  cells: [
    coord(0, 1),
    coord(1, 0),
    coord(1, 2),
    coord(2, 0),
    coord(2, 1),
    coord(2, 2)
  ]
};

// Bomber pattern (HighLife - creates replicators)
const BOMBER: PatternDefinition = {
  name: 'Bomber',
  description: 'HighLife: Creates a stream of replicators',
  width: 5,
  height: 5,
  cells: [
    coord(0, 0),
    coord(0, 1),
    coord(1, 0),
    coord(1, 2),
    coord(2, 1),
    coord(2, 2),
    coord(3, 1),
    coord(3, 2),
    coord(4, 3),
    coord(4, 4)
  ]
};

// Export pattern library
export const CONWAY_PATTERNS = {
  GLIDER: new Pattern(GLIDER),
  BLINKER: new Pattern(BLINKER),
  TOAD: new Pattern(TOAD),
  BEACON: new Pattern(BEACON),
  PULSAR: new Pattern(PULSAR),
  LWSS: new Pattern(LWSS),
  GOSPER_GLIDER_GUN: new Pattern(GOSPER_GLIDER_GUN),
  PENTADECATHLON: new Pattern(PENTADECATHLON),
  ACORN: new Pattern(ACORN)
};

export const HIGHLIFE_PATTERNS = {
  REPLICATOR: new Pattern(REPLICATOR),
  BOMBER: new Pattern(BOMBER)
};

export const getConwayPatterns = (): Pattern[] => Object.values(CONWAY_PATTERNS);
export const getHighLifePatterns = (): Pattern[] => Object.values(HIGHLIFE_PATTERNS);
