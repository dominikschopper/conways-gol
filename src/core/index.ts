// Types
export type { Coordinate, CellState } from './types/Cell';
export type { BoardConfig, BoardState } from './types/Board';
export type { PatternDefinition } from './types/Pattern';
export { coord, coordEquals, coordHash } from './types/Cell';

// Data Structures
export { CellSet } from './data-structures/CellSet';
export { SparseGrid } from './data-structures/SparseGrid';

// Engine
export { Board } from './engine/Board';
export { Engine, type EngineState, type EngineConfig } from './engine/Engine';
export { NeighborCounter } from './engine/NeighborCounter';
export { ConwayRuleSet, HighLifeRuleSet, type RuleSet } from './engine/RuleSet';

// Patterns
export { Pattern } from './patterns/Pattern';
export { PATTERN_LIBRARY, getAllPatterns } from './patterns/library';
