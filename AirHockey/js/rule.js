'use strict';
(function(exports){
    var rule = function () {
        this.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        this.height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        //this.width = screen.width;
        //this.height = screen.height;

        this.ball = {
            x: this.width/2,
            y: this.height/2,
            r: this.width*0.05,
            dx: 0,
            dy: 0,
            f: 0.005
        };
        this.player1 = {
            x: this.width/2,
            y: this.height*0.66,
            r: this.width*0.06,
            vx: 0,
            vy: 0,
            score: 0
        };
        this.player2 = {
            x: this.width/2,
            y: this.height*0.33,
            r: this.width*0.06,
            vx: 0,
            vy: 0,
            score: 0
        };
        /*var temp = this.width;
        this.width = this.height;
        this.height = temp;*/
    };

    rule.prototype.start = function() {
            this.drawArea();
            this.interval = setInterval(this.drawArea.bind(this), 1);
        };

    rule.prototype.moveplayer = function(e) {
            if(e.center.y > this.height/2){
                this.player1.x = e.center.x;
                this.player1.y = e.center.y;
                this.player1.vx = -e.velocityX * 10;
                this.player1.vy = -e.velocityY * 10;
            } else {
                this.player2.x = e.center.x;
                this.player2.y = e.center.y;
                this.player2.vx = -e.velocityX * 10;
                this.player2.vy = -e.velocityY * 10;
            }
    };

    rule.prototype.direct = function() {  //direction of the ball
            if( (this.ball.x - this.player1.x)*(this.ball.x - this.player1.x)
                + (this.ball.y - this.player1.y)*(this.ball.y - this.player1.y)
                <= (this.ball.r + this.player1.r)*(this.ball.r + this.player1.r) ){
                //this.ball.dx = (this.ball.x - this.player1.x) / 10;
                //this.ball.dy = (this.ball.y - this.player1.y) / 10;
                this.ball.dx = this.player1.vx == 0? (this.ball.x - this.player1.x) / 10 : this.player1.vx;
                this.ball.dy = this.player1.vy == 0? (this.ball.y - this.player1.y) / 10 : this.player1.vy;
            } else if( (this.ball.x - this.player2.x)*(this.ball.x - this.player2.x)
                + (this.ball.y - this.player2.y)*(this.ball.y - this.player2.y)
                <= (this.ball.r + this.player2.r)*(this.ball.r + this.player2.r)){
                //this.ball.dx = (this.ball.x - this.player2.x) / 10;
                //this.ball.dy = (this.ball.y - this.player2.y) / 10;
                this.ball.dx = this.player2.vx == 0? (this.ball.x - this.player2.x) / 10 : this.player2.vx;
                this.ball.dy = this.player2.vy == 0? (this.ball.y - this.player2.y) / 10 : this.player2.vy;
            }
        };

    rule.prototype.forth = function() {
            if(this.ball.dx > 0)
                this.ball.dx -= this.ball.f * this.ball.dx/2;
            else if(this.ball.dx < 0)
                this.ball.dx += this.ball.f * this.ball.dx/2;
            if(this.ball.dy > 0)
                this.ball.dy -= this.ball.f * this.ball.dy/2;
            else if(this.ball.dy < 0)
                this.ball.dy += this.ball.f * this.ball.dy/2;

            this.ball.x += this.ball.dx;
            this.ball.y += this.ball.dy;
        };

    rule.prototype.bounce = function() {  //conflict to the wall
            if( (this.ball.y - this.ball.r <= 0 || this.ball.y + this.ball.r >= this.height) &&
                     (this.ball.x - this.ball.r < this.width * 0.3 || this.ball.x + this.ball.r > this.width * 0.7) )
                this.ball.dy = -this.ball.dy;
            else if( (this.ball.y - this.ball.r >= this.height || this.ball.y + this.ball.r <= 0) &&
                     (this.ball.x - this.ball.r > this.width * 0.3 && this.ball.x + this.ball.r < this.width * 0.7) )
                this.ball.dx = -this.ball.dx;
            else if( this.ball.x - this.ball.r < 0 || this.ball.x + this.ball.r > this.width )
                this.ball.dx = -this.ball.dx;
        };

    rule.prototype.isDead = function() {
            if(this.player1.score == 5 || this.player2.score == 5){
                alert("End.");
                this.End();
            }
            if(this.ball.y > this.height){  //player2 win
                this.player2.score++;
                this.reset();
            } else if(this.ball.y < 0){   //player1 win
                this.player1.score++;
                this.reset();
            }
        };
    rule.prototype.reset = function() {
            clearInterval(this.interval);
            this.ball.x = this.width/2;
            this.ball.y = this.height/2;
            this.ball.dx = 0;
            this.ball.dy = 0;
            this.player1.x = this.width/2;
            this.player1.y = this.height*0.66;
            this.player2.x = this.width/2;
            this.player2.y = this.height*0.33;
            this.start();
        };
    rule.prototype.End = function() {
            this.player1.score = 0;
            this.player2.score = 0;
            this.reset();
        };

    rule.prototype.drawArea = function() {
            //get canvas DOM
            var ctx = $('#canvas')[0].getContext("2d");
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.canvas.width  = this.width;
            ctx.canvas.height = this.height;

            //middle line
            ctx.beginPath();
            ctx.moveTo(0, this.height/2);
            ctx.lineTo(this.width, this.height/2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#00F";
            ctx.stroke();

            //both doors
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#FFF";
            ctx.beginPath();
            ctx.arc(this.width/2, 0, this.width*0.2, Math.PI, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.width/2, this.height, this.width*0.2, 0, Math.PI, true);
            ctx.closePath();
            ctx.stroke();

            //ball
            ctx.beginPath();
            ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fillStyle="#0ff";
            ctx.fill();

            //player1
            ctx.beginPath();
            ctx.arc(this.player1.x, this.player1.y, this.player1.r, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fillStyle="#0f0";
            ctx.fill();

            //player2
            ctx.beginPath();
            ctx.arc(this.player2.x, this.player2.y, this.player2.r, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fillStyle="#0f0";
            ctx.fill();

            //score
            ctx.font = "30px Arial";
            ctx.fillStyle="#f00";
            ctx.fillText(this.player1.score, 0, 30);
            ctx.fillText(this.player2.score, 0, this.height);

            this.direct();
            this.bounce();
            this.isDead();
            this.forth();

        };


    exports.rule = rule;
})(window);
