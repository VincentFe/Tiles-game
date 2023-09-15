
class Player {

    private name: String;
    private choice: Choice;

    constructor(name: String, choice: Choice) {
        this.name = name;
    }

    public getChoice(): Choice {
        return this.choice;
    }
}
