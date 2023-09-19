import { Board } from "./board";
import { Choice } from "./choice";
import { Player } from "./player";

class Controller {

private board: Board;    

startGame(width: number, height: number, nameO: String, nameX: String) {
    this.board = new Board(height, width, nameO, nameX);
    let table:HTMLTableElement = document.querySelector("table")!;
    let toShow: HTMLTableElement = this.generateTable(table, this.board);
}

generateTable(table: HTMLTableElement, board: Board): HTMLTableElement {
    let matrix: String [][] = board.boardRepresentation();
    for (let rowIt of matrix) {
        let row = table.insertRow();
        for (let colIt of rowIt) {
            let cell = row.insertCell();
            let text = document.createTextNode(colIt as string);
            cell.appendChild(text);
        }
    }
    return table;
  }
  
  getPlayerInfo(c: Choice): String {
    let player: Player = this.board.getPlayerInfo(c);
    let str: String = player.getName().concat("\n",(Date.now() - player.getStartTime()).toString());
    return str;
  }

}