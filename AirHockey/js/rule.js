'use strict';
(function(exports){
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var goalStart = width * 0.3;
    var goalEnd = width * 0.7;
    var ball = {//球的相關特性
        x: width / 2,
        y: height / 2,
        r: width * 0.04,
        dx: 0,//x軸的速度
        dy: 0,//y軸的速度
        s: 10,//可以讓使用者調整的速度
        f: 0.995//摩擦力
    };
    var bumper = function (h) {//新增球盤物件的function，傳入的h用來放置位置
        this.x = width / 2;
        this.y = height / h;
        this.r = width * 0.05;
        this.dx = 0;//用來設置Computer的移動速度
        this.dy = 0;
        this.score = 0;//得分數
        this.bounce = function() {//確認是否撞到球，有則球反彈
            if ((ball.x - this.x)*(ball.x - this.x) + (ball.y - this.y)*(ball.y - this.y)
                <= (ball.r + this.r)*(ball.r + this.r)){
                ball.dx = (ball.x - this.x) / (ball.r + this.r) * ball.s;//this.dx*10;
                ball.dy = (ball.y - this.y) / (ball.r + this.r) * ball.s;//this.dy*10;

                if((ball.x - this.x)*(ball.x - this.x) + (ball.y - this.y)*(ball.y - this.y)
                    < (ball.r + this.r)*(ball.r + this.r)){
                    this.x -= 1;
                    this.y -= 1;
                }
            }
        };
    };
    var player1 = new bumper(4/3);//新增player1，player2
    var player2 = new bumper(4);

    var rule = function () {};

    rule.prototype.start = function() {//設置使用者的調整
        ball.f = 1 - $("#friction").val() / 1000;
        ball.s = $("#speed").val();
        this.model = $("[name=player]:checked").val();
        this.goal = $("#goal").val();
        this.ComLevel = $("[name=level]:checked").val();
        this.interval = setInterval(this.drawArea.bind(this), 3);//每3ms重刷一次畫布
    };

    rule.prototype.movePlayer = function(e) {
        if(this.model === "1"){//1P則只能控制下半部分
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            if(touch.pageY > height/2){
                player1.x = touch.pageX;
                player1.y = touch.pageY;
            }
        } else {//2P，利用迴圈將每個touch進行判斷
            for(var i = 0; i < e.originalEvent.touches.length; i++){
                var touch = e.originalEvent.touches[i] || e.originalEvent.changedTouches[i];
                if(touch.pageY > height/2){
                    player1.x = touch.pageX;
                    player1.y = touch.pageY;
                } else {
                    player2.x = touch.pageX;
                    player2.y = touch.pageY;
                }
            }
        }
    };

    //1P時才會call
    rule.prototype.comMove = function () {
        if(ball.y < height / 2){//球進入電腦領域時，會以y軸去撞球，球比電腦更靠近球門時，電腦移動速度會比較快
            if(ball.y > player2.y)
                player2.y += this.ComLevel/2;
            else
                player2.y -= this.ComLevel;
        } else if (player2.y > height / 4){//其他狀況則維持在同一水平
            player2.y -= this.ComLevel / 5;
        } else if (player2.y < height / 4) {
            player2.y += this.ComLevel / 5;
        }

        //藉由ComLevel調整電腦的左右移動速度，越困難則移動越快
        player2.dx = this.ComLevel === 5 ? this.ComLevel : this.ComLevel / 3;
        if(ball.y < player2.y && ball.x > player2.x - this.ComLevel && ball.x < player2.x + this.ComLevel)
            player2.dx = this.ComLevel/3 ;

        //Com移動
        if(player2.x < ball.x + 10)
            player2.x += player2.dx;
        if(player2.x > ball.x - 10)
            player2.x -= player2.dx;

        //讓Computer不會超出範圍
        if(player2.y > height / 2)
            player2.y = height / 2;
        else if(player2.y < 0)
            player2.y = 0;
        if(player2.x < 0)
            player2.x = 0;
        else if(player2.x > width)
            player2.x = width;
    };

    //邊界，球碰到則反彈
    rule.prototype.border = function() {
        if(ball.x + ball.r >= width || ball.x - ball.r <= 0){
            ball.x = ball.x + ball.r >= width? width - ball.r : 0 + ball.r;
            ball.dx *= -1;
        }
        if(ball.y + ball.r >= height || ball.y - ball.r <= 0){
            if(ball.x - ball.r < goalStart || ball.x + ball.r > goalEnd){
                ball.y = ball.y + ball.r >= height? height - ball.r : 0 + ball.r;
                ball.dy *= -1;
            } else if (ball.x >= goalStart && ball.x <= goalEnd){//進球門
                ball.dx *= -1;
                this.isGet();
            }
        }
    };

    //進球門，得分
    rule.prototype.isGet = function() {
        if(ball.y + ball.r < 0)
            player1.score++;
        if(ball.y - ball.r > height)
            player2.score++;
        if(player1.score == this.goal || player2.score == this.goal)//如果到達指定分數，則遊戲結束
            this.isWin();

        if(ball.y + ball.r < 0 || ball.y - ball.r > height){//某方得分則初始值
            player1.x = width / 2;
            player1.y = height * 3/4;
            player2.x = width / 2;
            player2.y = height / 4;
            ball.x = width / 2;
            ball.y = height / 2;
            ball.dx = 0;
            ball.dy = 0;
        }
    };

    rule.prototype.isWin = function() {//獲勝則停止Interval且歸零分數，並回到主頁面
        this.drawArea();
        clearInterval(this.interval);
        if(player1.score > player2.score)
            alert("Player1 win!");
        else
            this.model === "1"? alert("Computer win!") : alert("Player2 win!");
        player1.score = 0;
        player2.score = 0;
        history.back();//返回主頁面
    };

    //畫布
    rule.prototype.drawArea = function() {
        var ctx = $('#canvas')[0].getContext("2d");
        ctx.canvas.width  = width;
        ctx.canvas.height = height;

        //ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle="#0ff";
        ctx.fill();

        //player1
        ctx.beginPath();
        ctx.arc(player1.x, player1.y, player1.r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle="#0f0";
        ctx.fill();

        //player2
        ctx.beginPath();
        ctx.arc(player2.x, player2.y, player2.r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        //score
        ctx.font = "30px Arial";
        ctx.fillStyle="#f00";
        ctx.fillText(player1.score, 0, height);
        ctx.fillText(player2.score, 0, 30);

        //move ball
        ball.dx *= ball.f;
        ball.dy *= ball.f;
        ball.x += ball.dx;
        ball.y += ball.dy;

        if(this.model === "1")//1P
            this.comMove();

        this.border();
        player1.bounce();//確認球和球盤是否碰撞
        player2.bounce();
    };
    exports.rule = rule;
})(window);
