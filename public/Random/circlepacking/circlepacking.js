let circles = [];
let img;

function preload() {
    img = loadImage("grace.jpg");
}

function setup() {
    createCanvas(800, 800);
    background(180);
    img.resize(width, height)
}

function draw() {
    for(let i = 0; i < 10; i++) {
        circles.push(genCircle());
    }

    for (c of circles) {
        if(c.active == false) continue;
        for(c2 of circles) {
            if(c === c2) continue;
            if(c.intersect(c2)) {
                c.active = false;
                break;
            }
        }
        c.grow();
        c.render();
    }
}

function genCircle() {
    let attX = width * random();
    let attY = height  * random();
    let fail = false;
    for(c of circles) {
        if(dist(attX, attY, c.posX, c.posY) < c.radius) {
            fail = true;
            break;
        }
    }
    if(fail) {
        return genCircle();
    }
    return new Circle(attX, attY)
}

class Circle {
    constructor(_posX, _posY) {
        this.posX = _posX;
        this.posY = _posY;
        this.radius = 0;
        this.active = true;
    }

    render() {
        fill(img.get(this.posX, this.posY))
        circle(this.posX, this.posY, 2*this.radius);
    }

    intersect(c) {
        return dist(this.posX, this.posY, c.posX, c.posY) < this.radius + c.radius;
    }
    
    grow() {
        this.radius += 1;
    }
}

