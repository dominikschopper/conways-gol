import type { Coordinate } from '../types/Cell';
import { CELL_STATE } from '../types/Cell';
import { Board } from './Board';
import type { RuleSet } from './RuleSet';
import { ConwayRuleSet, isMultiStateRuleSet } from './RuleSet';

export type EngineState = 'stopped' | 'running' | 'paused'

export type EngineConfig = {
  tickRate: number // milliseconds per generation
  ruleSet?: RuleSet
}

/**
 * Engine orchestrates the game loop
 * Handles start/stop/step and applies rules
 */
export class Engine {
  private board: Board;
  private ruleSet: RuleSet;
  private state: EngineState = 'stopped';
  private tickRate: number;
  private animationFrameId: number | null = null;
  private lastTickTime: number = 0;
  private onTickCallback?: () => void;

  constructor(
    board: Board,
    config: EngineConfig = { tickRate: 100 }
  ) {
    this.board = board;
    this.ruleSet = config.ruleSet ?? new ConwayRuleSet();
    this.tickRate = config.tickRate;
  }

  start(): void {
    if (this.state === 'running') return;

    this.state = 'running';
    this.lastTickTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state = 'stopped';
  }

  pause(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state = 'paused';
  }

  private gameLoop(): void {
    if (this.state !== 'running') return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTickTime;

    // Only step if enough time has passed
    if (elapsed >= this.tickRate) {
      this.step();
      this.lastTickTime = currentTime;
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(() => { this.gameLoop(); });
  }

  step(): void {
    const { aliveCells, dyingCells } = this.calculateNextGeneration();
    this.board.setState(aliveCells, dyingCells);
    this.board.incrementGeneration();
    this.onTickCallback?.();
  }

  getState(): EngineState {
    return this.state;
  }

  setTickRate(tickRate: number): void {
    this.tickRate = tickRate;
    // No need to restart - gameLoop will use the new tickRate automatically
  }

  getTickRate(): number {
    return this.tickRate;
  }

  setRuleSet(ruleSet: RuleSet): void {
    this.ruleSet = ruleSet;
  }

  getRuleSet(): RuleSet {
    return this.ruleSet;
  }

  onTick(callback: () => void): void {
    this.onTickCallback = callback;
  }

  private calculateNextGeneration(): { aliveCells: Coordinate[], dyingCells: Coordinate[] } {
    const aliveCells: Coordinate[] = [];
    const dyingCells: Coordinate[] = [];

    // Check if this is a multi-state ruleset
    if (isMultiStateRuleSet(this.ruleSet)) {
      // Multi-state logic: use getNextState()
      for (const cell of this.board.getCellsToEvaluate()) {
        const currentState = this.board.getCellState(cell);
        const neighborCount = this.board.getNeighborCount(cell);
        const nextState = this.ruleSet.getNextState(currentState, neighborCount);

        if (nextState === CELL_STATE.ALIVE) {
          aliveCells.push(cell);
        } else if (nextState === CELL_STATE.DYING) {
          dyingCells.push(cell);
        }
        // DEAD cells are not added to either array (sparse storage)
      }
    } else {
      // 2-state logic: use shouldSurvive() and shouldBeBorn()
      for (const cell of this.board.getCellsToEvaluate()) {
        const isAlive = this.board.isAlive(cell);
        const neighborCount = this.board.getNeighborCount(cell);

        const shouldLive = isAlive
          ? this.ruleSet.shouldSurvive(neighborCount)
          : this.ruleSet.shouldBeBorn(neighborCount);

        if (shouldLive) {
          aliveCells.push(cell);
        }
      }
      // No dying cells in 2-state rulesets
    }

    return { aliveCells, dyingCells };
  }
}
