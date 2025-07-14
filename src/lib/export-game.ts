
'use client';
import type { GameConfig } from './types';

export function createHtmlContentForGame(config: GameConfig): string {
  const gameTitle = config.template?.name ? `GameGen - ${config.template.name}` : "My AI Game";
  const theme = config.reskinInput?.theme || 'A fun game';
  const mainCharacterDesc = config.reskinInput?.mainCharacter || 'The hero';
  const params = JSON.stringify(config.parameters?.adjusted || config.template?.defaultParams || {});
  const mainCharImg = config.assets?.newMainCharacterImage || 'https://placehold.co/512x512.png';
  const environmentImg = config.assets?.newEnvironmentImage || 'https://placehold.co/800x600.png';
  const musicSrc = config.music?.dataUri || '';
  const gameType = config.template?.id || 'flappy-bird';

  const gameLogic = `
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mainCharElement = document.getElementById('main-char');
    const bgm = document.getElementById('bgm');
    let gameParams = JSON.parse(document.getElementById('game-params')?.textContent || '{}');
    const gameType = document.getElementById('game-type').textContent;

    // Merge with defaults to ensure all keys are present
    const defaultParams = {
        'flappy-bird': { gravity: 0.6, lift: -10, pipeGap: 200, pipeSpeed: 5 },
        'speed-runner': { playerSpeed: 10, obstacleFrequency: 0.02, powerUpFrequency: 0.01 },
        'whack-a-mole': { moleVisibleTime: 800, gameDuration: 30 },
        'match-3': { gridSize: 8, numColors: 6, timeLimit: 60 },
        'crossy-road': { trafficSpeed: 2, logSpeed: 1.5, lanes: 10 }
    };
    gameParams = { ...defaultParams[gameType], ...gameParams };

    let score = 0;
    let gameOver = false;
    let musicStarted = false;
    let gameStarted = false;

    function startMusic() {
        if (bgm && !musicStarted) {
            bgm.play().catch(e => console.log("Audio play failed:", e));
            musicStarted = true;
        }
    }
    
    function initialScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(document.title.replace('GameGen - ',''), canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px "Space Grotesk", sans-serif';
        ctx.fillText('Tap or press Space to start', canvas.width / 2, canvas.height / 2 + 20);
        if (!gameStarted) {
            requestAnimationFrame(initialScreen);
        }
    }

    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = '24px "Space Grotesk", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 10, 30);
    }

    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '50px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px "Space Grotesk", sans-serif';
        ctx.fillText('Tap or refresh to restart', canvas.width / 2, canvas.height / 2 + 40);
    }
    
    let gameLoop;
    
    // --- Game Logic Switch ---
    switch (gameType) {
      case 'flappy-bird':
        let bird = { x: 50, y: canvas.height / 2, width: 50, height: 50, velocityY: 0 };
        let pipes = [];
        let frameCount = 0;

        function jump() {
            startMusic();
            if (gameOver) { window.location.reload(); return; }
            bird.velocityY = gameParams.lift;
        }

        function flappyLoop() {
          if (gameOver) { drawGameOver(); return; }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          bird.velocityY += gameParams.gravity;
          bird.y += bird.velocityY;
          if (bird.y + bird.height > canvas.height || bird.y < 0) gameOver = true;

          if (mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
            ctx.drawImage(mainCharElement, bird.x, bird.y, bird.width, bird.height);
          } else {
            ctx.fillStyle = 'orange';
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
          }
          
          frameCount++;
          if (frameCount % (Math.floor(150 / gameParams.pipeSpeed)) === 0) {
            const pipeY = Math.random() * (canvas.height - gameParams.pipeGap - 100) + 50;
            pipes.push({ x: canvas.width, y: pipeY, passed: false });
          }
          
          pipes.forEach((p, i) => {
            p.x -= gameParams.pipeSpeed;
            ctx.fillStyle = '#22C55E';
            ctx.fillRect(p.x, 0, 80, p.y);
            ctx.fillRect(p.x, p.y + gameParams.pipeGap, 80, canvas.height - p.y - gameParams.pipeGap);

            if (bird.x < p.x + 80 && bird.x + bird.width > p.x && (bird.y < p.y || bird.y + bird.height > p.y + gameParams.pipeGap)) {
              gameOver = true;
            }
            if (p.x + 80 < bird.x && !p.passed) {
                score++;
                p.passed = true;
            }
            if (p.x < -80) pipes.splice(i, 1);
          });
          
          drawScore();
          requestAnimationFrame(flappyLoop);
        }
        document.addEventListener('keydown', (e) => { if (e.code === 'Space') jump(); });
        canvas.addEventListener('mousedown', jump);
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); });
        gameLoop = flappyLoop;
        break;

      case 'speed-runner':
        let player = { x: 50, y: canvas.height - 60, width: 50, height: 50, velocityY: 0, onGround: true };
        let obstacles = [];
        let runnerFrame = 0;

        function runnerJump() {
            startMusic();
            if (gameOver) { window.location.reload(); return; }
            if (player.onGround) {
                player.velocityY = -20;
                player.onGround = false;
            }
        }
        
        function runnerLoop() {
            if(gameOver) { drawGameOver(); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            runnerFrame++;
            score = Math.floor(runnerFrame / 10);

            if (!player.onGround) {
                player.velocityY += 1; // gravity
                player.y += player.velocityY;
                if (player.y >= canvas.height - player.height) {
                    player.y = canvas.height - player.height;
                    player.onGround = true;
                    player.velocityY = 0;
                }
            }

            if (mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
              ctx.drawImage(mainCharElement, player.x, player.y, player.width, player.height);
            } else {
              ctx.fillStyle = 'orange';
              ctx.fillRect(player.x, player.y, player.width, player.height);
            }

            if(runnerFrame > 50 && runnerFrame % Math.floor(100 / (gameParams.playerSpeed * gameParams.obstacleFrequency)) === 0) {
                obstacles.push({x: canvas.width, width: 30, height: 30});
            }

            obstacles.forEach((obs, i) => {
                obs.x -= gameParams.playerSpeed;
                ctx.fillStyle = 'red';
                ctx.fillRect(obs.x, canvas.height - obs.height, obs.width, obs.height);
                if (player.x < obs.x + obs.width && player.x + player.width > obs.x && player.y + player.height > canvas.height - obs.height) {
                    gameOver = true;
                }
                if (obs.x < -obs.width) obstacles.splice(i, 1);
            });
            
            drawScore();
            requestAnimationFrame(runnerLoop);
        }
        document.addEventListener('keydown', (e) => { if (e.code === 'Space') runnerJump(); });
        canvas.addEventListener('mousedown', runnerJump);
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); runnerJump(); });
        gameLoop = runnerLoop;
        break;

      case 'whack-a-mole':
        let holes = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                holes.push({ x: 150 + j * 200, y: 100 + i * 150, visible: false, timer: 0 });
            }
        }
        let timeLeft = gameParams.gameDuration;
        
        function whackAt(x, y) {
            startMusic();
            if (gameOver) { window.location.reload(); return; }
            holes.forEach(hole => {
                if (hole.visible && Math.hypot(x - hole.x, y - (hole.y - 20)) < 35) {
                    score++;
                    hole.visible = false;
                    hole.timer = 0;
                }
            });
        }

        function whackLoop() {
            if (gameOver) { drawGameOver(); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            holes.forEach(hole => {
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.arc(hole.x, hole.y, 50, 0, Math.PI * 2);
                ctx.fill();

                if (hole.timer > 0) {
                   hole.timer -= 16; // approx 1 frame
                } else if (hole.visible) {
                    hole.visible = false;
                }
                
                if(!hole.visible && hole.timer <= 0 && Math.random() < 0.01) { // Chance to pop up
                    hole.visible = true;
                    hole.timer = gameParams.moleVisibleTime;
                }

                if(hole.visible) {
                    if (mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
                      ctx.drawImage(mainCharElement, hole.x - 35, hole.y - 70, 70, 70);
                    } else {
                      ctx.fillStyle = 'brown';
                      ctx.beginPath();
                      ctx.arc(hole.x, hole.y - 20, 35, 0, Math.PI * 2);
                      ctx.fill();
                    }
                }
            });
            
            ctx.fillStyle = 'white';
            ctx.font = '24px "Space Grotesk", sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('Time: ' + Math.ceil(timeLeft), canvas.width - 10, 30);
            
            drawScore();
            requestAnimationFrame(whackLoop);
        }
        
        let timerInterval = setInterval(() => { if (!gameOver && gameStarted) { timeLeft--; if(timeLeft <= 0) { timeLeft = 0; gameOver = true; clearInterval(timerInterval); } } }, 1000);

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            whackAt(e.clientX - rect.left, e.clientY - rect.top);
        });
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            whackAt(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        gameLoop = whackLoop;
        break;

      case 'match-3':
        const gridSize = gameParams.gridSize;
        const cellSize = canvas.width / (gridSize + 2);
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'].slice(0, gameParams.numColors);
        let grid = [];
        let selected = null;

        function createGrid() {
            for (let r = 0; r < gridSize; r++) {
                grid[r] = [];
                for (let c = 0; c < gridSize; c++) {
                    grid[r][c] = { color: colors[Math.floor(Math.random() * colors.length)], r, c };
                }
            }
        }
        
        function drawGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    ctx.fillStyle = grid[r][c].color;
                    ctx.fillRect(c * cellSize + cellSize, r * cellSize + cellSize, cellSize - 2, cellSize - 2);
                    if (selected && selected.r === r && selected.c === c) {
                        ctx.strokeStyle = 'white';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(c * cellSize + cellSize, r * cellSize + cellSize, cellSize - 2, cellSize - 2);
                    }
                }
            }
        }
        
        function matchLoop() {
            if(gameOver) { drawGameOver(); return; }
            drawGrid();
            drawScore();
            requestAnimationFrame(matchLoop);
        }

        function findMatches() { /* Complex logic omitted for brevity */ }
        
        function handleClickOrTap(x, y) {
            startMusic();
            if (gameOver) { window.location.reload(); return; }
            const rect = canvas.getBoundingClientRect();
            const c = Math.floor((x - rect.left - cellSize) / cellSize);
            const r = Math.floor((y - rect.top - cellSize) / cellSize);

            if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;

            if (!selected) {
                selected = {r, c};
            } else {
                if(Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1) {
                    [grid[selected.r][selected.c], grid[r][c]] = [grid[r][c], grid[selected.r][selected.c]]; // Swap
                    score += 10; // Simplified scoring
                }
                selected = null;
            }
        }

        canvas.addEventListener('mousedown', (e) => handleClickOrTap(e.clientX, e.clientY));
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleClickOrTap(e.touches[0].clientX, e.touches[0].clientY);
        });

        createGrid();
        gameLoop = matchLoop;
        break;

      case 'crossy-road':
        let crossyPlayer = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 30 };
        const laneHeight = canvas.height / (gameParams.lanes + 2);
        let lanes = [];

        for (let i = 0; i < gameParams.lanes; i++) {
            const type = Math.random() > 0.5 ? 'traffic' : 'log';
            lanes.push({
                y: (i + 1) * laneHeight,
                type: type,
                speed: (type === 'traffic' ? gameParams.trafficSpeed : gameParams.logSpeed) * (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random()),
                items: [{x: Math.random() * canvas.width, width: 80}]
            });
        }
        
        function crossyLoop() {
            if(gameOver) { drawGameOver(); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#4CAF50'; // Safe zones
            ctx.fillRect(0, 0, canvas.width, laneHeight);
            ctx.fillRect(0, canvas.height - laneHeight, canvas.width, laneHeight);

            let onLog = false;
            let currentLaneIndex = -1;

            lanes.forEach((lane, index) => {
                ctx.fillStyle = lane.type === 'traffic' ? '#555' : '#1E90FF';
                ctx.fillRect(0, lane.y, canvas.width, lane.height);
                
                if (crossyPlayer.y >= lane.y && crossyPlayer.y < lane.y + laneHeight) {
                    currentLaneIndex = index;
                }

                lane.items.forEach(item => {
                    item.x += lane.speed;
                    if(lane.speed > 0 && item.x > canvas.width) item.x = -item.width;
                    if(lane.speed < 0 && item.x < -item.width) item.x = canvas.width;
                    
                    ctx.fillStyle = lane.type === 'traffic' ? 'yellow' : '#8B4513';
                    ctx.fillRect(item.x, lane.y + laneHeight / 2 - 15, item.width, 30);
                    
                    if (currentLaneIndex === index && crossyPlayer.x < item.x + item.width && crossyPlayer.x + crossyPlayer.width > item.x) {
                        if (lane.type === 'traffic') gameOver = true;
                        if (lane.type === 'log') onLog = true;
                    }
                });
            });
            
            if (currentLaneIndex !== -1) {
                const currentLane = lanes[currentLaneIndex];
                if (currentLane.type === 'log') {
                    if (onLog) {
                        crossyPlayer.x += currentLane.speed;
                    } else {
                        gameOver = true; // Fell in water
                    }
                }
            }


            if (mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
              ctx.drawImage(mainCharElement, crossyPlayer.x, crossyPlayer.y, crossyPlayer.width, crossyPlayer.height);
            } else {
              ctx.fillStyle = 'orange';
              ctx.fillRect(crossyPlayer.x, crossyPlayer.y, crossyPlayer.width, crossyPlayer.height);
            }
            
            if(crossyPlayer.y < laneHeight && !gameOver) {
                score++;
                crossyPlayer.y = canvas.height - 40; // Reset to start
                crossyPlayer.x = canvas.width / 2 - 15;
            }

            drawScore();
            requestAnimationFrame(crossyLoop);
        }

        function movePlayer(dir) {
            startMusic();
            if(gameOver) { window.location.reload(); return; }
            if(dir === 'up') crossyPlayer.y -= laneHeight;
            if(dir === 'down') crossyPlayer.y += laneHeight;
            if(dir === 'left') crossyPlayer.x -= 30;
            if(dir === 'right') crossyPlayer.x += 30;
            crossyPlayer.y = Math.max(0, Math.min(canvas.height - crossyPlayer.height, crossyPlayer.y));
            crossyPlayer.x = Math.max(0, Math.min(canvas.width - crossyPlayer.width, crossyPlayer.x));
        }

        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
                movePlayer(e.code.replace('Arrow', '').toLowerCase());
            }
        });
        
        let touchStartX = 0;
        let touchStartY = 0;
        canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });
        canvas.addEventListener('touchend', e => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) movePlayer('right');
                else movePlayer('left');
            } else {
                if (deltaY > 0) movePlayer('down');
                else movePlayer('up');
            }
        }, { passive: false });

        gameLoop = crossyLoop;
        break;

      default:
        gameLoop = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'red';
          ctx.font = '20px sans-serif';
          ctx.fillText('Error: Unknown game type "' + gameType + '"', 10, 50);
        };
    }

    function handleFirstInput() {
        if (!gameStarted) {
            gameStarted = true;
            if (gameLoop) {
                gameLoop();
            }
            // Remove this listener so it doesn't interfere with game-specific controls
            document.removeEventListener('keydown', handleFirstInputKey);
            canvas.removeEventListener('mousedown', handleFirstInput);
            canvas.removeEventListener('touchstart', handleFirstInput);
        }
    }
    
    function handleFirstInputKey(e) {
        if (e.code === 'Space') {
            handleFirstInput();
        }
    }

    document.addEventListener('keydown', handleFirstInputKey);
    canvas.addEventListener('mousedown', handleFirstInput);
    canvas.addEventListener('touchstart', handleFirstInput);
    
    // Using requestAnimationFrame to ensure the canvas is ready for drawing
    requestAnimationFrame(initialScreen);
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <title>${gameTitle}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #23272F; color: white; overflow: hidden; touch-action: none; }
        #game-canvas { border: 2px solid #FFAA5A; background-image: url(${environmentImg}); background-size: cover; background-position: center; image-rendering: pixelated; width: 100%; height: 100%; }
        .canvas-container { width: 100%; max-width: 800px; aspect-ratio: 16 / 9; }
        img { display: none; }
        h1 { display:none; }
      </style>
    </head>
    <body>
      <h1>${theme} starring ${mainCharacterDesc}</h1>
      <div class="canvas-container">
        <canvas id="game-canvas" width="800" height="450"></canvas>
      </div>
      <img id="main-char" src="${mainCharImg}" />
      ${musicSrc ? `<audio id="bgm" src="${musicSrc}" loop></audio>` : ''}
      <div id="game-type" style="display: none;">${gameType}</div>
      <script id="game-params" type="application/json">${params}</script>
      <script>${gameLogic}</script>
    </body>
    </html>
  `;
}

export function exportGameAsHtml(htmlContent: string, config: GameConfig) {
  if (typeof window === 'undefined' || !config.template) {
    console.error("Export can only be done on the client side with a selected template.");
    return;
  }

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.template.id}-game.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
