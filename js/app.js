
var audioElement = document.createElement("audio");

$("#start").click(function(e) {
  // 開始遊戲之後
  var rule = new Rule();

  $("#canvas").mousemove(function(e) {
    e.preventDefault();
    rule.movePlayer(e);
  });

  if ($("#music").val() === "1") {
    //撥放音樂
    audioElement.setAttribute("src", "Butchers.mp3");
    audioElement.setAttribute("autoplay", "autoplay");

    audioElement.addEventListener(
      "load",
      function() {
        audioElement.play();
      },
      true
    );
  } else {
    audioElement.pause();
  }
});
