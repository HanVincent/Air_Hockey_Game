"use strict";

// make requestAnimationFrame to compatible with different browsers
(function () {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;
})();

// start game
$("#start").click(e => {
  const board = new Board(window.innerHeight, window.innerWidth);
  const ball = new Ball(board.height, board.width, 0, 0, $("#speed").val() / 2, 1 - $("#friction").val() / 1000);
  const player1 = new Player(board.height, board.width, 0.75);
  const player2 = new Player(board.height, board.width, 0.25, parseInt($("[name=level]:checked").val()));
  const ctx = $("#canvas")[0].getContext("2d");
  const mode = $("[name=player]:checked").val();
  const goal = $("#goal").val()
  const game = new Game(board, ball, player1, player2, mode, goal, ctx);
  const audioElement = document.createElement("audio");
  playMusic(audioElement);

  $("#canvas").on("mousemove", e => {
    game.movePlayer(e);
  });

  $("#canvas").on("touchmove", e => {
    game.multiPlayers(e);
  });

  game.start();
});

function playMusic(audioElement) {
  if ($("#music").val() === "1") {
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
}