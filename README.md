# A TS Implementation of Conways Game of Life

claude chat mit plan findest Du hier https://claude.ai/chat/ba053298-564a-4988-8d24-75aa1a289e85

### Projekt: Conway's Game of Life in TypeScript/Vue 3
## Features:

- Konfigurierbare Board-Größe (auch sehr groß: 1000x2000)
- Wraparound (Torus-Topologie)
- Start/Stop/Step Controls
- Verschiedene Rulesets
- Drag & Drop für Patterns (Glider, Blinker, etc.)

## Tech-Architektur:

- wir verwenden pnpm (ab jetzt in allen projekten - bitte ggf daran erinnern!)
- Core Library: Pure TypeScript (Board, RuleSet, Pattern, Engine)
- UI: Vue 3 + TypeScript + Composition API
- Board Rendering: Sparse Grid mit Flyweight Pattern

- Nur lebende Zellen als DOM-Elemente
- Ein Event-Handler für gesamtes Board
- CSS Grid als Hintergrund
- Skaliert auf Millionen theoretische Zellen



## Nächste Schritte dort:

- Projekt-Setup (Vue 3 + TypeScript)
- Core Library implementieren
- Sparse Grid Board Component
- Controls & Settings UI
- Pattern Library mit Drag & Drop
