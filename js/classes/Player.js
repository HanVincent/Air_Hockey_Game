class Player {
  #boardHeight; #boardWidth; #heightQuadrate;
  #x; #y; #r; #dx; #dy; #score; #level; #color;
  constructor(boardHeight, boardWidth, heightQuadrate, level = 1) {
    this.#boardHeight = boardHeight;
    this.#boardWidth = boardWidth;
    this.#heightQuadrate = heightQuadrate;
    // computer player move speed
    this.#r = boardWidth * 0.05;// player size    
    this.#level = level;
    this.#color = "#0f0";
    this.#score = 0;
    this.init();
  }

  init() {
    this.#x = this.#boardWidth / 2; // start point
    this.#y = this.#boardHeight * this.#heightQuadrate;
    this.#dx = this.#level; // based on the level, the computer's speed on x-axis varies. The harder, the faster.
    this.#dy = this.#level;
  }

  updateLoc(x, y) {
    this.#x = x;
    this.#y = y;
  }

  getScore() {
    this.#score++;
  }
  
  get x() { return this.#x; }
  get y() { return this.#y; }
  get r() { return this.#r; }
  get dx() { return this.#dx; }
  get dy() { return this.#dy; }
  get score() { return this.#score; }
  get level() { return this.#level; }
  get color() { return this.#color; }

}
