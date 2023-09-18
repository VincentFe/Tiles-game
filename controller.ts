import { Board } from "./board";


function startGame(width: number, height: number) {
    let board: Board = new Board(height, width);
    showBoard(board);
}