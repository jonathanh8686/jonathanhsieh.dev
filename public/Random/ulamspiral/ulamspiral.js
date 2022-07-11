let cx = 0;
let cy = 0;

let sz = 1;
let rs = 1;
let doubled = false;
let dir = 0;

function setup() {
    createCanvas(800, 800);

    cx = width / 2;
    cy = height / 2;
    background(255);
}

function draw() {
    if (isPrime(frameCount))
        set(cx, cy, color(0));

    if (dir == 0) {
        cx += 1;
    } else if (dir == 1) {
        cy += 1;
    } else if (dir == 2) {
        cx -= 1;
    } else if (dir == 3) {
        cy -= 1;
    }

    sz -= 1;

    if (sz == 0) {
        if (!doubled) {
            sz = rs;
            doubled = true;
            dir += 1;
            dir %= 4;
        } else {
            doubled = false;
            rs += 1;
            sz = rs;
            dir += 1;
            dir %= 4;
        }
    }

    updatePixels();
}

function isPrime(x) {
    if (x < 1) return false;
    if (x == 2) return true;
    for (let i = 3; i <= Math.sqrt(x) + 1; i++) {
        if (x % i == 0) return false;
    }
    return true;
}
