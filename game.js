const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Player spaceship properties
const spaceship = {
  x: WIDTH / 2 - 20,
  y: HEIGHT - 60,
  width: 40,
  height: 40,
  speed: 5,
  bullets: []
};

// Chicken enemy properties
const chickens = [];
const chickenWidth = 40;
const chickenHeight = 40;
const chickenSpeed = 2;

// Controls
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

// Setup the game loop
let lastChickenSpawn = 0;
let gameInterval = setInterval(gameLoop, 16); // ~60 FPS

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') leftPressed = true;
  if (e.code === 'ArrowRight') rightPressed = true;
  if (e.code === 'Space') spacePressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') leftPressed = false;
  if (e.code === 'ArrowRight') rightPressed = false;
  if (e.code === 'Space') spacePressed = false;
});

// Functions for drawing objects
function drawSpaceship() {
  ctx.fillStyle = 'cyan';
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawChickens() {
  ctx.fillStyle = 'red';
  chickens.forEach(chicken => {
    ctx.fillRect(chicken.x, chicken.y, chickenWidth, chickenHeight);
  });
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  spaceship.bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  });
}

// Functions for updating objects
function updateSpaceship() {
  if (leftPressed && spaceship.x > 0) spaceship.x -= spaceship.speed;
  if (rightPressed && spaceship.x < WIDTH - spaceship.width) spaceship.x += spaceship.speed;
}

function updateChickens() {
  chickens.forEach(chicken => {
    chicken.y += chickenSpeed;
  });

  // Remove chickens that have gone off-screen
  for (let i = chickens.length - 1; i >= 0; i--) {
    if (chickens[i].y > HEIGHT) chickens.splice(i, 1);
  }
}

function updateBullets() {
  spaceship.bullets.forEach(bullet => {
    bullet.y -= 10;
  });

  // Remove bullets that have gone off-screen
  spaceship.bullets = spaceship.bullets.filter(bullet => bullet.y > 0);
}

function spawnChicken() {
  const x = Math.random() * (WIDTH - chickenWidth);
  chickens.push({ x, y: -chickenHeight });
}

// Collision detection
function detectCollisions() {
  for (let i = chickens.length - 1; i >= 0; i--) {
    const chicken = chickens[i];

    // Check for collision with bullets
    for (let j = spaceship.bullets.length - 1; j >= 0; j--) {
      const bullet = spaceship.bullets[j];
      if (
        bullet.x < chicken.x + chickenWidth &&
        bullet.x + 5 > chicken.x &&
        bullet.y < chicken.y + chickenHeight &&
        bullet.y + 10 > chicken.y
      ) {
        // Remove bullet and chicken on collision
        spaceship.bullets.splice(j, 1);
        chickens.splice(i, 1);
        break;
      }
    }

    // Check for collision with spaceship
    if (
      chicken.x < spaceship.x + spaceship.width &&
      chicken.x + chickenWidth > spaceship.x &&
      chicken.y < spaceship.y + spaceship.height &&
      chicken.y + chickenHeight > spaceship.y
    ) {
      // End the game if a chicken hits the spaceship
      clearInterval(gameInterval);
      alert("Game Over!");
      return;
    }
  }
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Update game state
  updateSpaceship();
  updateChickens();
  updateBullets();
  detectCollisions();

  // Spawn chickens periodically
  if (Date.now() - lastChickenSpawn > 1000) {
    spawnChicken();
    lastChickenSpawn = Date.now();
  }

  // Fire bullets
  if (spacePressed) {
    spaceship.bullets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y });
    spacePressed = false; // Limit to one shot per space press
  }

  // Draw everything
  drawSpaceship();
  drawChickens();
  drawBullets();
}
