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
export { ConwayRuleSet, HighLifeRuleSet, SeedsRuleSet, type RuleSet } from './engine/RuleSet';

// Patterns
export { Pattern } from './patterns/Pattern';
export { CONWAY_PATTERNS, HIGHLIFE_PATTERNS, getConwayPatterns, getHighLifePatterns } from './patterns/library';
