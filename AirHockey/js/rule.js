'use strict';
(function(exports){
    var model = 0;//decide 1P/2P
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var goalStart = width * 0.3;
    var goalEnd = width * 0.7;
    var goal = 5;
    var ComLevel = 0;
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
        this.y = height / h;
        this.r = width * 0.05;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.bounce = function() {
            if ((ball.x - this.x)*(ball.x - this.x) + (ball.y - this.y)*(ball.y - this.y)
                <= (ball.r + this.r)*(ball.r + this.r)){
                ball.dx = (ball.x - this.x) / (ball.r + this.r) * ball.s;//this.dx*10;
                ball.dy = (ball.y - this.y) / (ball.r + this.r) * ball.s;//this.dy*10;
            }
        };
    };
    var player1 = new bumper(4/3);
    var player2 = new bumper(4);

    var rule = function () {

    };

    rule.prototype.start = function() {//set the user choice
        this.interval = setInterval(this.drawArea.bind(this), 3);
        model = $("[name=player]:checked").val();
        ball.f = 1 - $("#friction").val() / 1000;
        ball.s = $("#speed").val();
        goal = $("#goal").val();
        ComLevel = $("[name=level]:checked").val();
    };

    rule.prototype.movePlayer = function(e) {
        if(model === "1"){//1P
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            if(touch.pageY > height/2){
                player1.x = touch.pageX;
                player1.y = touch.pageY;
            }
        } else {//2P
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

    rule.prototype.comMove = function () {
        //接球
        if(Math.abs(ball.dx) + Math.abs(ball.dy) < 10 && ball.y < height / 2){
            if(ball.y > player2.y)
                player2.y += 4;
            else
                player2.y -= 4;
        } else if (player2.y > height / 4){
            player2.y -= 4;
        } else if (player2.y < height / 4) {
            player2.y += 4;
        }

        //嚴禁超線
        if(player2.y > height / 2)
            player2.y = height / 2;
        else if(player2.y < 0)
            player2.y = 0;
        if(player2.x < 0)
            player2.x = 0;
        else if(player2.x > width)
            player2.x = width;

        player2.dx = 6;
        //If the ball is behind Com, it moves out of the way.
        //不知道幹嘛
        if(ball.y < player2.y && ball.x > player2.x - 30 && ball.x < player2.x + 30)
            player2.dx = -6;

        //Com移動，ComLevel決定難度
        if(player2.x < ball.x + ComLevel)
            player2.x += player2.dx;
        if(player2.x > ball.x - ComLevel)
            player2.x -= player2.dx;
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
            } else if (ball.x >= goalStart && ball.x <= goalEnd){
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
        if(player1.score == goal || player2.score == goal)
            this.isWin();

        if(ball.y + ball.r < 0 || ball.y - ball.r > height){
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

    rule.prototype.isWin = function() {
        this.drawArea();
        clearInterval(this.interval);
        player1.score = 0;
        player2.score = 0;
        this.start();
        history.back();
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
        ctx.fillText(player1.score, 0, height);
        ctx.fillText(player2.score, 0, 30);

        //move ball
        ball.dx *= ball.f;
        ball.dy *= ball.f;
        ball.x += ball.dx;
        ball.y += ball.dy;

        if(model === "1")//1P
            this.comMove();

        this.border();
        player1.bounce();//bounce當球和punk接觸時才會觸發
        player2.bounce();
    };

    exports.rule = rule;
})(window);
