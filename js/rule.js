"use strict";

function Rule() {
  BALL.f = 1 - $("#friction").val() / 1000;
  BALL.s = $("#speed").val() / 5;
  this.mode = $("[name=player]:checked").val();
  this.goal = $("#goal").val();
  this.comLevel = $("[name=level]:checked").val();
  this.player1 = new Bumper(4 / 3);
  this.player2 = new Bumper(4);
  this.interval = setInterval(this.drawArea.bind(this), 2); //每3ms重刷一次畫布
}

Rule.prototype.movePlayer = function(e) {
  if (this.mode === "1") {
    // 1P則只能控制下半部分
    const x = e.offsetX;
    const y = e.offsetY;
    if (y > HEIGHT / 2) {
      this.player1.x = x;
      this.player1.y = y;
    }
  } else {
    // TODO:?
    //2P，利用迴圈將每個touch進行判斷
    for (var i = 0; i < e.originalEvent.touches.length; i++) {
      var touch =
        e.originalEvent.touches[i] || e.originalEvent.changedTouches[i];
      if (touch.pageY > height / 2) {
        this.player1.x = touch.pageX;
        this.player1.y = touch.pageY;
      } else {
        this.player2.x = touch.pageX;
        this.player2.y = touch.pageY;
      }
    }
  }
};

// 1P時才會call
Rule.prototype.comMove = function() {
  if (BALL.y < HEIGHT / 2) {
    // 球進入電腦領域時，會以y軸去撞球，球比電腦更靠近球門時，電腦移動速度會比較快
    if (BALL.y > this.player2.y) this.player2.y += this.comLevel / 2;
    else this.player2.y -= this.comLevel;
  } else if (this.player2.y > HEIGHT / 4) {
    // 其他狀況則維持在同一水平
    this.player2.y -= this.comLevel / 5;
  } else if (this.player2.y < HEIGHT / 4) {
    this.player2.y += this.comLevel / 5;
  }

  // 藉由 comLevel 調整電腦的左右移動速度，越困難則移動越快
  this.player2.dx = parseInt(this.comLevel);
  if (
    BALL.y < this.player2.y &&
    BALL.x > this.player2.x - this.comLevel &&
    BALL.x < this.player2.x + this.comLevel
  )
    this.player2.dx = this.comLevel / 3;

  // Com移動
  if (this.player2.x < BALL.x + 10) this.player2.x += this.player2.dx;
  if (this.player2.x > BALL.x - 10) this.player2.x -= this.player2.dx;

  // 讓 computer 不會超出範圍
  // TODO 改成 function
  this.player2.y = Math.max(0, Math.min(HEIGHT / 2, this.player2.y));
  this.player2.x = Math.max(0, Math.min(WIDTH, this.player2.x));
};

// 邊界，球碰到則反彈
Rule.prototype.border = function() {
  if (BALL.x + BALL.r >= WIDTH || BALL.x - BALL.r <= 0) {
    BALL.x = BALL.x + BALL.r >= WIDTH ? WIDTH - BALL.r : 0 + BALL.r;
    BALL.dx *= -1;
  }
  if (BALL.y + BALL.r >= HEIGHT || BALL.y - BALL.r <= 0) {
    if (BALL.x - BALL.r < GATE_LEFT || BALL.x + BALL.r > GATE_RIGHT) {
      BALL.y = BALL.y + BALL.r >= HEIGHT ? HEIGHT - BALL.r : 0 + BALL.r;
      BALL.dy *= -1;
    } else {
      // 進球門
      BALL.dx *= -1;
      this.getScore();
    }
  }
};

// 進球門，得分
Rule.prototype.getScore = function() {

  if (BALL.y + BALL.r < 0) this.player1.score++;
  else if (BALL.y - BALL.r > HEIGHT) this.player2.score++;
  
  if (this.player1.score == this.goal || this.player2.score == this.goal)
    // 如果到達指定分數，則遊戲結束
    this.isOver();

    // TODO: 應該不用判斷？
  if (BALL.y + BALL.r < 0 || BALL.y - BALL.r > HEIGHT) {
    // 某方得分則初始值
    this.player1.x = WIDTH / 2;
    this.player1.y = HEIGHT * 3 / 4;
    this.player2.x = WIDTH / 2;
    this.player2.y = HEIGHT / 4;
    BALL.x = WIDTH / 2;
    BALL.y = HEIGHT / 2;
    BALL.dx = 0;
    BALL.dy = 0;
  }
};

Rule.prototype.isOver = function() {
  // 獲勝則停止Interval且歸零分數，並回到主頁面
  this.drawArea();
  clearInterval(this.interval);
  if (this.player1.score > this.player2.score) alert("player1 win!");
  else this.mode === "1" ? alert("Computer win!") : alert("player2 win!");
  this.player1.score = 0;
  this.player2.score = 0;
  history.back(); // 返回主頁面
};

//畫布
Rule.prototype.drawArea = function() {
  let ctx = $("#canvas")[0].getContext("2d");
  ctx.canvas.width = WIDTH;
  ctx.canvas.height = HEIGHT;

  //BALL
  ctx.beginPath();
  ctx.arc(BALL.x, BALL.y, BALL.r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = BALL.color;
  ctx.fill();

  //this.player1
  ctx.beginPath();
  ctx.arc(this.player1.x, this.player1.y, this.player1.r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = "#0f0";
  ctx.fill();

  //this.player2
  ctx.beginPath();
  ctx.arc(this.player2.x, this.player2.y, this.player2.r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  //score
  ctx.font = "30px Arial";
  ctx.fillStyle = "#f00";
  ctx.fillText(this.player1.score, 0, HEIGHT);
  ctx.fillText(this.player2.score, 0, 30);

  //move BALL
  BALL.dx *= BALL.f;
  BALL.dy *= BALL.f;
  BALL.x += BALL.dx;
  BALL.y += BALL.dy;

  if (this.mode === "1")
    //1P
    this.comMove();

  this.border();
  this.player1.bounce(); // 確認球和球盤是否碰撞
  this.player2.bounce();
};
