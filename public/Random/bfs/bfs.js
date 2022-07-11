var running = true;


var board = [];
var bfs = [];
var dy = dx = [];
var sz = 20;

function setup() {
    createCanvas(800, 800);
    background(180);

    dy = [sz, 0, -sz, 0];
    dx = [0, sz, 0, -sz];

    for (var i = 0; i < 800; i++) {
        board.push([]);
        for (var j = 0; j < 800; j++) {
            board[i].push(0); // fill array with visited
        }
    }

    bfs.push([400, 700]); // start from the upper left corner
    console.log(bfs);
}

function draw() {

    for (var i = 0; i < 100; i++) {

        if (mouseIsPressed) {
            if (inBound(mouseX, mouseY)) {
                board[Math.floor(mouseX / sz) * sz][Math.floor(mouseY / sz) * sz] = 1;
                fill(255, 0, 0);
                rect(Math.floor(mouseX / sz) * sz, Math.floor(mouseY / sz) * sz, sz, sz);
            }
        }

        if (running) {
            var c = bfs.shift();
            if (c == undefined) break;

            if (board[c[0]][c[1]] == 1) {
                fill(0, 0, random(150, 255));
                rect(c[0], c[1], sz, sz);
                return;
            }

            for (var i = 0; i < 4; i++) {
                if (inBound(c[0] + dx[i], c[1] + dy[i])) {
                    if (board[c[0] + dx[i]][c[1] + dy[i]] == 0) {
                        bfs.push([c[0] + dx[i], c[1] + dy[i]]);
                        board[c[0]][c[1]] = 1; // set visited
                        fill(0, 0, random(150, 255));
                        rect(c[0], c[1], sz, sz);
                    }
                }
            }
        }
    }

}

function inBound(x, y) {
    if (x < 0 || x >= 800) return false;
    if (y < 0 || y >= 800) return false;
    return true;
}

function keyPressed() {
    if (key == ' ')
        running = !running; // toggle bfs on spacebar

}