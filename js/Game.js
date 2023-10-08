class Game {
  #board; #ball; #player1; #player2; #ctx; #is1PMode; #goal;
  constructor(board, ball, player1, player2, mode, goal, ctx) {
    this.#board = board;
    this.#ball = ball;
    this.#player1 = player1;
    this.#player2 = player2;
    this.#is1PMode = mode === "1";
    this.#goal = goal;
    this.#ctx = ctx;
    this.#ctx.canvas.height = this.#board.height;
    this.#ctx.canvas.width = this.#board.width;
  }

  start() {
    const step = (timestamp) => {
      if (this.#is1PMode) {
        this.moveComputer();
      }
      this.moveBall();
      this.bounceBoarder();
      this.hitBall(this.#player1);
      this.hitBall(this.#player2);
      this.drawArea();
      if (!this.isGameOver()) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // 1P mode on PC web
  movePlayer(e) {
    if (e.offsetY > this.#board.height / 2) {
      this.#player1.updateLoc(e.offsetX, e.offsetY);
    }
  }

  // 2P mode on the phone
  multiPlayers(e) {
    for (let i = 0; i < e.originalEvent.touches.length; i++) {
      const touch =
        e.originalEvent.touches[i] || e.originalEvent.changedTouches[i];
      if (touch.pageY > this.#board.height / 2) {
        this.#player1.updateLoc(touch.pageX, touch.pageY);
      } else {
        this.#player2.updateLoc(touch.pageX, touch.pageY);
      }
    }
  }

  moveComputer() {

    // handle ball's y-axis
    if (this.#ball.y < this.#board.height * 0.5) {
      // When ball enters computer's field, computer moves according to the y-axis of ball, and computer speeds up when the ball exceeds the computer
      const directionAndSpeed = this.#ball.y - this.#ball.r > this.#player2.y +this.#player2.r ? 0.5 : -1;
      this.#player2.updateLoc(this.#player2.x, this.#player2.y + this.#player2.dy * directionAndSpeed);
    } else {
      // When ball is in player's field, computer gets back to stand-by
      const direction = this.#player2.y > this.#board.height * 0.25 ? -1 : 1;
      this.#player2.updateLoc(
        this.#player2.x,
        this.#player2.y + this.#player2.dy * 0.2 * direction
      );
    }

    // handle ball's x-axis
    if (this.#player2.x - this.#player2.r < this.#ball.x) {
      this.#player2.updateLoc(this.#player2.x + this.#player2.dx, this.#player2.y);
    }
    if (this.#player2.x + this.#player2.r > this.#ball.x) {
      this.#player2.updateLoc(this.#player2.x - this.#player2.dx, this.#player2.y);
    }

    // refrain from out of the boarder
    this.#player2.updateLoc(
      Math.max(0, Math.min(this.#board.width, this.#player2.x)),
      Math.max(0, Math.min(this.#board.height * 0.5, this.#player2.y))
    );
  }

  moveBall() {
    this.#ball.speedDown();
    this.#ball.updateLoc(this.#ball.x + this.#ball.dx, this.#ball.y + this.#ball.dy);
  }

  // hit the boarder and bounce
  bounceBoarder() {
    // check x-axis
    if (this.#ball.x + this.#ball.r >= this.#board.width || this.#ball.x - this.#ball.r <= 0) {
      this.#ball.updateLoc(
        (this.#ball.x + this.#ball.r >= this.#board.width) ? (this.#board.width - this.#ball.r) : (0 + this.#ball.r),
        this.#ball.y
      );
      this.#ball.xBounce();
    }

    // check y-axis
    if (this.#ball.y + this.#ball.r >= this.#board.height || this.#ball.y - this.#ball.r <= 0) {
      if (this.#ball.x < this.#board.gateLeft || this.#ball.x > this.#board.gateRight) {
        this.#ball.updateLoc(
          this.#ball.x,
          (this.#ball.y + this.#ball.r >= this.#board.height) ? (this.#board.height - this.#ball.r) : (0 + this.#ball.r)
        );
        this.#ball.yBounce();
      } else {
        this.shoot();
      }
    }
  }

  hitBall(player) {
    if (
      Math.pow(this.#ball.x - player.x, 2) + Math.pow(this.#ball.y - player.y, 2) <= Math.pow(this.#ball.r + player.r, 2)
    ) {
      this.#ball.updateDirection(
        (this.#ball.x - player.x) / (this.#ball.r + player.r),
        (this.#ball.y - player.y) / (this.#ball.r + player.r)
      );
      player.updateLoc(player.x - 1, player.y - 1);
    }
  }

  // get into the gate and update score
  shoot() {
    if (this.#ball.y + this.#ball.r < 0) {
      this.#player1.getScore();
      this.#player1.init();
      this.#ball.init();
    } else if (this.#ball.y - this.#ball.r > this.#board.height) {
      this.#player2.getScore();
      this.#player2.init();
      this.#ball.init();
    }

    if (this.isGameOver()) {
      this.terminate();
    }
  }

  isGameOver() {
    return this.#player1.score == this.#goal || this.#player2.score == this.#goal;
  }

  terminate() {
    if (this.#player1.score > this.#player2.score) {
      alert("player1 win!");
    } else {
      alert(this.#board.is1PMode ? "Computer win!" : "player2 win!");
    }
    // back to homepage
    history.back();
  }

  drawArea() {
    // clean the canvas
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

    // draw halfway line
    this.#ctx.lineWidth = 1;
    this.#ctx.strokeStyle = "#0000FF"
    this.#ctx.beginPath();
    this.#ctx.moveTo(0, this.#board.height / 2);
    this.#ctx.lineTo(this.#board.width, this.#board.height / 2);
    this.#ctx.stroke();

    // draw gate
    const gateRadius = (this.#board.gateRight - this.#board.gateLeft) / 2;
    this.#ctx.lineWidth = 3;
    this.#ctx.strokeStyle = "#FFFFFF"
    this.#ctx.beginPath();
    this.#ctx.arc(this.#board.width / 2, 0, gateRadius, 0, 1 * Math.PI);
    this.#ctx.stroke();
    this.#ctx.beginPath();
    this.#ctx.arc(this.#board.width / 2, this.#board.height, gateRadius, 1 * Math.PI, 0);
    this.#ctx.stroke();

    // update ball
    this.#ctx.beginPath();
    this.#ctx.arc(this.#ball.x, this.#ball.y, this.#ball.r, 0, Math.PI * 2, true);
    this.#ctx.closePath();
    this.#ctx.fillStyle = this.#ball.color;
    this.#ctx.fill();

    // update player1
    this.#ctx.beginPath();
    this.#ctx.arc(this.#player1.x, this.#player1.y, this.#player1.r, 0, Math.PI * 2, true);
    this.#ctx.closePath();
    this.#ctx.fillStyle = this.#player1.color;
    this.#ctx.fill();

    // update player2
    this.#ctx.beginPath();
    this.#ctx.arc(this.#player2.x, this.#player2.y, this.#player2.r, 0, Math.PI * 2, true);
    this.#ctx.closePath();
    this.#ctx.fillStyle = this.#player1.color;
    this.#ctx.fill();

    // update score
    this.#ctx.font = this.#board.font;
    this.#ctx.fillStyle = this.#board.fontColor;
    this.#ctx.fillText(this.#player1.score, 0, this.#board.height);
    this.#ctx.fillText(this.#player2.score, 0, 30);
  }
}
