'use strice';

let selection = document.querySelector('select');
let result = document.getElementById('difficulty');
var scoreSelect = document.getElementById('score').value;

var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 25;
var ballSpeedY = 7;

var player1Score = 0;
var player2Score = 0;
let WINNING_SCORE;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

var showingWinScreen = false;
var gameStart = true;
var framesPerSecond = 0;

selection.addEventListener('change', () => {
  document.getElementById('button1').disabled = false;
  result.value = selection.options[selection.selectedIndex].value;

  if (result.value === 'Easy') {
    framesPerSecond = 30;
  } else if (result.value === 'Medium') {
    framesPerSecond = 40;
  } else if (result.value === 'Hard') {
    framesPerSecond = 50;
  } else if (result.value === 'Very Hard') {
    framesPerSecond = 60;
  } else {
    framesPerSecond = 30;
  }
});

// Starting Page
function startingPage() {
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  canvasContext.fillText('Click to continue', 350, 500);
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

// run when page loads
window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  document.getElementById('button1').addEventListener('click', function () {
    WINNING_SCORE = scoreSelect;
    if (scoreSelect === '') {
      WINNING_SCORE = 10;
    }
    setInterval(function () {
      document.getElementById('button1').disabled = true;
      document.getElementById('difficulty').disabled = true;
      moveEverything();
      drawEverything();
    }, 1000 / framesPerSecond);
  });

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.width / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 20;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 20;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be BEFORE ball ballReset()
      ballReset();
    }
  }
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be BEFORE ball ballReset()
      ballReset();
    }
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  // next line blanks out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText('Left Player Wins!', 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText('Right Player Wins!', 350, 200);
    }
    canvasContext.fillText('Click to continue', 350, 500);
    return;
  }

  drawNet();

  // this is left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

  // this is right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    'white'
  );

  //this is the ball
  colorCircle(ballX, ballY, 10, 'white');

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
