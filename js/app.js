const audioElement = document.createElement("audio");
let rule = new Rule();

$("#start").click(e => {
  // 開始遊戲之後
  rule.reset();
  rule.set();

  $("#canvas").on("mousemove", e => {
    rule.movePlayer(e);
  });

  $("#canvas").on("touchmove", e => {
    rule.multiPlayers(e);
  });
  
  if ($("#music").val() === "1") {
    // 撥放音樂
    audioElement.setAttribute("src", "Butchers.mp3");
    audioElement.setAttribute("autoplay", "autoplay");

    audioElement.addEventListener(
      "load",
      () => {
        audioElement.play();
      },
      true
    );
  } else {
    audioElement.pause();
  }
});
