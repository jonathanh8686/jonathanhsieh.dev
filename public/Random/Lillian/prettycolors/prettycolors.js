var t;

function setup() {
    createCanvas(800, 800);
    background(180);
    t = 0;

}

function draw() {
    t += 0.005;
    background(noise(t + 11007) * 255, noise(t + 928182) * 255, noise(t) * 255);
}