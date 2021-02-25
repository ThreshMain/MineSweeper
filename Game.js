class Game {
    constructor(seed, sizeX, sizeY) {
        this.seed = seed;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.restartGame();
    }

    restartGame() {
        this.board = [];
        this.numberOfMines = 0;
        for (let x = 0; x < this.sizeX; x++) {
            let line = [];
            for (let y = 0; y < this.sizeY; y++) {
                if (Math.floor(Math.random() * this.seed) === 1) {
                    line.push(new Cell(x, y, Cell.values.mine));
                    this.board.numberOfMines++;
                } else {
                    line.push(new Cell(x, y, Cell.values.empty));
                }
            }
            this.board.push(line);
        }
        this.status = Game.gameStatus.inGame;
    }

    processCell(x, y) {
        if (this.status !== Game.gameStatus.inGame) {
            return this.status;
        }
        let cell = this.board[x][y];
        if (cell.drawValue !== Cell.drawValues.flag) {
            if (cell.value === Cell.values.mine) {
                cell.drawValue = Cell.drawValues.explode;
                this.status = Game.gameStatus.lost;
            } else {
                cell.drawValue = Cell.drawValues.empty;
                let beenTo = [];
                for (let x = 0; x < this.sizeX; x++) {
                    let zeroLine = [];
                    for (let y = 0; y < this.sizeY; y++) {
                        zeroLine.push(0);
                    }
                    beenTo.push(zeroLine);
                }
                let exploreEmpty = (x, y, beenTo) => {
                    let cells = this.getCellsNextTo(x, y);
                    cells.push(this.board[x][y]);
                    for (let cell of cells) {
                        if (beenTo[cell.x][cell.y] === 0) {
                            beenTo[cell.x][cell.y] = 1;
                            if (this.board[cell.x][cell.y].value === Cell.values.empty) {
                                if (this.board[cell.x][cell.y].drawValue !== Cell.drawValues.flag) {
                                    this.board[cell.x][cell.y].drawValue = Cell.drawValues.empty;
                                }
                                if (this.getMinesNextTo(cell.x, cell.y) === 0) {
                                    exploreEmpty(cell.x, cell.y, beenTo);
                                }
                            }
                        }
                    }
                }
                if(this.getMinesNextTo(cell.x, cell.y) === 0){
                    exploreEmpty(x, y, beenTo);
                }else{
                    cell.drawValue=Cell.drawValues.empty;
                }
            }
        }
        return this.status;
    }


    flagCell(x, y) {
        if (this.status !== Game.gameStatus.inGame) {
            return this.status;
        }
        let cell = this.board[x][y];
        if (cell.drawValue === Cell.drawValues.flag) {
            cell.drawValue = Cell.drawValues.unknown;
        } else if (cell.drawValue === Cell.drawValues.unknown) {
            cell.drawValue = Cell.drawValues.flag;
        }
        return this.status;
    }

    getCellsNextTo(x, y) {
        let cells = [];
        if (x < this.sizeX - 1) {
            if (y < this.sizeY - 1) {
                cells.push(this.board[x + 1][y + 1]);
            }
            cells.push(this.board[x + 1][y]);
            if (y > 0) {
                cells.push(this.board[x + 1][y - 1]);
            }
        }
        if (y > 0) {
            cells.push(this.board[x][y - 1]);
        }
        if (y < this.sizeY - 1) {
            cells.push(this.board[x][y + 1]);
        }
        if (x > 0) {
            if (y < this.sizeY - 1) {
                cells.push(this.board[x - 1][y + 1]);
            }
            cells.push(this.board[x - 1][y]);
            if (y > 0) {
                cells.push(this.board[x - 1][y - 1]);
            }
        }
        return cells;
    }


    getMinesNextTo(x, y) {
        return this.getCellsNextTo(x, y).filter(cell => cell.value === Cell.values.mine).length;
    }

    static gameStatus = {"lost": -1, "inGame": 0, "win": 1}
}