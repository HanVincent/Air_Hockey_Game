class Ball {
    #boardHeight; #boardWidth; #defaultDx; #defaultDy;
    #x; #y; #r; #dx; #dy; #s; #f; #color;
    constructor(boardHeight, boardWidth, dx = 0, dy = 0, s = 10, f = 0.995, color = "#0ff") {
        this.#boardHeight = boardHeight;
        this.#boardWidth = boardWidth;
        this.#defaultDx = dx; // x-axis speed
        this.#defaultDy = dy; // y-axis speed
        this.#r = this.#boardWidth * 0.04; // ball size
        this.#s = s;// adjustable speed for users
        this.#f = f; // friction
        this.#color = color;
        this.init();
    }

    init() {
        this.#x = this.#boardWidth / 2; // start point in the middle of the board
        this.#y = this.#boardHeight / 2;
        this.#dx = this.#defaultDx;
        this.#dy = this.#defaultDy;
    }

    updateLoc(x, y) {
        this.#x = x;
        this.#y = y;
    }

    updateDirection(dx, dy) {
        this.#dx = dx * this.#s;
        this.#dy = dy * this.#s;
    }

    speedDown() {
        this.#dx *= this.#f;
        this.#dy *= this.#f;
    }

    xBounce() {
        this.#dx *= -1;
    }

    yBounce() {
        this.#dy *= -1;
    }

    get x() { return this.#x; }
    get y() { return this.#y; }
    get r() { return this.#r; }
    get dx() { return this.#dx; }
    get dy() { return this.#dy; }
    get color() { return this.#color; }

}
