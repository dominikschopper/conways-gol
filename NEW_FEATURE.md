# Implementation Plan: Reanimation Ruleset (3-State System)

## Goal
Add "Reanimation" ruleset with 3 cell states: DEAD (black) → ALIVE (green) → DYING (yellow) → DEAD

## Reanimation Rules
- **ALIVE** cell with <2 or >3 alive neighbors → **DYING**
- **ALIVE** cell with 2-3 alive neighbors → **ALIVE** (survives)
- **DYING** cell with 2-4 alive neighbors → **ALIVE** (reanimated! 🧟)
- **DYING** cell otherwise → **DEAD**
- **DEAD** cell with exactly 3 alive neighbors → **ALIVE** (birth)
- **DYING cells do NOT count as neighbors** (only ALIVE cells count)

**Note**: All code will use `CELL_STATE.ALIVE`, `CELL_STATE.DYING`, `CELL_STATE.DEAD` constants instead of string literals

## Architecture Strategy
- Keep existing RuleSet interface unchanged for backward compatibility
- Add optional `MultiStateRuleSet` interface extension
- Store ALIVE and DYING cells in separate CellSets (maintain sparse grid optimization)
- Use type guard pattern to branch between 2-state and 3-state logic in Engine

## Implementation Order

### Stage 1: Foundation Types (No Breaking Changes)
1. **`src/core/types/Cell.ts`**
   - Add enum object:
     ```typescript
     export const CELL_STATE = {
       DEAD: 'DEAD',
       ALIVE: 'ALIVE',
       DYING: 'DYING',
     } as const
     ```
   - Change type: `export type CellState = typeof CELL_STATE[keyof typeof CELL_STATE]`
   - This gives us: `CellState = 'DEAD' | 'ALIVE' | 'DYING'`

2. **`src/core/types/Rules.ts`**
   - Add: `REANIMATION: 'REANIMATION'` to RULE_NAME object

3. **`src/constants/rulesets.ts`**
   - Add: `[RULE_NAME.REANIMATION]: 'reanimation'` to RULESET_ROUTES

4. **`src/styles/variables.css`**
   - Add: `--cell-color-dying: #ffff00;` (yellow)

### Stage 2: Data Layer (Storage)
5. **`src/core/data-structures/SparseGrid.ts`**
   - Import: `CELL_STATE, CellState` from `@/core/types/Cell`
   - Add `private dyingCells: CellSet` field
   - Add methods: `isDying()`, `setDying()`, `getDyingCells()`, `getState(): CellState`
   - `getState()` returns `CELL_STATE.ALIVE`, `CELL_STATE.DYING`, or `CELL_STATE.DEAD`
   - Update `getCellsToEvaluate()` to include dying cells
   - Update `clear()` to clear dying cells
   - **Important**: DYING cells do NOT increment neighbor counts

6. **`src/core/engine/Board.ts`**
   - Import: `CELL_STATE, CellState` from `@/core/types/Cell`
   - Add methods: `isDying()`, `setDying()`, `getCellState(): CellState`, `getDyingCells()`
   - Update `setState()` to accept optional `dyingCells` parameter

### Stage 3: Rule System
7. **`src/core/engine/RuleSet.ts`**
   - Import: `CELL_STATE, CellState` from `@/core/types/Cell`
   - Add `MultiStateRuleSet` interface with `getNextState(currentState: CellState, aliveNeighborCount: number): CellState`
   - Add `isMultiStateRuleSet()` type guard function
   - Implement `ReanimationRuleSet` class:
     - Use `CELL_STATE.ALIVE`, `CELL_STATE.DYING`, `CELL_STATE.DEAD` in switch statement
     - getName() returns "Reanimation (3-State)"

8. **`src/core/index.ts`**
   - Export: `ReanimationRuleSet`, `isMultiStateRuleSet`, `MultiStateRuleSet` type
   - Export: `CELL_STATE` from `./types/Cell`

### Stage 4: Engine Logic (State Transitions)
9. **`src/core/engine/Engine.ts`**
   - Update `calculateNextGeneration()`:
     - Check `isMultiStateRuleSet()` to branch logic
     - For multi-state: use `getNextState()` method, collect both alive and dying cells
     - For 2-state: use existing `shouldSurvive()`/`shouldBeBorn()` logic
     - Call `board.setState(aliveCells, dyingCells)`

### Stage 5: UI Rendering
10. **`src/composables/useCellRenderer.ts`**
    - Import: `CELL_STATE` from `@/core/types/Cell`
    - Update `createCellElement()` to accept `state: CellState` parameter (default: `CELL_STATE.ALIVE`)
    - Update `renderCell()` to accept state and set backgroundColor using switch/if:
      - `CELL_STATE.ALIVE` → `var(--cell-color)` (green)
      - `CELL_STATE.DYING` → `var(--cell-color-dying)` (yellow)

11. **`src/composables/useGameBoard.ts`**
    - Add `const dyingCells = ref<Coordinate[]>([])`
    - Update `updateState()` to call `board.getDyingCells()`
    - Export `dyingCells` in return object

12. **`src/components/GameBoard.vue`**
    - Import: `CELL_STATE` from `@/core/types/Cell`
    - Add prop: `dyingCells?: Coordinate[]`
    - Update watch logic to handle both `livingCells` and `dyingCells`
    - Render living cells with `state=CELL_STATE.ALIVE`, dying cells with `state=CELL_STATE.DYING`

### Stage 6: UI Integration
13. **`src/views/GamePage.vue`**
    - Import: `ReanimationRuleSet`
    - Create instance: `const reanimationRuleSet = new ReanimationRuleSet()`
    - Add case in `rulesetConfig` computed for `RULESET_ROUTES[RULE_NAME.REANIMATION]`
    - Destructure `dyingCells` from `useGameBoard()`
    - Pass `:dying-cells="dyingCells"` to GameBoard component

14. **`src/views/LandingPage.vue`**
    - Add reanimation card to rulesets array:
      ```typescript
      {
        name: 'Reanimation',
        route: `/game/${RULESET_ROUTES[RULE_NAME.REANIMATION]}`,
        notation: '3-State',
        color: '#d9d928'
      }
      ```

## Critical Files
1. `src/core/types/Cell.ts` - Adds CELL_STATE enum
2. `src/core/data-structures/SparseGrid.ts` - Dying cell storage
3. `src/core/engine/RuleSet.ts` - MultiStateRuleSet + ReanimationRuleSet
4. `src/core/engine/Engine.ts` - Multi-state transition logic
5. `src/composables/useCellRenderer.ts` - Yellow color rendering

## Backward Compatibility
- Existing rulesets (Conway, HighLife, Seeds) unchanged
- Optional parameters everywhere (`dyingCells?`, `state = CELL_STATE.ALIVE`)
- Type guard (`isMultiStateRuleSet()`) for safe branching
- Sparse storage maintained (no DEAD cells stored)

## Key Design Decisions
- DYING cells do NOT count as neighbors (keeps rules simple)
- Separate CellSets for alive/dying (maintains sparse optimization)
- Optional MultiStateRuleSet interface (backward compatible)
- State parameter in renderCell() (easily extensible to 4+ states)
- CELL_STATE enum pattern (consistent with RULE_NAME pattern)

## Testing After Implementation
1. Place pattern in Reanimation mode → Step → Verify yellow dying cells
2. Verify reanimation: Dying cell with 3 neighbors becomes alive
3. Switch between Conway and Reanimation → No errors
4. Existing rulesets still work correctly
