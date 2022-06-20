let words, font, results;
function preload() {
  words = loadStrings('words.txt');
  font = loadFont('notosansmono.ttf')
}

let currentWord, currentCompleted, times, prevTime;
let exportButton;
function setup() {
  var myCanvas = createCanvas(min(800, windowWidth-40), min(400, windowHeight-40));
  myCanvas.parent("p5canvas");

  exportButton = createButton("Export")
  exportButton.parent("p5canvas")
  exportButton.mousePressed(exportResults);

  times = []
  results = {}
  prevTime = -1;

  textFont(font)
  textAlign(CENTER)
  resetWord();
}

function exportResults() {
  console.log(results)
  save(results, 'results.json');
}

function resetWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  while(currentWord.length <= 2) resetWord();
  currentCompleted = 0
  prevTime = -1
}

function drawWord(word, completed) {
  var pos_x = width/2 - textWidth(word)/2;
  for(let i = 0; i < word.length; i++) {
    if(i >= completed) fill(255, 255, 255)
    else fill(0, 255, 0)

    text(word[i], pos_x, height/2)
    pos_x += textWidth(word[i])
  }
}

function draw() {
  background(0);
  textSize(70);
  textAlign(CENTER)
  drawWord(currentWord, currentCompleted)
  textSize(15);
  textAlign(LEFT)
  text(times.map(x => x.toFixed(1)), 10, height - 10)
}

function keyTyped() {
  if(key == currentWord[currentCompleted]) {
    currentCompleted += 1;
    if(prevTime != -1)
      times.push(performance.now() - prevTime)
    prevTime = performance.now()
  }

  if(currentCompleted == currentWord.length) {
    if(!(currentWord in results)) results[currentWord] = []
    results[currentWord].push(times)
    times = []
    resetWord();
  }
}

function windowResized() {
  resizeCanvas(min(800, windowWidth-40), min(400, windowHeight-40));
}