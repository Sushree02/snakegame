const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval;

highScoreDisplay.textContent = highScore;

// Create game grid
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
}

function draw() {
  const cells = board.getElementsByClassName("cell");
  Array.from(cells).forEach(cell => cell.classList.remove("snake", "food"));

  snake.forEach(segment => {
    const index = segment.y * boardSize + segment.x;
    cells[index].classList.add("snake");
  });

  const foodIndex = food.y * boardSize + food.x;
  cells[foodIndex].classList.add("food");
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check wall collision
  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    gameOver();
    return;
  }

  // Check self collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
      highScoreDisplay.textContent = highScore;
    }
    food = generateFood();
  } else {
    snake.pop();
  }

  draw();
}

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  return newFood;
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your Score: ${score}`);
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.textContent = score;
  draw();
}

function startGame() {
  clearInterval(gameInterval);
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  scoreDisplay.textContent = score;
  food = generateFood();
  gameInterval = setInterval(() => {
    moveSnake();
  }, 150);
}

function resetHighScore() {
  localStorage.removeItem("snakeHighScore");
  highScore = 0;
  highScoreDisplay.textContent = highScore;
}

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y !== 1) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y !== -1) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x !== 1) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x !== -1) direction = { x: 1, y: 0 };
      break;
  }
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetHighScore);

createBoard();
draw();