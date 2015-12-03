/*Create rule object*/
var rule;
$('#start').click(function() {
    rule = new rule();
    rule.start();
    $("#canvas").bind("touchmove", function(e){
        e.preventDefault();
        rule.movePlayer(e);
    });
});

