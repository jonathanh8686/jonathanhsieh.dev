let x = 0.01, y = 0.02, z = 0;
let dx, dy, dz;
let dt = 0.02;

let sigma = 10, rho = 28, beta = 8/3;
let t = 0;

let pts = []

function setup() {
    createCanvas(800, 800, WEBGL);

}

function draw() {
    background(150);
    scale(5);

    translate(0, 0, -300);
    rotateX(millis()/5000);
    //let camX = t;
    //let camY = t;
    //camera(0, 0, height / 2.0 / tan((PI * 30.0) / 180.0), 0, 0, 0, 0, 1, 0);
    //translate(width/2, height/2);
    scale(5);
    stroke(255);
    strokeWeight(10);
    noFill();

    dx = sigma*(y-x) * dt;
    x += dx;
    dy =  (x*(rho-z) - y) * dt;
    y += dy;
    dz = (x*y - beta*z) * dt;
    z += dz;
    pts.push([x,y,z]);

    noFill();
    stroke(100);
    for(let i = 1; i < pts.length; i++) {
        line(pts[i-1][0], pts[i-1][1], pts[i-1][2], pts[i][0], pts[i][1], pts[i][2]);
    }

    t += 5;
}
