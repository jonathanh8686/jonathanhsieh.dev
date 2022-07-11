let points = [];
let triangles = [];

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    // TODO: the points stay near initalized locations so if you start small and make the window bigger
    // the points tend to cluster around where they used to be

}

function setup() {
    let canvas = createCanvas(innerWidth, innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    for(let i = 0; i < 100; i++) {
        points.push(new Point(random(0, width), random(0, height), random(-0.5, 0.5), random(-0.5, 0.5)));
    }

    mouseX = width/2;
    mouseY = height/2;
}

function draw() {
    background(0);
    for (let i = 0; i < points.length; i++) {
        points[i].move();
    }

    points.push(new Point(0, 0, 0, 0));
    points.push(new Point(width, 0, 0, 0));
    points.push(new Point(0, height, 0, 0));
    points.push(new Point(width, height, 0, 0));

    let vert_pos = [];
    for(let i = 0; i < points.length; i++) {
        vert_pos.push([points[i].x, points[i].y]);
    }


    triangles = Delaunay.triangulate(vert_pos);

    for (let i = 0; i < triangles.length; i += 3) {
        beginShape();
        //fill(0, 0, i, map(2*dist(mouseX, mouseY, points[triangles[i]].x, points[triangles[i]].y), 0, 
        
        fill(0, 0, 255-map(5*dist(mouseX, mouseY, points[triangles[i]].x, points[triangles[i]].y), 0, 
        dist(0, 0, windowWidth, windowHeight), 0, 255), map(2*dist(mouseX, mouseY, points[triangles[i]].x, points[triangles[i]].y), 0, 
        dist(0, 0, windowWidth, windowHeight), 200, 10));
        strokeWeight(1);
        stroke(0, 0, 0, map(2*dist(mouseX, mouseY, points[triangles[i]].x, points[triangles[i]].y), 0, 
                            dist(0, 0, windowWidth, windowHeight), 100, 10));
        vertex(points[triangles[i]].x, points[triangles[i]].y);
        vertex(points[triangles[i + 1]].x, points[triangles[i + 1]].y);
        vertex(points[triangles[i + 2]].x, points[triangles[i + 2]].y);
        endShape(CLOSE);
    }

    points.pop();
    points.pop();
    points.pop();
    points.pop();

}

function dist(x1, x2, y1, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

class Point {
    constructor(x, y, xvel, yvel) {
        this.x = x;
        this.y = y;
        this.xvel = xvel;
        this.yvel = yvel;
    }

    move = function() {
        this.x += this.xvel;
        this.y += this.yvel;


        if(this.x < 0 || this.x > width) this.xvel *= -1;
        if(this.y < 0 || this.y > height) this.yvel *= -1;

    }
}

