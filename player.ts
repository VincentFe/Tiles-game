import {Choice} from "./choice";
import {Board} from "./board";

export class Player {

    private name: String;
    private choice: Choice;
    private board: Board;

    constructor(name: String, choice: Choice, board: Board) {
        this.name = name;
        this.choice = choice;
        this.board = board;
    }

    public getChoice(): Choice {
        return this.choice;
    }

    public onClick(c: Coordinate): Boolean {
        return this.board.onClick(c, this.choice);
    }
}
