# Conway's Game of Life - TypeScript/Vue 3

Eine performante Implementation von Conway's Game of Life mit TypeScript und Vue 3, optimiert durch Sparse Grid Datenstrukturen und Flyweight Pattern.

**[🎮 Live Demo](https://dominikschopper.github.io/conways-gol/)**

## Features

- configurable board size
- wraparound mode for board (torus topologie)
- start/stop/step/clear controls
- generation counter & living cells counter
- speed control
- pattern library
- different rulesets
- planned: drag'n'drop patterns
- works with html grid, not a canvas

## technologies

- **Package Manager**: pnpm
- **Framework**: Vue 3 + TypeScript (Composition API)
- **Build Tool**: Vite
- **Testing**: Vitest
- **Linting**: ESLint (TypeScript Strict)

## Architektur

### Core Library (Pure TypeScript)
- **SparseGrid**: saves only alive cells (O(n) instead of O(rows×cols))
- **Board**: game board management
- **Engine**: game loop with tick rate ()
- **RuleSets**: classic, HighLife and Seeds
- **Pattern**: predefined patterns

### UI (Vue 3)
- **Sparse Rendering**: only living cells are checked
- **Event Delegation**: single click handler for the board
