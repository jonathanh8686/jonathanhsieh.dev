let fft, sound, oscillators;

const dhz = 10, min_hz = 20, max_hz = 20000;

function preload() {
    sound = loadSound("cmajor.mp4");
}

function setup() {
    let cnv = createCanvas(800, 800);
    cnv.mouseClicked(toggleMusic);

    background(255);

    fft = new p5.FFT();
    oscillators = []
}

function draw() {
    background(200);
    let spectrum = fft.analyze();
    console.log(oscillators.length);

    oscillators = [];
    for(let i = min_hz; i < max_hz; i += dhz) {
        let osc = new p5.SinOsc(i + dhz/2);
        osc.amp(fft.getEnergy(i, i+dhz)/255);
        oscillators.push(osc);
    }

}

function toggleMusic() {
    console.log("Sound toggled")
    if(sound.isPlaying()) {
        sound.pause();
        oscillators.forEach(osc => {
            osc.play();
        });
    } else {
        sound.loop();
        oscillators.forEach(osc => {
            osc.stop();
        });

    }
}