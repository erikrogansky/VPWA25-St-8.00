<template>
  <q-layout view="hHh lpr fff">
    <HeaderLayout />

    <q-page-container style="height: 100vh;">
      <div class="offline-container">
        <div style="display: inline"><label class="title q-label">Oops, you're offline! </label><label style="font-size: 34px;">😟</label></div>
        <p class="paragraph">
          It seems you’ve lost connection. While we wait to get you back online, why not play a little game? 🎮
        </p>
        <canvas id="gameCanvas" class="game-canvas"></canvas>
      </div>
    </q-page-container>

    <FooterLayout />
  </q-layout>
</template>

<script scoped setup lang="ts">
import HeaderLayout from 'src/components/HeaderLayout.vue';
import FooterLayout from 'src/components/FooterLayout.vue';
import { onMounted } from 'vue';

onMounted(() => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas 2D context');
    return;
  }

  const dinoImage = new Image();
  dinoImage.src = '/src/assets/dino.png';

  const obstaclrImage = new Image();
  obstaclrImage.src = '/src/assets/obstacle.png';

  dinoImage.onload = () => {
    canvas.width = 600;
    canvas.height = 300;

    let dinoX = 50;
    let dinoY = canvas.height - 60;
    let isJumping = false;
    let jumpHeight = 0;

    const obstacleWidth = 20;
    const obstacleHeight = 40;
    let currentObstacleX = canvas.width;
    let gameSpeed = 3;
    let isGameOver = false;
    let isPaused = false; // Flag to handle pause state

    function drawDino() {
      ctx!.drawImage(dinoImage, dinoX, dinoY - jumpHeight, 40, 40); // Adjust size as needed
    }

    function drawObstacle() {
      const groundY = canvas!.height - 20; // Ground level
      const obstacleY = groundY - obstacleHeight; // Corrected Y-coordinate for the obstacle
      ctx!.drawImage(obstaclrImage, currentObstacleX, obstacleY, obstacleWidth, obstacleHeight);
    }


    function drawGround() {
      ctx!.strokeStyle = 'white';
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(0, canvas!.height - 20);
      ctx!.lineTo(canvas!.width, canvas!.height - 20);
      ctx!.stroke();
    }

    function detectCollision() {
      const dinoBottom = dinoY - jumpHeight + 40;
      const obstacleTop = canvas!.height - obstacleHeight;

      if (
        dinoX < currentObstacleX + obstacleWidth &&
        dinoX + 40 > currentObstacleX &&
        dinoBottom > obstacleTop
      ) {
        isGameOver = true;
      }
    }

    function updateGame() {
      if (!ctx || isGameOver || isPaused) {
        if (isPaused) {
          showPauseMessage(); // Show pause message if paused
        }
        return;
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      if (isJumping) {
        jumpHeight += 5;
        if (jumpHeight >= 100) isJumping = false;
      } else if (jumpHeight > 0) {
        jumpHeight -= 5;
      }

      currentObstacleX -= gameSpeed;
      if (currentObstacleX + obstacleWidth < 0) {
        currentObstacleX = canvas!.width;
      }

      drawGround();
      drawDino();
      drawObstacle();
      detectCollision();

      if (!isGameOver) {
        requestAnimationFrame(updateGame);
      } else {
        showGameOver();
      }
    }

    function showPauseMessage() {
      ctx!.font = '30px Arial';
      ctx!.fillStyle = 'white';
      ctx!.textAlign = 'center';
      ctx!.fillText('Game Paused', canvas!.width / 2, canvas!.height / 2);
      ctx!.fillText('Press ESC to Resume', canvas!.width / 2, canvas!.height / 2 + 40);
    }

    function showGameOver() {
      ctx!.font = '30px Arial';
      ctx!.fillStyle = 'white';
      ctx!.textAlign = 'center';
      ctx!.fillText('Game Over', canvas!.width / 2, canvas!.height / 2);
      ctx!.fillText('Press R to Restart', canvas!.width / 2, canvas!.height / 2 + 40);
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Space' && jumpHeight === 0 && !isGameOver && !isPaused) {
        isJumping = true;
      } else if (e.code === 'KeyR' && isGameOver) {
        resetGame();
      } else if (e.code === 'Escape') {
        isPaused = !isPaused;
        if (!isPaused) {
          updateGame();
        }
      }
    });

    function resetGame() {
      isGameOver = false;
      currentObstacleX = canvas!.width;
      jumpHeight = 0;
      isPaused = false;
      updateGame();
    }

    updateGame();
  };
});
</script>


<style scoped lang="scss">
.offline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: var(--primary);

  .title {
    font-size: 36px;
    font-weight: bold;
    background: var(--title);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
  }

  .paragraph {
    font-size: 18px;
    margin-bottom: 30px;
  }

  .game-canvas {
    background: var(--primary);
    width: 100%;
    max-width: 600px;
    height: 300px;
  }
}
</style>
