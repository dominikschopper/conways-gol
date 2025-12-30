# Conway's Game of Life - TypeScript/Vue 3

Eine performante Implementation von Conway's Game of Life mit TypeScript und Vue 3, optimiert durch Sparse Grid Datenstrukturen und Flyweight Pattern.

## Features

- ✅ Konfigurierbare Board-Größe (10-1000 rows, 10-2000 cols)
- ✅ Wraparound (Torus-Topologie) als Setting
- ✅ Start/Stop/Step/Clear Controls
- ✅ Generation Counter & Living Cells Counter
- ✅ Speed Control (FPS Slider)
- ✅ Pattern-Bibliothek (Glider, Blinker, Toad)
- 🔄 Verschiedene Rulesets (geplant)
- 🔄 Drag & Drop für Patterns (geplant)

## Tech-Stack

- **Package Manager**: pnpm
- **Framework**: Vue 3 + TypeScript (Composition API)
- **Build Tool**: Vite
- **Testing**: Vitest
- **Linting**: ESLint (TypeScript Strict)
- **CSS**: Custom CSS mit Josh Comeau Reset

## Architektur

### Core Library (Pure TypeScript)
- **Sparse Grid**: Speichert nur lebende Zellen (O(n) statt O(rows×cols))
- **Board**: Zentrale Spielfeld-Verwaltung
- **Engine**: Game Loop mit konfigurierbarer Tick Rate
- **RuleSet**: Conway's klassische Regeln (B3/S23) + erweiterbar
- **Pattern**: Vordefinierte Zell-Muster

### UI (Vue 3)
- **Sparse Rendering**: Nur lebende Zellen als DOM-Elemente
- **Flyweight Pattern**: DOM-Element-Pool für ~90% weniger DOM-Operationen
- **Event Delegation**: Ein Click-Handler für gesamtes Board
- **CSS Grid Background**: Performantes Grid ohne DOM-Overhead

## Projekt-Fortschritt

### ✅ Phase 1: Setup (Abgeschlossen)
- [x] Vue 3 Dependencies installiert
- [x] TypeScript Config (Strict Mode)
- [x] Vite Config mit Vue Plugin
- [x] Vitest Config
- [x] ESLint Config
- [x] Directory-Struktur
- [x] Entry Points (index.html, main.ts, App.vue)
- [x] CSS Reset & Variables

### ✅ Phase 2: Core Library (Abgeschlossen)
- [x] Type Definitions (Cell, Board, Pattern)
- [x] CellSet (Set-basierte Zell-Speicherung)
- [x] SparseGrid (Sparse Grid + Neighbor Tracking)
- [x] RuleSet (Conway + HighLife)
- [x] NeighborCounter (mit Wraparound)
- [x] Board Class
- [x] Engine Class
- [x] Pattern Class + Library

### ✅ Phase 3: Vue Composables (Abgeschlossen)
- [x] useGameSettings
- [x] useGameBoard
- [x] useGameEngine
- [x] useCellRenderer (Flyweight)

### ✅ Phase 4: Vue Components (Abgeschlossen)
- [x] GameBoard.vue (Sparse Rendering)
- [x] GameControls.vue
- [x] GameSettings.vue
- [x] GenerationCounter.vue
- [x] PatternSelector.vue
- [x] App.vue (Integration)

### 📋 Phase 5: Testing & Polish (Optional)
- [ ] Unit Tests (Core Library)
- [ ] Performance Tests (1000x2000 Board)
- [ ] Edge Cases
- [ ] Dokumentation

## Quick Start

```bash
# Installation
pnpm install

# Dev Server starten
pnpm dev

# Im Browser öffnen: http://localhost:5173
```

Die Anwendung ist jetzt vollständig funktionsfähig! Du kannst:
- **Zellen klicken** um sie zu aktivieren/deaktivieren
- **Patterns platzieren** (Glider, Blinker, Toad)
- **Start** drücken um die Simulation zu starten
- **Speed** anpassen (10-1000ms pro Generation)
- **Board-Größe** ändern (10-1000 Zeilen, 10-2000 Spalten)
- **Wraparound** aktivieren für Torus-Topologie

## Development

```bash
# Installation
pnpm install

# Dev Server
pnpm dev

# Build
pnpm build

# Tests
pnpm test

# Linting
pnpm lint
```

## Performance-Ziele

- **Sparse Grid**: O(n) Speicher wo n = lebende Zellen (nicht O(rows×cols))
- **Rendering**: Flyweight Pattern für 90% weniger DOM-Manipulationen
- **Step Time**: O(8n) für typische Patterns (nur relevante Zellen evaluieren)
- **Target**: 60 FPS bei 10.000+ lebenden Zellen

## Zukünftige Erweiterungen

- Erweiterte Pattern-Bibliothek (Gosper Glider Gun, etc.)
- Save/Load Board-State (JSON/RLE Format)
- Multiple Rulesets im UI
- Drag & Drop Pattern-Platzierung
- Zoom/Pan für große Boards
- Color-Coding (Zell-Alter, Heatmap)
- Performance-Metriken Dashboard
