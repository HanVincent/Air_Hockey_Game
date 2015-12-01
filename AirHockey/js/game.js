'use strict';
(function(exports){
    var rule = function () {
        this.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        this.height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    }

    rule.prototype.drawArea = function() {
        var ctx = $('#canvas')[0].getContext("2d");
        ctx.canvas.width  = this.width;
        ctx.canvas.height = this.height;
    };

    exports.rule = rule;
})(window);
