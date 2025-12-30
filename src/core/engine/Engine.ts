import type { Coordinate } from '../types/Cell'
import { Board } from './Board'
import type { RuleSet } from './RuleSet'
import { ConwayRuleSet } from './RuleSet'

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
  private board: Board
  private ruleSet: RuleSet
  private state: EngineState = 'stopped'
  private tickRate: number
  private intervalId: number | null = null
  private onTickCallback?: () => void

  constructor(
    board: Board,
    config: EngineConfig = { tickRate: 100 }
  ) {
    this.board = board
    this.ruleSet = config.ruleSet ?? new ConwayRuleSet()
    this.tickRate = config.tickRate
  }

  start(): void {
    if (this.state === 'running') return

    this.state = 'running'
    this.intervalId = window.setInterval(() => {
      this.step()
    }, this.tickRate)
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.state = 'stopped'
  }

  pause(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.state = 'paused'
  }

  step(): void {
    const nextGeneration = this.calculateNextGeneration()
    this.board.setState(nextGeneration)
    this.board.incrementGeneration()
    this.onTickCallback?.()
  }

  getState(): EngineState {
    return this.state
  }

  setTickRate(tickRate: number): void {
    this.tickRate = tickRate
    // Restart interval if running
    if (this.state === 'running') {
      this.stop()
      this.start()
    }
  }

  getTickRate(): number {
    return this.tickRate
  }

  setRuleSet(ruleSet: RuleSet): void {
    this.ruleSet = ruleSet
  }

  getRuleSet(): RuleSet {
    return this.ruleSet
  }

  onTick(callback: () => void): void {
    this.onTickCallback = callback
  }

  private calculateNextGeneration(): Coordinate[] {
    const nextGen: Coordinate[] = []

    // Evaluate all cells that could change
    for (const cell of this.board.getCellsToEvaluate()) {
      const isAlive = this.board.isAlive(cell)
      const neighborCount = this.board.getNeighborCount(cell)

      const shouldLive = isAlive
        ? this.ruleSet.shouldSurvive(neighborCount)
        : this.ruleSet.shouldBeBorn(neighborCount)

      if (shouldLive) {
        nextGen.push(cell)
      }
    }

    return nextGen
  }
}
