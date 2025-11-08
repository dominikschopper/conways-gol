import { game } from './config';

function toggleCellStatus(cell: HTMLElement) {
    cell.classList.toggle(game.liveClass);
}

export function toggleEventListener() {
    const boardElement = document.querySelector(game.boardSelector);
    boardElement?.addEventListener('click', (ev) => {
        const cellToToggle = ev.target;
        if (cellToToggle instanceof HTMLElement) {
            toggleCellStatus(cellToToggle)
        }
    });
}