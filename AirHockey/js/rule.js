'use strict';
(function(exports){
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var goalStart = width * 0.3;
    var goalEnd = width * 0.7;
    var ball = {
        x: width / 2,
        y: height / 2,
        r: width * 0.04,
        dx: 0,
        dy: 0,
        s: 10,
        f: 0.995
    };
    var bumper = function (h) {
        this.x = width / 2;
        this.y = height * h;
        this.r = width * 0.05;
        this.score = 0;
        this.bounce = function() {
            if ((ball.x - this.x)*(ball.x - this.x) + (ball.y - this.y)*(ball.y - this.y)
                <= (ball.r + this.r)*(ball.r + this.r)){
                ball.dx = (ball.x - this.x) / (ball.r + this.r) * ball.s;
                ball.dy = (ball.y - this.y) / (ball.r + this.r) * ball.s;
            }
        };
    };
    var player1 = new bumper(0.66);
    var player2 = new bumper(0.33);

    var rule = function () {

    };

    rule.prototype.start = function() {
        this.interval = setInterval(this.drawArea.bind(this), 1);
    };

    rule.prototype.movePlayer = function(e) {
        if(e.center.y > height/2){
            player1.x = e.center.x;
            player1.y = e.center.y;
        }
        if(e.center.y < height/2){
            player2.x = e.center.x;
            player2.y = e.center.y;
        }

    };

    rule.prototype.border = function() {
        if(ball.x + ball.r >= width || ball.x - ball.r <= 0){
            ball.x = ball.x + ball.r >= width? width - ball.r : 0 + ball.r;
            ball.dx *= -1;
        }
        if(ball.y + ball.r >= height || ball.y - ball.r <= 0){
            if(ball.x - ball.r < goalStart || ball.x + ball.r > goalEnd){
                ball.y = ball.y + ball.r >= height? height - ball.r : 0 + ball.r;
                ball.dy *= -1;
            } else if (ball.x - ball.r >= goalStart && ball.x + ball.r <= goalEnd){
                ball.dx *= -1;
                this.isGet();
            }
        }
    };

    rule.prototype.isGet = function() {
        if(ball.y + ball.r < 0)
            player1.score++;
        if(ball.y - ball.r > height)
            player2.score++;
        if(player1.score == 5 || player2.score == 5)
            this.isWin();

        if(ball.y + ball.r < 0 || ball.y - ball.r > height){
            player1.x = width / 2;
            player1.y = height * 0.66;
            player2.x = width / 2;
            player2.y = height * 0.33;
            ball.x = width / 2;
            ball.y = height / 2;
            ball.dx = 0;
            ball.dy = 0;
        }

    };

    rule.prototype.isWin = function() {
        this.drawArea();
        clearInterval(this.interval);
        player1.score = 0;
        player2.score = 0;
    };

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
        ctx.fillText(player1.score, 0, 30);
        ctx.fillText(player2.score, 0, height);


        ball.dx *= ball.f;
        ball.dy *= ball.f;
        ball.x += ball.dx;
        ball.y += ball.dy;

        this.border();

        player1.bounce();//bounce當球和punk接觸時才會觸發
        player2.bounce();
    };

    exports.rule = rule;
})(window);
