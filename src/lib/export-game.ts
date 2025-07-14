'use client';
import type { GameConfig } from './types';

function createHtmlTemplate(config: GameConfig): string {
  const gameTitle = config.template?.name ? `GameGen - ${config.template.name}` : "My AI Game";
  const theme = config.reskinInput?.theme || 'A fun game';
  const mainCharacterDesc = config.reskinInput?.mainCharacter || 'The hero';
  const params = JSON.stringify(config.parameters?.adjusted || config.template?.defaultParams || {});
  const mainCharImg = config.assets?.newMainCharacterImage || '';
  const environmentImg = config.assets?.newEnvironmentImage || 'https://placehold.co/800x600.png';
  const musicSrc = config.music?.dataUri || '';

  // Basic game logic placeholder - this would be replaced with actual game engine code for each template
  const gameLogic = `
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const mainCharElement = document.getElementById('main-char');
    const gameParams = JSON.parse(document.getElementById('game-params').textContent);
    let x = 50;
    let y = canvas.height / 2;
    let velocityY = 0;

    function gameLoop() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Game logic based on template
      if (gameParams.gravity) { // Flappy bird like
        velocityY += gameParams.gravity;
        y += velocityY;
        if (y > canvas.height - 50 || y < 0) {
          y = canvas.height / 2;
          velocityY = 0;
        }
      } else if (gameParams.playerSpeed) { // Runner like
         x = (x + gameParams.playerSpeed) % canvas.width;
      } else { // Generic
         x = (x + 2) % (canvas.width - 50);
      }
      
      // Draw character
      if (mainCharElement.complete && mainCharElement.naturalHeight !== 0) {
        ctx.drawImage(mainCharElement, x, y, 50, 50);
      } else {
        ctx.fillStyle = 'orange';
        ctx.fillRect(x, y, 50, 50);
      }

      // Draw title
      ctx.fillStyle = 'white';
      ctx.font = '30px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(document.title, canvas.width / 2, 40);

      requestAnimationFrame(gameLoop);
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && gameParams.lift) {
        velocityY = gameParams.lift;
      }
    });

    window.onload = () => {
      document.getElementById('bgm')?.play().catch(e => console.log("Audio play failed:", e));
      gameLoop();
    };
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
        #game-canvas { border: 2px solid #FFAA5A; background-image: url(${environmentImg}); background-size: cover; background-position: center; image-rendering: pixelated; }
        img { display: none; }
        h1 { font-family: "Space Grotesk", sans-serif; color: #FFAA5A; margin-bottom: 1rem; }
      </style>
    </head>
    <body>
      <h1>${theme} starring ${mainCharacterDesc}</h1>
      <canvas id="game-canvas" width="800" height="600"></canvas>
      <img id="main-char" src="${mainCharImg}" />
      ${musicSrc ? `<audio id="bgm" src="${musicSrc}" loop></audio>` : ''}
      <script id="game-params" type="application/json">${params}</script>
      <script>${gameLogic}</script>
    </body>
    </html>
  `;
}

export function exportGameAsHtml(config: GameConfig) {
  if (typeof window === 'undefined' || !config.template) {
    console.error("Export can only be done on the client side with a selected template.");
    return;
  }

  const htmlContent = createHtmlTemplate(config);
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
