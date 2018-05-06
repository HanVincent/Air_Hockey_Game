const WIDTH = (window.innerWidth > window.innerHeight / (540/320)) ? window.innerHeight/(540/320) : window.innerWidth;
const HEIGHT = window.innerHeight;
const GATE_LEFT = WIDTH * 0.3;
const GATE_RIGHT = WIDTH * 0.7;
const BALL = {
  // 球的相關特性
  x: WIDTH / 2,
  y: HEIGHT / 2,
  r: WIDTH * 0.04,
  dx: 0, // x軸的速度
  dy: 0, // y軸的速度
  s: 5, // 可以讓使用者調整的速度
  f: 0.995, // 摩擦力
  color: "#0ff"
};
