
'use client';
import type { GameConfig } from './types';

export function createHtmlContentForGame(config: GameConfig): string {
  const gameTitle = config.template?.name ? `GameGen - ${config.template.name}` : "My AI Game";
  const theme = config.reskinInput?.theme || 'A fun game';
  const mainCharacterDesc = config.reskinInput?.mainCharacter || 'The hero';
  const params = JSON.stringify(config.parameters?.adjusted || config.template?.defaultParams || {});
  const mainCharImg = config.assets?.newMainCharacterImage || '';
  const environmentImg = config.assets?.newEnvironmentImage || 'https://placehold.co/800x600.png';
  const musicSrc = config.music?.dataUri || '';
  const gameType = config.template?.id || 'flappy-bird';

  const gameLogic = `
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mainCharElement = document.getElementById('main-char');
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

    function drawTitle() {
      ctx.fillStyle = 'white';
      ctx.font = '30px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(document.title, canvas.width / 2, 40);
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
        ctx.fillText('Refresh to restart', canvas.width / 2, canvas.height / 2 + 40);
    }
    
    let gameLoop;
    
    // --- Game Logic Switch ---
    switch (gameType) {
      case 'flappy-bird':
        let bird = { x: 50, y: canvas.height / 2, width: 50, height: 50, velocityY: 0 };
        let pipes = [];
        let frameCount = 0;

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
            pipes.push({ x: canvas.width, y: pipeY });
          }
          
          pipes.forEach((p, i) => {
            p.x -= gameParams.pipeSpeed;
            ctx.fillStyle = '#73BF2E';
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
        document.addEventListener('keydown', (e) => { if (e.code === 'Space') bird.velocityY = gameParams.lift; });
        gameLoop = flappyLoop;
        break;

      case 'speed-runner':
        let player = { x: 50, y: canvas.height - 60, width: 50, height: 50, velocityY: 0, onGround: true };
        let obstacles = [];
        let runnerFrame = 0;
        
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

            if(runnerFrame % Math.floor(100 / gameParams.playerSpeed / (gameParams.obstacleFrequency * 100)) === 0) {
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
        document.addEventListener('keydown', (e) => { if (e.code === 'Space' && player.onGround) { player.velocityY = -20; player.onGround = false; } });
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

        function whackLoop() {
            if (gameOver) { drawGameOver(); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            holes.forEach(hole => {
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.arc(hole.x, hole.y, 50, 0, Math.PI * 2);
                ctx.fill();

                if (hole.timer > 0) {
                   hole.timer -= 16;
                } else {
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
        
        let timerInterval = setInterval(() => { if (!gameOver) timeLeft--; if(timeLeft <= 0) { gameOver = true; clearInterval(timerInterval); } }, 1000);

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            holes.forEach(hole => {
                if (hole.visible && Math.hypot(mouseX - hole.x, mouseY - (hole.y - 20)) < 35) {
                    score++;
                    hole.visible = false;
                    hole.timer = 0;
                }
            });
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
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const c = Math.floor((e.clientX - rect.left - cellSize) / cellSize);
            const r = Math.floor((e.clientY - rect.top - cellSize) / cellSize);

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
        });

        createGrid();
        gameLoop = matchLoop;
        break;

      case 'crossy-road':
        let crossyPlayer = { x: canvas.width / 2, y: canvas.height - 40, width: 30, height: 30 };
        let lanes = [];
        const laneHeight = canvas.height / (gameParams.lanes + 1);

        for (let i = 0; i < gameParams.lanes; i++) {
            const type = Math.random() > 0.5 ? 'traffic' : 'log';
            lanes.push({
                y: i * laneHeight + laneHeight,
                type: type,
                speed: (type === 'traffic' ? gameParams.trafficSpeed : gameParams.logSpeed) * (Math.random() > 0.5 ? 1 : -1),
                items: [{x: Math.random() * canvas.width, width: 80}]
            });
        }
        
        function crossyLoop() {
            if(gameOver) { drawGameOver(); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#4CAF50'; // Safe zone
            ctx.fillRect(0, canvas.height - laneHeight, canvas.width, laneHeight);
            ctx.fillRect(0, 0, canvas.width, laneHeight);

            lanes.forEach(lane => {
                ctx.fillStyle = lane.type === 'traffic' ? '#555' : '#1E90FF';
                ctx.fillRect(0, lane.y - laneHeight / 2, canvas.width, lane.height);
                
                let onLog = false;
                lane.items.forEach(item => {
                    item.x += lane.speed;
                    if(lane.speed > 0 && item.x > canvas.width + item.width) item.x = -item.width;
                    if(lane.speed < 0 && item.x < -item.width) item.x = canvas.width;
                    
                    ctx.fillStyle = lane.type === 'traffic' ? 'yellow' : '#8B4513';
                    ctx.fillRect(item.x, lane.y - 15, item.width, 30);
                    
                    if (crossyPlayer.y > lane.y - laneHeight / 2 && crossyPlayer.y < lane.y + laneHeight / 2) {
                        if (crossyPlayer.x < item.x + item.width && crossyPlayer.x + crossyPlayer.width > item.x) {
                           if (lane.type === 'traffic') gameOver = true;
                           if (lane.type === 'log') onLog = true;
                        }
                    }
                });
                
                if (lane.type === 'log' && crossyPlayer.y > lane.y - laneHeight / 2 && crossyPlayer.y < lane.y + laneHeight / 2) {
                    if (onLog) {
                       crossyPlayer.x += lane.speed;
                    } else {
                       gameOver = true;
                    }
                }
            });

            if (mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
              ctx.drawImage(mainCharElement, crossyPlayer.x, crossyPlayer.y, crossyPlayer.width, crossyPlayer.height);
            } else {
              ctx.fillStyle = 'orange';
              ctx.fillRect(crossyPlayer.x, crossyPlayer.y, crossyPlayer.width, crossyPlayer.height);
            }
            
            if(crossyPlayer.y < laneHeight && !gameOver) {
                score++;
                crossyPlayer.y = canvas.height - 40; // Reset
            }

            drawScore();
            requestAnimationFrame(crossyLoop);
        }

        document.addEventListener('keydown', (e) => {
            if(gameOver) return;
            if(e.code === 'ArrowUp') crossyPlayer.y -= laneHeight;
            if(e.code === 'ArrowDown') crossyPlayer.y += laneHeight;
            if(e.code === 'ArrowLeft') crossyPlayer.x -= 30;
            if(e.code === 'ArrowRight') crossyPlayer.x += 30;
            crossyPlayer.y = Math.max(0, Math.min(canvas.height - crossyPlayer.height, crossyPlayer.y));
            crossyPlayer.x = Math.max(0, Math.min(canvas.width - crossyPlayer.width, crossyPlayer.x));
        });

        gameLoop = crossyLoop;
        break;

      default:
        let x = 50;
        let y = canvas.height / 2;
        gameLoop = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          x = (x + 2) % (canvas.width - 50);
          if (mainCharElement && mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
            ctx.drawImage(mainCharElement, x, y, 50, 50);
          } else {
            ctx.fillStyle = 'orange';
            ctx.fillRect(x, y, 50, 50);
          }
          drawTitle();
          requestAnimationFrame(gameLoop);
        };
    }


    function startGame() {
      document.getElementById('bgm')?.play().catch(e => console.log("Audio play failed:", e));
      gameLoop();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(startGame, 1);
    } else {
        document.addEventListener('DOMContentLoaded', startGame);
    }
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${gameTitle}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #23272F; color: white; overflow: hidden; }
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
