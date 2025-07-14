

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
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const mainCharElement = document.getElementById('main-char');
        const bgm = document.getElementById('bgm');
        let gameParams = JSON.parse(document.getElementById('game-params')?.textContent || '{}');
        const gameType = document.getElementById('game-type').textContent;

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
        let gameLoop;

        function startMusic() {
            if (bgm && !musicStarted) {
                bgm.play().catch(e => console.log("Audio play failed:", e));
                musicStarted = true;
            }
        }
        
        function initialScreen() {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '40px "Space Grotesk", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(document.title.replace('GameGen - ',''), canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '20px "Space Grotesk", sans-serif';
            ctx.fillText('Tap or press Space to start', canvas.width / 2, canvas.height / 2 + 20);
        }

        function drawScore() {
            ctx.fillStyle = 'white';
            ctx.font = '24px "Space Grotesk", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Score: ' + score, 10, 30);
        }

        function handleRestart() {
            window.location.reload();
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
            
            canvas.addEventListener('click', handleRestart, { once: true });
            canvas.addEventListener('touchstart', handleRestart, { once: true });
        }
        
        function setupGameLogic() {
            switch (gameType) {
              case 'flappy-bird': {
                let bird = { x: 50, y: canvas.height / 2, width: 50, height: 50, velocityY: 0 };
                let pipes = [];
                let frameCount = 0;

                window.jump = function() {
                    if (gameOver || !gameStarted) return;
                    bird.velocityY = gameParams.lift;
                }

                gameLoop = function() {
                  if (gameOver) { 
                      drawGameOver();
                      return;
                  }
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  
                  bird.velocityY += gameParams.gravity;
                  bird.y += bird.velocityY;
                  if (bird.y + bird.height > canvas.height || bird.y < 0) {
                      gameOver = true;
                  }

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
                  requestAnimationFrame(gameLoop);
                }
                break;
              }
              case 'speed-runner': {
                let player = { x: 50, y: canvas.height - 50, width: 50, height: 50, velocityY: 0, onGround: true };
                let obstacles = [];
                let runnerFrame = 0;

                window.runnerJump = function() {
                    if (gameOver || !gameStarted) return;
                    if (player.onGround) {
                        player.velocityY = -20;
                        player.onGround = false;
                    }
                }
                
                gameLoop = function() {
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

                    if(runnerFrame > 50 && Math.random() < gameParams.obstacleFrequency) {
                        obstacles.push({x: canvas.width, width: 30, height: 30});
                    }

                    obstacles.forEach((obs, i) => {
                        obs.x -= gameParams.playerSpeed;
                        const obsY = canvas.height - obs.height;
                        ctx.fillStyle = 'red';
                        ctx.fillRect(obs.x, obsY, obs.width, obs.height);
                        
                        if (player.x < obs.x + obs.width &&
                            player.x + player.width > obs.x &&
                            player.y < obsY + obs.height &&
                            player.y + player.height > obsY) {
                            gameOver = true;
                        }

                        if (obs.x < -obs.width) obstacles.splice(i, 1);
                    });
                    
                    drawScore();
                    requestAnimationFrame(gameLoop);
                }
                break;
              }
              case 'whack-a-mole': {
                let holes = [];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        holes.push({ x: 150 + j * 200, y: 100 + i * 150, visible: false, timer: 0 });
                    }
                }
                let timeLeft = gameParams.gameDuration;
                
                window.whackAt = function(ex, ey) {
                    if (gameOver || !gameStarted) return;
                    holes.forEach(hole => {
                        if (hole.visible && Math.hypot(ex - hole.x, ey - (hole.y - 20)) < 35) {
                            score++;
                            hole.visible = false;
                            hole.timer = 0;
                        }
                    });
                }
                
                let timerInterval;
                window.startTimer = function() {
                    timerInterval = setInterval(() => { 
                        if (!gameOver && gameStarted) { 
                            timeLeft--; 
                            if(timeLeft <= 0) { 
                                timeLeft = 0; 
                                gameOver = true; 
                                clearInterval(timerInterval); 
                            } 
                        } 
                    }, 1000);
                }

                gameLoop = function() {
                    if (gameOver) {
                        drawGameOver();
                        return;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    holes.forEach(hole => {
                        ctx.fillStyle = '#654321';
                        ctx.beginPath();
                        ctx.arc(hole.x, hole.y, 50, 0, Math.PI * 2);
                        ctx.fill();

                        if (hole.timer > 0) {
                           hole.timer -= 16;
                        } else if (hole.visible) {
                            hole.visible = false;
                        }
                        
                        if(!hole.visible && hole.timer <= 0 && Math.random() < 0.01) {
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
                    requestAnimationFrame(gameLoop);
                }
                break;
              }
              case 'match-3': {
                const gridSize = gameParams.gridSize;
                const cellSize = canvas.width / (gridSize + 2);
                const colors = ['#EF4444', '#3B82F6', '#22C55E', '#FBBF24', '#A855F7', '#F97316'].slice(0, gameParams.numColors);
                let grid = [];
                let selected = null;
                let isSwapping = false;

                function createGem(r, c) {
                    return { color: colors[Math.floor(Math.random() * colors.length)], r, c };
                }

                function createGrid() {
                    for (let r = 0; r < gridSize; r++) {
                        grid[r] = [];
                        for (let c = 0; c < gridSize; c++) {
                            grid[r][c] = createGem(r, c);
                        }
                    }
                    if (findMatches().length > 0) createGrid();
                }
                
                function drawGrid() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    for (let r = 0; r < gridSize; r++) {
                        for (let c = 0; c < gridSize; c++) {
                            if (!grid[r][c]) continue;
                            ctx.fillStyle = grid[r][c].color;
                            ctx.fillRect(c * cellSize + cellSize, r * cellSize + cellSize, cellSize - 4, cellSize - 4);
                            if (selected && selected.r === r && selected.c === c) {
                                ctx.strokeStyle = 'white';
                                ctx.lineWidth = 3;
                                ctx.strokeRect(c * cellSize + cellSize, r * cellSize + cellSize, cellSize - 4, cellSize - 4);
                            }
                        }
                    }
                }
                
                function findMatches() {
                    let matches = [];
                    // Horizontal
                    for (let r = 0; r < gridSize; r++) {
                        for (let c = 0; c < gridSize - 2; c++) {
                            if (grid[r][c] && grid[r][c+1] && grid[r][c+2] && grid[r][c].color === grid[r][c+1].color && grid[r][c+1].color === grid[r][c+2].color) {
                                matches.push(grid[r][c], grid[r][c+1], grid[r][c+2]);
                            }
                        }
                    }
                    // Vertical
                    for (let c = 0; c < gridSize; c++) {
                        for (let r = 0; r < gridSize - 2; r++) {
                            if (grid[r][c] && grid[r+1][c] && grid[r+2][c] && grid[r][c].color === grid[r+1][c].color && grid[r+1][c].color === grid[r+2][c].color) {
                                matches.push(grid[r][c], grid[r+1][c], grid[r+2][c]);
                            }
                        }
                    }
                    return [...new Set(matches)]; // Unique matches
                }

                function clearMatches() {
                    const matches = findMatches();
                    if (matches.length === 0) return false;

                    score += matches.length * 10;
                    matches.forEach(gem => {
                        if(grid[gem.r] && grid[gem.r][gem.c]) grid[gem.r][gem.c] = null;
                    });
                    return true;
                }

                function dropGems() {
                    for (let c = 0; c < gridSize; c++) {
                        let emptyRow = gridSize - 1;
                        for (let r = gridSize - 1; r >= 0; r--) {
                            if (grid[r][c]) {
                                if (emptyRow !== r) {
                                    grid[emptyRow][c] = grid[r][c];
                                    grid[emptyRow][c].r = emptyRow;
                                    grid[r][c] = null;
                                }
                                emptyRow--;
                            }
                        }
                    }
                }

                function fillGems() {
                    for (let r = 0; r < gridSize; r++) {
                        for (let c = 0; c < gridSize; c++) {
                            if (!grid[r][c]) {
                                grid[r][c] = createGem(r, c);
                            }
                        }
                    }
                }
                
                async function handleMatches() {
                    isSwapping = true;
                    while (clearMatches()) {
                        await new Promise(res => setTimeout(res, 200));
                        dropGems();
                        fillGems();
                        drawGrid();
                        await new Promise(res => setTimeout(res, 200));
                    }
                    isSwapping = false;
                }

                window.handleClickOrTap = function(e) {
                    if (gameOver || isSwapping || !gameStarted) return;
                    const rect = canvas.getBoundingClientRect();
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                    const c = Math.floor((clientX - rect.left - cellSize) / cellSize);
                    const r = Math.floor((clientY - rect.top - cellSize) / cellSize);

                    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;

                    if (!selected) {
                        selected = {r, c};
                    } else {
                        if(Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1) {
                            [grid[selected.r][selected.c], grid[r][c]] = [grid[r][c], grid[selected.r][selected.c]];
                            if (findMatches().length > 0) {
                                handleMatches();
                            } else {
                                setTimeout(() => {
                                    [grid[selected.r][selected.c], grid[r][c]] = [grid[r][c], grid[selected.r][selected.c]];
                                }, 200);
                            }
                        }
                        selected = null;
                    }
                }

                gameLoop = function() {
                    if(gameOver) { drawGameOver(); return; }
                    drawGrid();
                    drawScore();
                    requestAnimationFrame(gameLoop);
                }

                createGrid();
                break;
              }
              case 'crossy-road': {
                let crossyPlayer = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 30 };
                const laneHeight = canvas.height / (gameParams.lanes + 2);
                let lanes = [];

                for (let i = 0; i < gameParams.lanes; i++) {
                    const type = Math.random() > 0.5 ? 'traffic' : 'log';
                    lanes.push({
                        y: (i + 1) * laneHeight,
                        type: type,
                        speed: (type === 'traffic' ? gameParams.trafficSpeed : gameParams.logSpeed) * (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random()),
                        items: [],
                        nextSpawnTime: 0
                    });
                }
                
                gameLoop = function() {
                    if(gameOver) { 
                        drawGameOver();
                        return;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.fillStyle = '#4CAF50';
                    ctx.fillRect(0, 0, canvas.width, laneHeight);
                    ctx.fillRect(0, canvas.height - laneHeight, canvas.width, laneHeight);

                    let onLog = false;
                    let currentLaneIndex = -1;
                    const playerLaneY = crossyPlayer.y + crossyPlayer.height / 2;
                    if (playerLaneY > laneHeight && playerLaneY < canvas.height - laneHeight) {
                        currentLaneIndex = Math.floor((playerLaneY - laneHeight) / laneHeight);
                    }


                    lanes.forEach((lane, index) => {
                        ctx.fillStyle = lane.type === 'traffic' ? '#555' : '#1E90FF';
                        ctx.fillRect(0, lane.y, canvas.width, lane.height);
                        
                        if (Date.now() > lane.nextSpawnTime) {
                            lane.items.push({
                                x: lane.speed > 0 ? -80 : canvas.width,
                                width: Math.random() * 40 + 40
                            });
                            lane.nextSpawnTime = Date.now() + Math.random() * 4000 + 2000;
                        }

                        lane.items.forEach((item, itemIndex) => {
                            item.x += lane.speed;

                            if((lane.speed > 0 && item.x > canvas.width) || (lane.speed < 0 && item.x < -item.width)) {
                                lane.items.splice(itemIndex, 1);
                            }
                            
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
                                if (crossyPlayer.x + crossyPlayer.width < 0 || crossyPlayer.x > canvas.width) gameOver = true;
                            } else {
                                gameOver = true; // Fell in the water
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
                        crossyPlayer.y = canvas.height - 40;
                        crossyPlayer.x = canvas.width / 2 - 15;
                    }

                    drawScore();
                    requestAnimationFrame(gameLoop);
                }

                window.movePlayer = function(dir) {
                    if (gameOver || !gameStarted) return;
                    if(dir === 'up') crossyPlayer.y -= laneHeight;
                    if(dir === 'down') crossyPlayer.y += laneHeight;
                    if(dir === 'left') crossyPlayer.x -= 30;
                    if(dir === 'right') crossyPlayer.x += 30;
                    crossyPlayer.y = Math.max(0, Math.min(canvas.height - crossyPlayer.height, crossyPlayer.y));
                    crossyPlayer.x = Math.max(0, Math.min(canvas.width - crossyPlayer.width, crossyPlayer.x));
                }
                break;
              }
              default:
                gameLoop = function() {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.fillStyle = 'red';
                  ctx.font = '20px sans-serif';
                  ctx.fillText('Error: Unknown game type "' + gameType + '"', 10, 50);
                };
            }
        }
        
        function handleFirstInput(event) {
            if (gameStarted) return;
            if (event.type === 'keydown' && event.code !== 'Space' && gameType !== 'crossy-road') return;


            event.preventDefault(); 
            gameStarted = true;
            startMusic();
            
            document.removeEventListener('keydown', handleFirstInput);
            canvas.removeEventListener('mousedown', handleFirstInput);
            canvas.removeEventListener('touchstart', handleFirstInput);
            
            if (gameType === 'flappy-bird') {
                canvas.addEventListener('mousedown', window.jump);
                canvas.addEventListener('touchstart', (e) => { e.preventDefault(); window.jump(); });
                document.addEventListener('keydown', (e) => { if (e.code === 'Space') window.jump(); });
                window.jump();
            } else if (gameType === 'speed-runner') {
                canvas.addEventListener('mousedown', window.runnerJump);
                canvas.addEventListener('touchstart', (e) => { e.preventDefault(); window.runnerJump(); }, { passive: false });
                document.addEventListener('keydown', (e) => { if (e.code === 'Space') window.runnerJump(); });
            } else if (gameType === 'whack-a-mole') {
                 canvas.addEventListener('mousedown', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    window.whackAt(e.clientX - rect.left, e.clientY - rect.top);
                });
                canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const rect = canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    window.whackAt(touch.clientX - rect.left, touch.clientY - rect.top);
                });
                window.startTimer();
            } else if (gameType === 'match-3') {
                canvas.addEventListener('mousedown', (e) => window.handleClickOrTap(e));
                canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    window.handleClickOrTap(e);
                });
            } else if (gameType === 'crossy-road') {
                document.addEventListener('keydown', (e) => {
                    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                        e.preventDefault();
                        window.movePlayer(e.code.replace('Arrow', '').toLowerCase());
                    }
                });
                 let touchStartX = 0, touchStartY = 0;
                canvas.addEventListener('touchstart', e => { e.preventDefault(); touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: false });
                canvas.addEventListener('touchend', e => {
                    e.preventDefault();
                    const deltaX = e.changedTouches[0].clientX - touchStartX;
                    const deltaY = e.changedTouches[0].clientY - touchStartY;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) window.movePlayer(deltaX > 0 ? 'right' : 'left');
                    else window.movePlayer(deltaY > 0 ? 'down' : 'up');
                }, { passive: false });
            }

            requestAnimationFrame(gameLoop);
        }
        
        setupGameLogic();
        document.addEventListener('keydown', handleFirstInput);
        canvas.addEventListener('mousedown', handleFirstInput);
        canvas.addEventListener('touchstart', handleFirstInput, { passive: false });
        
        requestAnimationFrame(initialScreen);
    });
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
        body { font-family: 'Inter', sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #23272F; color: white; overflow: hidden; touch-action: none; }
        .canvas-container { width: 100%; max-width: 800px; aspect-ratio: 16 / 9; }
        #game-canvas { border: 2px solid #FFAA5A; background-image: url(${environmentImg}); background-size: cover; background-position: center; image-rendering: pixelated; width: 100%; height: 100%; cursor: pointer; }
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


