import { Player } from "./player";
import { Choice } from "./choice";

export class Board {

  private maxHeight: number;
  private maxWidht: number;
  private o_tiles = new Array<Coordinate>();
  private x_tiles = new Array<Coordinate>();


  public constructor(maxHeight: number, maxWidht: number) {
    this.maxHeight = maxHeight;
    this.maxWidht = maxWidht;
  }



  // public addOTile(c: Coordinate): void{
  //   if (this.o_tiles.includes(c)) {
  //     throw new Error("This tile is already in the list of O-tiles");
  //   }
  //   else {
  //       this.o_tiles.push(c);
  //   }
  // }

  // public addXTile(c: Coordinate): void{
  //   if (this.x_tiles.includes(c)) {
  //     throw new Error("This tile is already in the list of X-tiles");
  //   }
  //   else {
  //       this.x_tiles.push(c);
  //   }
  // }





  public onClick(coordinate: Coordinate, choice: Choice): Boolean {
    if (this.o_tiles.includes(coordinate) || this.x_tiles.includes(coordinate) || !this.outOfBounds(coordinate)) {
      return false;
    }
    else if (choice == Choice.O) {
      this.o_tiles.push(coordinate);
    }
    else {
      this.x_tiles.push(coordinate);
    }
    return true;
  }

  private myCopy(xs: Array<Coordinate>): Array<Coordinate>  {
    let newList = new Array<Coordinate>();
    for (let tile of xs.reverse()) {
        newList.push(tile);
    }
    return newList;
  }

  private outOfBounds(c: Coordinate): Boolean {
    return (c.getX() < 0 || c.getX() >= this.maxWidht || c.getY() < 0 || c.getY() >= this.maxHeight);
  }

  private routeDown(testTiles: Array<Coordinate>, otherTiles: Array<Coordinate>): Boolean|undefined {
    if (testTiles.length === 0) {
        return false;
    }
    let head: Coordinate = testTiles.at(0)!;
    if (head.getY() === this.maxHeight - 1) {
        return true;
    }
    else if (!otherTiles.includes(head) || this.outOfBounds(head)) {
        return false;
    }
    let newCL: Coordinate = new Coordinate(head.getX()-1,head.getY());
    let newTilesL = this.myCopy(testTiles);
    newTilesL.push(newCL);
    let newCR: Coordinate = new Coordinate(head.getX()+1,head.getY());
    let newTilesR = this.myCopy(testTiles);
    newTilesR.push(newCR);
    let newCD: Coordinate = new Coordinate(head.getX(),head.getY()+1);
    let newTilesD = this.myCopy(testTiles);
    newTilesD.push(newCD);
    if ( this.routeDown(newTilesL, otherTiles) ||  this.routeDown(newTilesR, otherTiles) || this.routeDown(newTilesD, otherTiles)) {
      return true;
    }
    let newTiles: Array<Coordinate> = testTiles.slice(1);
    this.routeDown(newTiles, otherTiles);
  }


  private routeRight(testTiles: Array<Coordinate>, otherTiles: Array<Coordinate>): Boolean|undefined {
    if (testTiles.length == 0) {
        return false;
    }
    let head: Coordinate = testTiles.at(0)!;
    if (head.getX() === this.maxWidht - 1) {
        return true;
    }
    else if (!otherTiles.includes(head) || this.outOfBounds(head)) {
        return false;
    }
    let newCU: Coordinate = new Coordinate(head.getX(),head.getY()-1);
    let newTilesU = this.myCopy(testTiles);
    newTilesU.push(newCU);
    let newCR: Coordinate = new Coordinate(head.getX()+1,head.getY());
    let newTilesR = this.myCopy(testTiles);
    newTilesR.push(newCR);
    let newCD: Coordinate = new Coordinate(head.getX(),head.getY()+1);
    let newTilesD = this.myCopy(testTiles);
    newTilesD.push(newCD);
    if ( this.routeDown(newTilesU, otherTiles) ||  this.routeDown(newTilesR, otherTiles) || this.routeDown(newTilesD, otherTiles)) {
      return true;
    }
    let newTiles: Array<Coordinate> = testTiles.slice(1);
    this.routeDown(newTiles, otherTiles);
  }
  
  public win(player: Player): Boolean {
    if (player.getChoice() == Choice.O) {
      let toptiles: Coordinate[] = [];
      for (let tile of this.o_tiles) {
        if (tile.getY() == 0) {
            toptiles.push(tile);
        }
      }
      let route = this.routeDown(toptiles, this.x_tiles);
      if (route === undefined || !route) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      let leftTiles: Coordinate[] = [];
      for (let tile of this.x_tiles) {
        if (tile.getX() == 0) {
          leftTiles.push(tile);
        }
      }
      let route = this.routeRight(leftTiles, this.x_tiles);
      if (route === undefined || !route) {
        return false;
      }
      else {
        return true;
      }
    }
  }
  
  private myHas(test: Coordinate, c: Choice): Boolean {
    if (c === Choice.O) {
      for (let tile of this.o_tiles) {
        if (tile.equals(test)) {
          return true;
        }
      }
      return false; 
    }
    else {
      for (let tile of this.x_tiles) {
        if (tile.equals(test)) {
          return true;
        }
      }
      return false; 
    }
  }

  public boardRepresentation(): String[][] {
    let matrix: String[][] = [[]];
    for (let i = 0; i < this.maxHeight; i++) {
      for (let j = 0; j < this.maxWidht; j++) {
        let test: Coordinate = new Coordinate(j,i);
        if (this.myHas(test, Choice.O)) {
          matrix.at(i)?.push("O");
        }
        else if (this.myHas(test, Choice.X)) {
          matrix.at(i)?.push("X");
        }
        else {
          matrix.at(i)?.push(".");
        }
      }
    } 
    return matrix;
  }

  public fullBoard(): Boolean {
    for (let i = 0; i < this.maxHeight; i++) {
      for (let j = 0; j < this.maxWidht; j++) { 
        let test: Coordinate = new Coordinate(j,i);
        if (!(this.myHas(test, Choice.O)) || !(this.myHas(test, Choice.X))) {
          return false;
        }
      }
    }
    return true;
  }
}
