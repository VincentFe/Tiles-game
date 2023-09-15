
class Coordinate {

    private x_value: number;
    private y_value: number;

    constructor(x_value: number, y_value: number) {
        this.x_value = x_value;
        this.y_value = y_value;
    }
    
    public getCoordinate(){
        return (this.x_value,this.y_value);
    }

    public getX(): number {
        return this.x_value;
    }

    public getY(): number {
        return this.y_value;
    }
}