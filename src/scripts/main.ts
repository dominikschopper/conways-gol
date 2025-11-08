import { game } from './config';
import { toggleEventListener } from './interaction';


export function drawBoard() {
    document.documentElement.style.setProperty("--game-cols", `${game.cols}`);
    document.documentElement.style.setProperty("--game-rows", `${game.rows}`);

    const gameBoard = document.querySelector(game.boardSelector);
    for (let r = 0; r < game.rows; r += 1) {
        for (let c = 0; c < game.cols; c += 1) {
            const rowClass = `row-${r}`;
            const colClass = `col-${c}`;
            const cell = document.createElement('div');
            cell.classList.add(rowClass, colClass);
            gameBoard?.appendChild(cell);
        }
    }
}

function createCellElement() {
    return document.createElement('div');
}

let initialized = false;
export function initializeInteractions() {
    if (initialized) {
        console.log('already initialized!');
        return;
    }
    initialized = true;
    toggleEventListener();
}