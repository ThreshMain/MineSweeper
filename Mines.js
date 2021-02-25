"use strict";
let mine = [];
let drawArr = [];
let saveDrawArr = [];
let help = 0;
let helpX = 0;
let helpY = 0;
let canvas;
let seedSeeds;
let sizeX;
let sizeY;
let minesCount;
let reset = false;
let images = [];
let audio;
let winSound;
let font;

function SaveValue(x, y, value) {
    this.xCoord = x;
    this.yCoord = y;
    this.value = value;
}

function preload() {
    font = loadFont("font\\SFTransRobotics.ttf");
    images[0] = loadImage("images\\UnOpened.png");
    images[1] = loadImage("images\\Mine.jpg");
    images[2] = loadImage("images\\MineFound.jpg");
    images[3] = loadImage("images\\ExplodedBomb.png");
    audio = new Audio("Sound\\Grenade.mp3");
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
    saveDrawArr = [];
    minesCount = 0;
    seedSeeds = seed;
    let done = false;
    mine = [];
    drawArr = [];
    for (let x = 0; x < sizeX; x++) {
        let line = [];
        let zeroLine = [];
        for (let y = 0; y < sizeY; y++) {
            zeroLine.push(-1);
            if (Math.floor(Math.random() * seed) === 1) {
                line.push(1);
                minesCount++;
            } else {
                line.push(0);
            }
        }
        done = true;
        mine.push(line);
        drawArr.push(zeroLine);
    }
    help = width / sizeX;
    helpX = width / sizeX;
    helpY = height / sizeY;
}

function win() {
    let saveMineCount = 0;
    let bool = true;
    saveDrawArr.forEach((p) => {
        if (p !== undefined) {
            if (mine[p.xCoord][p.yCoord] === 1) {
                saveMineCount++;
            } else {
                bool = false;
            }
        }
    });
    if (saveMineCount === minesCount && bool) {
        winSound.play();
        winSound = new Audio("Sound\\Win.mp3");
        return true;
    }
    return false;
}

function lose() {
    audio.play();
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            if (drawArr[x][y] === -3 && mine[x][y] === 1) {
                mine[x][y] = -3;
            }
        }
    }
    audio = new Audio("Sound\\Grenade.mp3");
    drawArr = mine;
}

function mineFound(x, y) {
    if (drawArr[x][y] === -3) {
        saveDrawArr = saveDrawArr.filter((o) => forEachFromSaveDrawArr(o, x, y));
    } else {
        saveDrawArr.push(new SaveValue(x, y, drawArr[x][y]));
        drawArr[x][y] = -3;
    }
}

function forEachFromSaveDrawArr(o, x, y) {
    if (o !== undefined) {
        if (o.yCoord === y && o.xCoord === x) {
            drawArr[x][y] = o.value;
            return undefined;
        } else {
            return o;
        }
    }
    return undefined;
}

function drawGrey(o, p) {
    beenTo = [];
    for (let x = 0; x < sizeX; x++) {
        let zeroLine = [];
        for (let y = 0; y < sizeY; y++) {
            zeroLine.push(0);
        }
        beenTo.push(zeroLine);
    }
    drawGreyAgain(o, p);
}

let beenTo;

function drawGreyAgain(x, y) {
    if (drawArr[x][y] !== -2) {
        drawArr[x][y] = mine[x][y];
    }
    beenTo[x][y] = 1;
    if (x < sizeX - 1) {
        if (beenTo[x + 1][y] === 0) {
            if (
                mine[x + 1][y] === 0 &&
                (getMinesNextTo(x, y) < 1 || drawArr[x + 1][y] !== -1)
            ) {
                drawGreyAgain(x + 1, y);
            } else {
                drawArr[x][y] = -2;
            }
        }
        if (y > 0) {
            if (beenTo[x + 1][y - 1] === 0) {
                if (
                    mine[x + 1][y - 1] === 0 &&
                    (getMinesNextTo(x, y) < 1 || drawArr[x + 1][y - 1] !== -1)
                ) {
                    drawGreyAgain(x + 1, y - 1);
                } else {
                    drawArr[x][y] = -2;
                }
            }
        }
        if (y < sizeY) {
            if (beenTo[x + 1][y + 1] === 0) {
                if (
                    mine[x + 1][y + 1] === 0 &&
                    (getMinesNextTo(x, y) < 1 || drawArr[x + 1][y + 1] !== -1)
                ) {
                    drawGreyAgain(x + 1, y + 1);
                } else {
                    drawArr[x][y] = -2;
                }
            }
        }
    }

    if (x > 0) {
        if (beenTo[x - 1][y] === 0) {
            if (
                mine[x - 1][y] === 0 &&
                (getMinesNextTo(x, y) < 1 || drawArr[x - 1][y] !== -1)
            ) {
                drawGreyAgain(x - 1, y);
            } else {
                drawArr[x][y] = -2;
            }
        }
        if (y > 0) {
            if (beenTo[x - 1][y - 1] === 0) {
                if (
                    mine[x - 1][y - 1] === 0 &&
                    (getMinesNextTo(x, y) < 1 || drawArr[x - 1][y - 1] !== -1)
                ) {
                    drawGreyAgain(x - 1, y - 1);
                } else {
                    drawArr[x][y] = -2;
                }
            }
        }
        if (y < sizeY) {
            if (beenTo[x - 1][y + 1] === 0) {
                if (
                    mine[x - 1][y + 1] === 0 &&
                    (getMinesNextTo(x, y) < 1 || drawArr[x - 1][y + 1] !== -1)
                ) {
                    drawGreyAgain(x - 1, y + 1);
                } else {
                    drawArr[x][y] = -2;
                }
            }
        }
    }
    if (y < sizeY) {
        if (beenTo[x][y + 1] === 0) {
            if (
                mine[x][y + 1] === 0 &&
                (getMinesNextTo(x, y) < 1 || drawArr[x][y + 1] !== -1)
            ) {
                drawGreyAgain(x, y + 1);
            } else {
                drawArr[x][y] = -2;
            }
        }
    }
    if (y > 0) {
        if (beenTo[x][y - 1] === 0) {
            if (
                mine[x][y - 1] === 0 &&
                (getMinesNextTo(x, y) < 1 || drawArr[x][y - 1] !== -1)
            ) {
                drawGreyAgain(x, y - 1);
            } else {
                drawArr[x][y] = -2;
            }
        }
    }
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
        if (reset) {
            startWithMoreArg(seedSeeds, sizeX, sizeY);
            reset = false;
        } else {
            clickX = Math.floor(clickX / helpX);
            clickY = Math.floor(clickY / helpY);
            if (drawArr[clickX][clickY] !== -3) {
                if (mine[clickX][clickY] === 1) {
                    mine[clickX][clickY] = 2;
                    lose();
                    console.log("prohra");
                    reset = true;
                } else {
                    drawGrey(clickX, clickY);
                }
            }
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
            clickX = Math.floor(clickX / helpX);
            clickY = Math.floor(clickY / helpY);
            if (reset) {
                startWithMoreArg(seedSeeds, sizeX, sizeY);
                reset = false;
            } else {
                if (drawArr[clickX][clickY] === -1 || drawArr[clickX][clickY] === -3) {
                    mineFound(clickX, clickY);
                    if (win()) {
                        reset = true;
                        drawArr = mine;
                        console.log("WIN");
                    }
                }
            }
        }
    },
    false
);

function draw() {
    if (!reset) {
        saveDrawArr.forEach((ele) => {
            drawArr[ele.xCoord][ele.yCoord] = -3;
        });
    }
    background(220);
    fill(0, 255, 0);
    stroke(100);
    let x;
    let y;
    for (x = 0; x < mine.length; x++) {
        for (y = 0; y < mine[x].length; y++) {
            switch (drawArr[x][y]) {
                case -3:
                    image(images[2], x * helpX, y * helpY, helpX, helpY);
                    break;
                case -2:
                    fill(150);
                    rect(x * helpX, y * helpY, (x + 1) * helpX, (y + 1) * helpY);
                    break;
                case -1:
                    image(images[0], x * helpX, y * helpY, helpX, helpY);
                    break;
                case 0:
                    fill(150);
                    rect(x * helpX, y * helpY, (x + 1) * helpX, (y + 1) * helpY);
                    break;
                case 1:
                    image(images[1], x * helpX + 1, y * helpY + 1, helpX - 2, helpY - 2);
                    break;
                case 2:
                    image(images[3], x * helpX + 1, y * helpY + 1, helpX - 2, helpY - 2);
                    break;
            }
        }
    }
    stroke(255, 0, 0);
    fill(0);
    for (x = 0; x < mine.length; x++) {
        for (y = 0; y < mine[0].length; y++) {
            if (drawArr[x][y] === -2) {
                let amount = getMinesNextTo(x, y);
                drawCount(amount, x * helpX, y * helpY, helpX, helpY);
                if (x < sizeX - 1) {
                    if (drawArr[x + 1][y] === 0) {
                        x += 1;
                        amount = getMinesNextTo(x, y);
                        drawCount(amount, x * helpX, y * helpY, helpX, helpY);
                        x -= 1;
                    }
                }
                if (x > 0) {
                    if (drawArr[x - 1][y] === 0) {
                        x -= 1;
                        amount = getMinesNextTo(x, y);
                        drawCount(amount, x * helpX, y * helpY, helpX, helpY);
                        x += 1;
                    }
                }
                if (y < sizeY - 1) {
                    if (drawArr[x][y + 1] === 0) {
                        y += 1;
                        amount = getMinesNextTo(x, y);
                        drawCount(amount, x * helpX, y * helpY, helpX, helpY);
                        y -= 1;
                    }
                }
                if (y > 0) {
                    if (drawArr[x][y - 1] === 0) {
                        y -= 1;
                        amount = getMinesNextTo(x, y);
                        drawCount(amount, x * helpX, y * helpY, helpX, helpY);
                        y += 1;
                    }
                }
            }
        }
    }
}

function drawCount(count, a, b, c, d) {
    noStroke();
    switch (count) {
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
    text(count, a + helpX * 0.1, b, c, d);
    text(count, a + helpX * 0.1, b, c, d);
}

function getMinesNextTo(x, y) {
    let amount = 0;
    if (x < sizeX - 1) {
        if (y < sizeY - 1) {
            if (mine[x + 1][y + 1] === 1) amount++;
        }
        if (mine[x + 1][y] === 1) amount++;
        if (y > 0) {
            if (mine[x + 1][y - 1] === 1) amount++;
        }
    }
    if (y > 0) {
        if (mine[x][y - 1] === 1) amount++;
    }
    if (y < sizeY - 1) {
        if (mine[x][y + 1] === 1) amount++;
    }
    if (x > 0) {
        if (y < sizeY - 1) {
            if (mine[x - 1][y + 1] === 1) amount++;
        }
        if (mine[x - 1][y] === 1) amount++;
        if (y > 0) {
            if (mine[x - 1][y - 1] === 1) amount++;
        }
    }
    return amount;
}
