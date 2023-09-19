import {Choice} from "./choice";
import {Board} from "./board";

export class Player {

    private name: String;
    private choice: Choice;
    private startTime: number;

    constructor(name: String, choice: Choice) {
        this.name = name;
        this.choice = choice;
        this.startTime = Date.now();
    }

    public getChoice(): Choice {
        return this.choice;
    }

    public getName(): String {
        return this.name;
    }

    public getStartTime(): number {
        return this.startTime;
    }
}
