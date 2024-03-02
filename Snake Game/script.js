
let direction = { x: 0, y: 0 }; // Stores the snake's current movement direction (x and y coordinates)
let foodsound = new Audio(`music/food.mp3`);
let gameoversound = new Audio(`music/gameover.mp3`); 
let movesound = new Audio(`music/move.mp3`); 
let musicsound = new Audio(`music/music.mp3`); 
let score = 0; // Current game score
let speed = 5; // Initial game speed
let painttime = 0; // Used for animation timing

// Initialize the snake's starting position
let snakearray = [{ x: 3, y: 15 }];

// Initialize the food's starting position
let food = { x: 6, y: 7 };

// Main game loop function
function main(ctime) {
  // Schedule the next animation frame
  window.requestAnimationFrame(main);
  const elapsedTime = (ctime - painttime) / 1000;
  if (elapsedTime < 1 / speed) {
    return;
  }
  painttime = ctime;

  // Execute the game engine logic
  gameEngine();
}

// Function to check if a proposed food placement overlaps with the snake
function isValidFoodPlacement(food, snake) {
  for (const segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      // Overlap detected, return false
      return false;
    }
  }
  // No overlap found, return true
  return true;
}

// Function to check for collision with the wall or the snake itself
function isCollide(snake) {
  // Check for collision with the snake's body (excluding the head)
  for (let i = 1; i < snakearray.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // Check for collision with the walls
  if (
    snake[0].x >= 25 || snake[0].x <= 0 ||  snake[0].y >= 25 || snake[0].y <= 0
  ) {
    return true;
  }
  // No collision detected, return false
  return false;
}

// Core game logic function
function gameEngine() {
  // Check for collision
  if (isCollide(snakearray)) {
    gameoversound.play();
    // Reset game state
    alert('GameOver. Press any key to continue')
    musicsound.pause();
    direction = { x: 0, y: 0 };
    speed = 5;
    snakearray = [{ x: 4, y: 12 }];
    musicsound.play();
    score = 0;

    // Update score display
    scoreBox.innerHTML = 'Score : ' + score;
  }

  // Check if the snake has eaten the food
  if (snakearray[0].y === food.y && snakearray[0].x === food.x) {
    // Increase game speed slightly
    speed += 0.5;
    foodsound.play();
    score += 1;

    // Update high score if needed
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = 'HighScore: ' + hiscoreval;
    }
    // Update score display
    scoreBox.innerHTML = 'Score : ' + score;

    // Add a new segment to the snake's head
    snakearray.unshift({
      x: snakearray[0].x + direction.x,
      y: snakearray[0].y + direction.y,
    });

    do {
      let a = 2; 
      let b = 22; 
      food = {
        x: Math.floor(Math.random() * (b - a + 1)) + a,
        y: Math.floor(Math.random() * (b - a + 1)) + a,
      };
    } while (!isValidFoodPlacement(food, snakearray)); 
  }

  // Move the snake segments
  for (let i = snakearray.length - 2; i >= 0; i--) {
    snakearray[i + 1] = { ...snakearray[i] };
  }

  // Update the head position based on the current direction
  snakearray[0].x += direction.x;
  snakearray[0].y += direction.y;

  // Clear the board element's content
  board.innerHTML = '';

  // Redraw the snake and food elements on the board
  snakearray.forEach((e, index) => {
    snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x; 

    // Add appropriate class for head or regular segment
    if (index === 0) {
      snakeElement.classList.add('head');
    } else {
      snakeElement.classList.add('snake');
    }

    board.appendChild(snakeElement);
  });

  foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x; 
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

// Check and set high score from local storage
let hiscore = localStorage.getItem('hiscore');
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = 'HighScore: ' + hiscoreval;
}

// Start the main game loop animation
window.requestAnimationFrame(main);

// Handle key presses for changing direction
window.addEventListener('keydown', e => {
  musicsound.play();
  movesound.play();

  // Update direction based on the pressed arrow key
  switch (e.key) {
    case 'ArrowUp':
      direction.x = 0;
      direction.y = -1;
      break;
    case 'ArrowDown':
      direction.x = 0;
      direction.y = 1;
      break;
    case 'ArrowLeft':
      direction.x = -1;
      direction.y = 0;
      break;
    case 'ArrowRight':
      direction.x = 1;
      direction.y = 0;
      break;
    default:
      break;
  }
});