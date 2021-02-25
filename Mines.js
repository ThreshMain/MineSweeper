"use strict";
let helpX = 0;
let helpY = 0;
let canvas;

let images = {};
let font;

let lostSound;
let winSound;

let game;


function preload() {
    font = loadFont("font\\SFTransRobotics.ttf");
    images[Cell.drawValues.explode] = loadImage("images\\ExplodedBomb.png")
    images[Cell.drawValues.unknown] = loadImage("images\\UnOpened.png")
    images[Cell.drawValues.flag] = loadImage("images\\Flag.png")
    images[Cell.drawValues.mine] = loadImage("images\\Mine.png")
    lostSound = new Audio("Sound\\Grenade.mp3");
    winSound = new Audio("Sound\\Win.mp3");
}

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight * 0.9);
    startWithMoreArg(8, parseInt(width / 30), parseInt(height / 30));
    frameRate(5);
    textSize(helpX * 0.8);
    textFont(font);
    textAlign(RIGHT, CENTER);
}

function start(seed, size) {
    startWithMoreArg(seed, size, size)
}

function startWithMoreArg(seed, sizeX, sizeY) {
    game = new Game(seed, sizeX, sizeY);
    helpX = width / sizeX;
    helpY = height / sizeY;
}

function win() {
    let foundMinesCount = 0;
    game.board.forEach((line) => {
        line.forEach((cell) => {
            if (cell.drawValue === Cell.drawValues.flag && cell.value === Cell.values.mine) {
                foundMinesCount++;
            }
        })
    });
    if (foundMinesCount === game.board.numberOfMines) {
        winSound.play();
        winSound = new Audio("Sound\\Win.mp3");
        return true;
    }
    return false;
}

function lose() {
    lostSound.play();
    lostSound = new Audio("Sound\\Grenade.mp3");
}

document.addEventListener("click", function (evt) {
    let clickX = evt.pageX - canvas.canvas.offsetLeft;
    let clickY = evt.pageY - canvas.canvas.offsetTop;
    if (
        clickX > 0 &&
        clickY > 0 &&
        clickX < canvas.width &&
        clickY < canvas.height
    ) {
        if (game.status !== Game.gameStatus.inGame) {
            game.restartGame();
        } else {
            clickX = Math.floor(clickX / helpX);
            clickY = Math.floor(clickY / helpY);
            game.processCell(clickX, clickY);
        }
    }
});

document.addEventListener(
    "contextmenu",
    function (ev) {
        let clickX = ev.pageX - canvas.canvas.offsetLeft;
        let clickY = ev.pageY - canvas.canvas.offsetTop;
        if (
            clickX > 0 &&
            clickY > 0 &&
            clickX < canvas.width &&
            clickY < canvas.height
        ) {
            ev.preventDefault();

            if (game.status !== Game.gameStatus.inGame) {
                game.restartGame();
            } else {
                clickX = Math.floor(clickX / helpX);
                clickY = Math.floor(clickY / helpY);
                game.flagCell(clickX, clickY);
            }
        }
    },
    false
);

function draw() {
    background(220);
    fill(0, 255, 0);
    for (let x = 0; x < game.board.length; x++) {
        for (let y = 0; y < game.board[x].length; y++) {
            let cell = game.board[x][y];
            switch (cell.drawValue) {
                case Cell.drawValues.flag:
                    image(images[cell.drawValue], x * helpX, y * helpY, helpX, helpY);
                    break;
                case Cell.drawValues.unknown:
                    image(images[cell.drawValue], x * helpX, y * helpY, helpX, helpY);
                    break;
                case Cell.drawValues.explode:
                    image(images[cell.drawValue], x * helpX, y * helpY, helpX, helpY);
                    break;
                case Cell.drawValues.mine:
                    image(images[cell.mine], x * helpX, y * helpY, helpX, helpY);
                    break;
                case Cell.drawValues.empty:
                    fill(150);
                    stroke(100);
                    rect(x * helpX, y * helpY, (x + 1) * helpX, (y + 1) * helpY);
                    break;
            }
            if (cell.drawValue === Cell.drawValues.empty) {
                let amount = game.getMinesNextTo(x, y);
                drawAmount(amount, x * helpX, y * helpY, helpX, helpY);
            }
        }
    }
}

function drawAmount(amount, a, b, c, d) {
    noStroke();
    switch (amount) {
        case 0:
            return;
        case 1:
            fill(11, 3, 239);
            break;
        case 2:
            fill(27, 111, 27);
            break;
        case 3:
            fill(229, 65, 45);
            break;
        case 4:
            fill(3, 0, 120);
            break;
        case 5:
            fill(123, 31, 19);
            break;
        case 6:
            fill(50, 51, 89);
            break;
        case 7:
            fill(120, 120, 120);
            break;
        case 8:
            fill(60, 60, 60);
            break;
    }
    text(amount, a + helpX * 0.1, b, c, d);
}

