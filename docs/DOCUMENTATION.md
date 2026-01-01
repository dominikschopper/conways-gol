# Conway's Game of Life - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Component Diagrams](#component-diagrams)
4. [Data Flow](#data-flow)
5. [State Management](#state-management)
6. [Core Game Logic](#core-game-logic)
7. [Performance Optimizations](#performance-optimizations)
8. [Component Reference](#component-reference)

## Project Overview

This is a Vue 3 implementation of Conway's Game of Life, a cellular automaton simulation. The project demonstrates modern frontend architecture patterns including:

- **Vue 3 Composition API** for reactive state management
- **TypeScript** for type safety
- **Component-based architecture** with clear separation of concerns
- **Optimized game engine** using sparse data structures
- **Flyweight pattern** for efficient DOM rendering

### Technology Stack
- Vue 3.5 (TypeScript)
- Vite 6 (build tool)
- ESLint 9 (linting)

## Architecture

The application follows a three-layer architecture:

1. **UI Layer**: Vue components for user interaction
2. **State Management Layer**: Composables managing reactive state
3. **Core Logic Layer**: Pure TypeScript game engine

This separation ensures:
- Clear responsibility boundaries
- Testability of business logic
- Reusability of core algorithms
- Type-safe interfaces between layers

### Key Design Patterns

- **Composition Pattern**: App.vue composes multiple composables
- **Unidirectional Data Flow**: Props down, events up
- **Observer Pattern**: Vue reactivity system
- **Sparse Data Structures**: Only track active cells
- **Flyweight Pattern**: DOM element pooling for rendering
- **Strategy Pattern**: Pluggable game rules (Conway, HighLife)

## Component Diagrams

### High-Level Architecture

![High-Level Components](high-level-components.puml)

This diagram shows the overall structure:
- **App.vue**: Central orchestrator composing state and UI
- **Composables**: State management layer (useGameSettings, useGameBoard, useGameEngine)
- **UI Components**: Five components for different UI concerns
- **Core Logic**: Game engine and data structures

[View Diagram](high-level-components.puml)

### Mid-Level Architecture

![Mid-Level Components](mid-level-components.puml)

This diagram details:
- Component props and events (interfaces)
- Composable exports and dependencies
- Communication patterns between layers
- Core module integration points

[View Diagram](mid-level-components.puml)

### Low-Level Architecture

![Low-Level Components](low-level-components.puml)

This diagram shows the internal structure:
- Engine, Board, SparseGrid class relationships
- RuleSet interface and implementations
- Pattern system architecture
- DOM rendering optimization (useCellRenderer)
- Performance optimization strategies

[View Diagram](low-level-components.puml)

## Data Flow

![Data Flow](data-flow.puml)

This sequence diagram illustrates:
1. **Initial Setup**: App creates composables in dependency order
2. **User Interactions**: Click events, control actions, settings changes
3. **Game Loop**: Automatic state updates via requestAnimationFrame
4. **Reactivity**: How Vue's reactivity system propagates changes

[View Diagram](data-flow.puml)

### Unidirectional Data Flow

```
User Input → Component Event → App Handler → Composable Method → Core Logic
                                                                        ↓
User Display ← Component Re-render ← Props Update ← Reactivity ← State Change
```

## State Management

The application uses **Vue 3 Composition API** without external state management libraries.

### Composable Architecture

#### useGameSettings
**Purpose**: Manages grid configuration

**Exports**:
- `rows: Ref<number>` - Grid rows
- `cols: Ref<number>` - Grid columns
- `wraparound: Ref<boolean>` - Torus topology toggle
- `config: ComputedRef<BoardConfig>` - Combined configuration object
- `updateSettings(config)` - Update all settings atomically

#### useGameBoard
**Purpose**: Manages game board state

**Exports**:
- `board: Board` - Core board instance
- `livingCells: ComputedRef<Coordinate[]>` - Array of living cell coordinates
- `generation: Ref<number>` - Current generation number
- `livingCellCount: ComputedRef<number>` - Count of living cells
- `toggleCell(coord)` - Toggle cell state
- `placePattern(pattern, position)` - Place pattern on board
- `clear()` - Clear all cells
- `updateState()` - Trigger reactivity (called by engine)

**Watchers**:
- Watches `config` and recreates board on changes

#### useGameEngine
**Purpose**: Manages game loop and simulation

**Exports**:
- `engine: Engine` - Core engine instance
- `state: Ref<EngineState>` - Engine state ('stopped' | 'running' | 'paused')
- `tickRate: Ref<number>` - Milliseconds per generation
- `isRunning: ComputedRef<boolean>` - True if running
- `isPaused: ComputedRef<boolean>` - True if paused
- `start()`, `stop()`, `pause()`, `step()` - Playback controls
- `setTickRate(rate)` - Update simulation speed

**Watchers**:
- Watches `board` and recreates engine on changes

#### useCellRenderer
**Purpose**: Optimized DOM manipulation for cell rendering

**Exports**:
- `cellSize: Ref<number>` - Current cell pixel size
- `renderCell(coord, container)` - Render or reuse cell element
- `removeCell(coord)` - Remove and pool cell element
- `clearAllCells()` - Clear all rendered cells
- `updateCellSize(size)` - Update cell dimensions

**Optimization**: Uses flyweight pattern with element pool

### Reactive Dependencies

```
config (computed) ─→ board (watched) ─→ engine (watched)
     ↑                      ↑                   ↓
rows, cols, wraparound    Board instance    Engine callbacks
```

## Core Game Logic

### Engine Architecture

The core game engine is pure TypeScript with no Vue dependencies.

#### Engine Class
**Responsibilities**:
- Game loop using `requestAnimationFrame`
- Tick rate management (throttling)
- Generation calculation
- State change callbacks

**Key Methods**:
- `start()`: Begin game loop
- `stop()`: Stop game loop
- `pause()`: Pause without stopping
- `step()`: Advance one generation
- `calculateNextGeneration()`: Apply rules to all cells

#### Board Class
**Responsibilities**:
- Manage board state
- Validate coordinates
- Track generation count
- Provide cells to evaluate

**Key Methods**:
- `toggle(coord)`: Toggle cell alive/dead
- `isAlive(coord)`: Check cell state
- `getLivingCells()`: Get all living cells
- `getCellsToEvaluate()`: Get evaluation candidates
- `setState(cells)`: Replace all living cells

#### SparseGrid Class
**Responsibilities**:
- Efficient storage (only living cells)
- Neighbor count caching
- Fast cell evaluation

**Data Structures**:
- `livingCells: Set<string>` - Living cell coordinates as "row,col"
- `neighborCounts: Map<string, number>` - Pre-computed neighbor counts

**Optimization**: When a cell becomes alive, increments neighbor counts for all 8 neighbors. When it dies, decrements them. This makes rule evaluation O(1) for neighbor counting.

#### NeighborCounter Class
**Responsibilities**:
- Calculate neighbor coordinates
- Handle wraparound topology
- Count living neighbors

**Wraparound Logic**:
- `wraparound=true`: Torus topology (edges wrap to opposite side)
- `wraparound=false`: Bounded grid (edge cells have fewer neighbors)

#### RuleSet Interface
**Implementations**:
- **ConwayRuleSet (B3/S23)**: Classic rules
  - Birth: exactly 3 neighbors
  - Survival: 2-3 neighbors
- **HighLifeRuleSet (B36/S23)**: Extended rules
  - Birth: 3 or 6 neighbors
  - Survival: 2-3 neighbors

### Pattern System

#### Pattern Class
Wraps pattern definitions with placement logic.

**Methods**:
- `placeOnBoard(board, position)`: Places pattern cells at offset position

#### Pattern Library
Pre-defined patterns:
- **Glider**: Diagonal traveling oscillator
- **Blinker**: Period-2 oscillator (vertical ↔ horizontal)
- **Toad**: Period-2 oscillator

## Performance Optimizations

### 1. Sparse Grid Storage
**Problem**: Storing entire grid wastes memory for mostly-empty boards.

**Solution**: `SparseGrid` only stores living cells in a `Set<string>` using "row,col" keys.

**Impact**: Memory usage is O(living cells) instead of O(rows × cols).

### 2. Neighbor Count Caching
**Problem**: Counting neighbors for every cell evaluation is expensive.

**Solution**: `SparseGrid` maintains a `Map<string, number>` of neighbor counts, updated incrementally when cells toggle.

**Impact**: Neighbor counting becomes O(1) lookup instead of O(8) iteration.

### 3. Selective Cell Evaluation
**Problem**: Evaluating all cells in grid is wasteful.

**Solution**: Only evaluate:
- Living cells (might die)
- Cells with at least one neighbor (might be born)

**Implementation**: `getCellsToEvaluate()` returns `livingCells ∪ cellsWithNeighbors`.

**Impact**: Evaluation is O(active region) instead of O(entire grid).

### 4. Flyweight Pattern for DOM
**Problem**: Creating/destroying thousands of DOM elements causes GC pressure and layout thrashing.

**Solution**: `useCellRenderer` maintains a pool of reusable `<div>` elements. When a cell is removed, the element is pooled instead of destroyed.

**Impact**: Reduces GC pauses and improves rendering performance.

### 5. Event Delegation
**Problem**: Adding click handlers to thousands of cells is slow.

**Solution**: `GameBoard.vue` uses a single click handler on the container, calculates clicked cell from mouse coordinates.

**Impact**: Faster initialization and lower memory overhead.

### 6. RequestAnimationFrame
**Problem**: `setInterval` can cause jank and doesn't sync with display refresh.

**Solution**: Engine uses `requestAnimationFrame` with elapsed time tracking for consistent tick rate.

**Impact**: Smooth animations and battery-friendly execution.

## Component Reference

### App.vue
**Location**: [src/App.vue](../src/App.vue)

**Responsibilities**:
- Compose all composables
- Pass props to components
- Handle component events
- Orchestrate state changes

**Key Handlers**:
- `handleSettingsChange()`: Updates settings and recreates engine
- `handleSelectPattern()`: Places pattern on board

### GameBoard.vue
**Location**: [src/components/GameBoard.vue](../src/components/GameBoard.vue)

**Props**:
- `rows: number` - Grid height
- `cols: number` - Grid width
- `livingCells: Coordinate[]` - Array of living cells

**Events**:
- `toggleCell(coord: Coordinate)` - Emitted on cell click

**Features**:
- Dynamic cell sizing based on container dimensions
- Event delegation for click handling
- Uses `useCellRenderer` for DOM pooling

### GameControls.vue
**Location**: [src/components/GameControls.vue](../src/components/GameControls.vue)

**Props**:
- `isRunning: boolean` - Whether game is running
- `isPaused: boolean` - Whether game is paused
- `tickRate: number` - Current tick rate in ms

**Events**:
- `start()` - Start simulation
- `stop()` - Stop simulation
- `pause()` - Pause simulation
- `step()` - Advance one generation
- `clear()` - Clear all cells
- `update:tickRate(rate: number)` - Change simulation speed

**Features**:
- Conditional button states (disabled when inappropriate)
- Speed slider (100ms - 2000ms range)

### GameSettings.vue
**Location**: [src/components/GameSettings.vue](../src/components/GameSettings.vue)

**Props**:
- `rows: number` - Current grid height
- `cols: number` - Current grid width
- `wraparound: boolean` - Current wraparound setting
- `disabled: boolean` - Disable inputs (when running)

**Events**:
- `update:settings({ rows, cols, wraparound })` - Settings changed

**Features**:
- Input buffering (only emits on button click)
- Validation (min/max constraints)
- Disabled state when game is running

### GenerationCounter.vue
**Location**: [src/components/GenerationCounter.vue](../src/components/GenerationCounter.vue)

**Props**:
- `generation: number` - Current generation number
- `livingCells: number` - Count of living cells

**Features**:
- Read-only display
- No events (pure presentation)

### PatternSelector.vue
**Location**: [src/components/PatternSelector.vue](../src/components/PatternSelector.vue)

**Props**:
- `rows: number` - Grid height (for pattern positioning)
- `cols: number` - Grid width (for pattern positioning)
- `livingCells: Coordinate[]` - Current living cells (for conflict detection)

**Events**:
- `selectPattern(pattern: Pattern, position: Coordinate)` - Pattern selected and placed

**Features**:
- Dropdown to select pattern
- Click on grid to place pattern
- Centers pattern at click position
- Shows pattern preview in dropdown

## File Structure

```
src/
├── components/
│   ├── GameBoard.vue           - Grid and cell rendering
│   ├── GameControls.vue        - Playback controls
│   ├── GameSettings.vue        - Configuration inputs
│   ├── GenerationCounter.vue   - Stats display
│   └── PatternSelector.vue     - Pattern library UI
├── composables/
│   ├── useGameSettings.ts      - Grid configuration state
│   ├── useGameBoard.ts         - Board state management
│   ├── useGameEngine.ts        - Game loop management
│   └── useCellRenderer.ts      - DOM rendering optimization
├── core/
│   ├── engine/
│   │   ├── Engine.ts           - Game loop orchestrator
│   │   ├── Board.ts            - Board state manager
│   │   ├── NeighborCounter.ts  - Neighbor calculation
│   │   └── RuleSet.ts          - Game rules interface
│   ├── data-structures/
│   │   ├── SparseGrid.ts       - Sparse cell storage
│   │   └── CellSet.ts          - Cell set utilities
│   ├── types/
│   │   ├── Cell.ts             - Coordinate types
│   │   ├── Board.ts            - Board types
│   │   └── Pattern.ts          - Pattern types
│   ├── patterns/
│   │   ├── Pattern.ts          - Pattern class
│   │   └── library.ts          - Pattern definitions
│   └── index.ts                - Public API exports
├── styles/
│   └── game-board.css          - Game board styling
├── App.vue                     - Root component
└── main.ts                     - Application entry point
```

## Key Type Definitions

### Coordinate
```typescript
interface Coordinate {
  readonly row: number;
  readonly col: number;
}
```

### BoardConfig
```typescript
interface BoardConfig {
  readonly rows: number;
  readonly cols: number;
  readonly wraparound: boolean;
}
```

### BoardState
```typescript
interface BoardState {
  readonly livingCells: ReadonlySet<string>;
  readonly generation: number;
}
```

### EngineState
```typescript
type EngineState = 'stopped' | 'running' | 'paused';
```

### PatternDefinition
```typescript
interface PatternDefinition {
  readonly name: string;
  readonly description: string;
  readonly cells: readonly Coordinate[];
  readonly width: number;
  readonly height: number;
}
```

## Building and Running

### Development
```bash
pnpm install
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm preview
```

### Linting
```bash
pnpm lint
```

## Future Enhancements

Potential improvements:
- Additional rule sets (Seeds, Life Without Death, etc.)
- Pattern import/export (RLE format)
- Infinite grid with viewport panning
- Color coding for cell age
- Performance profiling overlay
- Touch gesture support for mobile
- Undo/redo history
- Save/load game states

---

**Last Updated**: January 2026
**Vue Version**: 3.5
**Author**: Conway's Game of Life Project
