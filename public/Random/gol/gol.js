p5.disableFriendlyErrors = true; // disables FES

const CELL_SIZE = 8;
const COLUMNS = Math.floor(window.innerWidth / CELL_SIZE);
const ROWS = Math.floor(window.innerHeight / CELL_SIZE);

let running = true,
    drawing = false;
let cells = [],
    oldcells = [],
    history = [];

let mode = 1;
// 1: normal
// 2: heat persistent

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    background(0);
    noStroke();

    for (let i = 0; i < ROWS; i++) {
        let t = [];
        let th = [];
        for (let j = 0; j < COLUMNS; j++) {
            if (random(0, 1) > 0.5) t.push(false);
            else t.push(true);

            if (t[t.length - 1]) th.push([1, 0, 0]);
            else th.push([0, 0, 0]);
        }
        cells.push(t);
        history.push(th);
    }
    oldcells = cells;
}

function draw() {
    translate(-width / 2, -height / 2, 0);
    if (drawing) {
        //cells[Math.floor(mouseY / CELL_SIZE)][Math.floor(mouseX / CELL_SIZE)] = !cells[Math.floor(mouseY / CELL_SIZE)][Math.floor(mouseX / CELL_SIZE)]
        let my = Math.floor(mouseY / CELL_SIZE);
        let mx = Math.floor(mouseX / CELL_SIZE)
        if (in_bound(my, mx))
            cells[my][mx] = true;
    }
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (mode == 1) {
                if (cells[i][j]) fill(100);
                else fill(255);
            } else if (mode == 2) {
                fill(history[i][j]);
            }

            if (oldcells[i][j] != cells[i][j] || frameCount <= 1)
                rect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
    if (running) step();
}

function step() {
    const dx = [-1, -1, 0, 1, 1, 1, 0, -1];
    const dy = [0, -1, -1, -1, 0, 1, 1, 1];

    var newcells = cells.map(function(cells) {
        return cells.slice();
    });

    oldcells = cells.map(function(cells) {
        return cells.slice();
    });

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            let c = 0;
            for (let k = 0; k < 8; k++) {
                let nr = i + dx[k];
                let nc = j + dy[k];
                if (in_bound(nr, nc) && cells[nr][nc]) c++;
            }

            if (!cells[i][j] && c == 3) {
                newcells[i][j] = true;
                history[i][j][1] += 1;
            }

            if (cells[i][j]) {
                if (c < 2 || c > 3) {
                    newcells[i][j] = false;
                    history[i][j][2] += 1.3;
                }
            }
        }
    }


    cells = newcells;
}

function in_bound(r, c) {
    if (r < 0 || r >= cells.length) return false;
    if (c < 0 || c >= cells[0].length) return false;
    return true;
}

function keyPressed(e) {
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[0].length; j++) {
            oldcells[i][j] = !cells[i][j];
        }
    }
    if (e.key == " ") running = !running;
    else if (e.key == "1") mode = 1;
    else if (e.key == "2") mode = 2;
}

function mousePressed(f) {
    drawing = true;
}

function mouseReleased(f) {
    drawing = false;
}