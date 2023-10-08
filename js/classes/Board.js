class Board {
    #ratio; #height; #width; #gateLeft; #gateRight; #font; #fontColor;
    constructor(windowHeight, windowWidth) {
        this.#ratio = 540 / 320;
        this.#height = windowHeight;
        this.#width = Math.min(windowWidth, windowHeight / this.#ratio);
        this.#gateLeft = this.width * 0.3;
        this.#gateRight = this.width * 0.7;
        this.#font = "30px Arial";
        this.#fontColor = "#f00";
    }

    get height() { return this.#height; }
    get width() { return this.#width; }
    get gateLeft() { return this.#gateLeft; }
    get gateRight() { return this.#gateRight; }
    get font() { return this.#font; }
    get fontColor() { return this.#fontColor; }
}
