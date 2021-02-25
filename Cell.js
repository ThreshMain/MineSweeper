class Cell {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.drawValue = 0;
    }

    static values = {"empty": 0, "mine": 1};
    static drawValues = {"unknown": 0, "explode": 1, "flag": 2, "empty": 3, "mine": 4};
}