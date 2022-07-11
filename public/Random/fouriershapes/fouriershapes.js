let radii = [], periods = [];
let n = 0;
let t = 0;

let pos = [0, 0], prev = [0, 0]

let ellipsePos = []

function setup() {
    createCanvas(800, 800);
    n = random(1, 100);

    for(let i = 0; i < n; i++) {
        radii.push(random(4, 10));
        periods.push(random(1, 10));
    }
    noStroke();
    colorMode(HSB, 100);
}

function draw() {
    t += 0.01;

    pos = [0, 0]

    let spd = sq(abs(pos[0] - prev[0])) + sq(abs(pos[1] - prev[1]))

    fill(constrain(spd/1000, 0, 100),100,100)

    for(let i = 0; i < radii.length; i++) {
        pos[0] += radii[i] * sin(periods[i]*t);
        pos[1] += radii[i] * cos(periods[i]*t);
    }
    prev = [...pos];

    if(frameCount % 100 == 0 && ellipsePos.length != 0) {
        console.log(ellipsePos)
        for(let i = ellipsePos.length - 9; i < ellipsePos.length; i++) {
            console.log(i);
            ellipse((ellipsePos[i][0] + width/2) % width, (ellipsePos[i][1] + height/2) % height, 4);
        }
    }

    ellipsePos.push([pos[0], pos[1]]);

}
