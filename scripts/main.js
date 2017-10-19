// setting up a 2d context canvas
var canvas = document.getElementById('myCanvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var player_score = 0;
var computer_score = 0;

// paddle content
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

// rendering paddle to the screen
Paddle.prototype.render = function() {
  context.fillStyle = "blue";
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

Computer.prototype.update = function(ball) {
  var diff = ball.x - (this.paddle.x + 25);
  if (diff > 0 && diff > 10) {
    this.paddle.move(5.2, 0);
  } else if (diff < 0 && diff < -10) {
    this.paddle.move(-5.2, 0);
  } else {
    this.paddle.move(0, 0);
  }
};

// ball content
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

// rendering ball to the screen
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "white";
  context.fill();
};

Ball.prototype.update = function(player_paddle, computer_paddle) {
  this.x += this.x_speed;
  this.y += this.y_speed;

  if (this.x - 5 < 0) { // hitting the left-side wall
    this.x_speed = -1 * this.x_speed;
  } else if (this.x + 5 > 400) { // hitting the right-side wall
    this.x_speed = -1 * this.x_speed;
  }
  if (this.y - 5 > 300) {
    // hitting the player paddle
    if (this.y - 5 < player_paddle.y + player_paddle.height && this.x + 5 > player_paddle.x && this.x - 5 < (player_paddle.x + player_paddle.width) && this.y + 5 > player_paddle.y) {
      this.y_speed = -4;
      this.x_speed += ((this.x - player_paddle.x - 25) * 0.15);
      this.y += this.y_speed;
    }
  } else {
    //hitting the computer paddle
    if (this.y + 5 > computer_paddle.y && this.x + 5 > computer_paddle.x && this.x - 5 < (computer_paddle.x + computer_paddle.width) && this.y - 5 < computer_paddle.y + computer_paddle.height) {
      this.y_speed = 4;
      this.x_speed += ((this.x - computer_paddle.x - 25) * 0.15);
      this.y += this.y_speed;
    }
  }
  var reset_ball = function(value) {
    value.x = 200;
    value.y = 300;
    value.x_speed = 0;
    value.y_speed = 3;
  }
  if (this.y > 700) {
    computer_score += 1;
    document.getElementById('computerScore').innerHTML = computer_score;
    reset_ball(this);
  } else if (this.y < -100) {
    player_score += 1;
    document.getElementById('playerScore').innerHTML = player_score;
    reset_ball(this);
  }
}

// building each objects
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

// rendering the views
var render = function() {
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

// player paddle moving logic
Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if (this.x < 0) {
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) {
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
};

var keysDown = {};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // when pressing left arrow, the value is 37
      this.paddle.move(-4, 0);
    } else if (value == 39) { // when pressing right arrow, the value is 39
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var update = function() {
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
  player.update();
};

// calling render and animate functions
var step = function() {
  update();
  render();
  animate(step);
};

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};
