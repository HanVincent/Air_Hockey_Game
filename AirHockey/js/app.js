/*Create rule object*/
var rule;
$('#start').click(function() {
    rule = new rule();
    rule.start();
    $("#canvas").on("touchstart touchmove", function(e){
        e.preventDefault();
        rule.movePlayer(e);
    });
});

