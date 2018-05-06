// 新增球盤物件的function，傳入的h用來放置位置
function Bumper(h) {
  this.x = WIDTH / 2;
  this.y = HEIGHT / h;
  this.r = WIDTH * 0.05;
  this.dx = 0; //用來設置Computer的移動速度
  this.dy = 0;
  this.score = 0; //得分數
  this.bounce = function() {
    //確認是否撞到球，有則球反彈
    if (
      Math.pow(BALL.x - this.x, 2) + Math.pow(BALL.y - this.y, 2) <=
      Math.pow(BALL.r + this.r, 2)
    ) {
      BALL.dx = (BALL.x - this.x) / (BALL.r + this.r) * BALL.s; //this.dx*10;
      BALL.dy = (BALL.y - this.y) / (BALL.r + this.r) * BALL.s; //this.dy*10;

    //   if ( // ???
    //     Math.pow(BALL.x - this.x, 2) + Math.pow(BALL.y - this.y, 2) <
    //     Math.pow(BALL.r + this.r, 2)
    //   ) {
        this.x -= 1;
        this.y -= 1;
    //   }
    }
  }
}
