// var canvas = document.getElementById("myCanvas");
// var context = box_canvas.getContext("2d");
//
// function draw_box() {
//   var player_paddle = box_canvas.getContext("2d");
//   var computer_paddle = box_canvas.getContext("2d");
//
//   box_context.fillRect(0, 0, 600, 300);
//   player_paddle.clearRect(250, 0, 100, 10);
//   computer_paddle.clearRect(250, 290, 100, 10);
// }
//
// function draw_paddle() {
//   var radius = 8;
//   var startAngle = 0 * Math.PI;
//   var endAngle = 2 * Math.PI;
//   var counterClockwise = false;
//
//   ball.beginPath();
//   ball.arc(298, 148, radius, startAngle, endAngle, counterClockwise);
//   ball.fillStyle = "white";
//   ball.fill();
// }
// draw_box();
// draw_paddle();

// setting up a 2d context canvas
var canvas = document.getElementById('myCanvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

// paddle content
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

// rendering paddle to the screen
Paddle.prototype.render = function() {
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

// creating player paddle at the bottom
function Player() {
  this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function() {
  this.paddle.render();
};

// creating computer paddle at the top
function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function() {
  this.paddle.render();
};

// ball content
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 5;
}

// rendering ball to the screen
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#000000";
  context.fill();
};

// building each objects
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

// rendering the views
var render = function() {
  context.fillStyle = "#FF00FF";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

// calling render and animate functions
var step = function() {
  render();
  animate(step);
};

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};
