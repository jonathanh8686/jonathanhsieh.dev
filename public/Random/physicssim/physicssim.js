var t1 = 0, t2 = 0;
var going1 = true, going2 = true;

var y1 = 100, y2 = 500;
var b1x = 100, b2x = 500;
var b2vel = 0;

var b3x = 100, b4x = 500;
var b3vel = 0, b4vel = 0;

var bigG = 0;

function setup() {
    createCanvas(800, 800);
    background(100);

    bigG = 6.67408 * pow(10, 1);
    frameRate(1000);
}

function draw() {
    background(100);
    text(t1, 300, 200);
    text(t2, 300, 600);

    if(going1 == true)
        t1++;
    if(going2 == true)
        t2++;

    gravity1();
    gravity2();

    ellipse(b1x, y1, 80, 80);
    ellipse(b2x, y1, 80, 80);

    ellipse(b3x, y2, 80, 80);
    ellipse(b4x, y2, 80, 80);

    if(b2x < b1x){
        b2vel = 0;
        b1vel = 0;

        going1 = false;

        text("t1/t2 = " + t1/t2, 250, 700);
    }

    if(b4x < b3x){
        b4vel = 0;
        b3vel = 0;

        going2 = false;
    }

    b2x -= b2vel;

    if(going2)
    {
        b3x+= b2vel;
        b4x -= b2vel;
    }



}

function gravity1()
{
    var r = b2x - b1x;

    var f = bigG/pow(r, 2); // masses are equal to 1

    // f = ma but m = 1 so f = a
    b2vel += f;

}

function gravity2()
{
    var r = b4x - b3x;

    var f = bigG/pow(r, 2);
    b3vel += f;
    b4vel -= f;
}
