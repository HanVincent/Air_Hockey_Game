/*Create rule object*/
var rule = new rule();

$('#start').click(function() {
    rule.start();

    var hammer = new Hammer(document.getElementById('canvas'));
    hammer.get('pan').set({ pointers: 0 });

    hammer.on("tap panstart panmove", function(e){
        rule.moveplayer(e);
    });
});

