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
import { ref, onMounted } from 'vue';

const currentScore = ref(0);
const bestScore = ref(0);

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

  const flyingObstacleImage = new Image();
  flyingObstacleImage.src = '/src/assets/flying-obstacle.png';

  dinoImage.onload = () => {
    canvas.width = 600;
    canvas.height = 300;

    let dinoX = 50;
    let dinoY = canvas.height - 60;
    let isJumping = false;
    let jumpHeight = 0;

    const gameSpeed = 3;
    let isGameOver = false;
    let isPaused = false;

    interface Obstacle {
      x: number;
      y: number;
      width: number;
      height: number;
      type: 'ground' | 'flying';
    }

    const obstacles: Obstacle[] = [];
    let obstacleSpawnCooldown = Math.floor(Math.random() * 2000) + 1000;
    let lastObstacleSpawnTime = 0;

    function drawDino() {
      ctx!.drawImage(dinoImage, dinoX, dinoY - jumpHeight, 40, 40);
    }

    function drawObstacles() {
      obstacles.forEach((obstacle) => {
        if (obstacle.type === 'flying') {
          ctx!.drawImage(
            flyingObstacleImage,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
          );
          return;
        } else if (obstacle.type === 'ground') {
          ctx!.drawImage(
            obstaclrImage,
            obstacle.x,
            canvas!.height - obstacle.height - 20,
            obstacle.width,
            obstacle.height
          );
        }
      });
    }


    function drawGround() {
      ctx!.strokeStyle = 'white';
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(0, canvas!.height - 20);
      ctx!.lineTo(canvas!.width, canvas!.height - 20);
      ctx!.stroke();
    }

    function drawScores() {
      ctx!.font = '20px Arial';
      ctx!.fillStyle = 'white';
      ctx!.textAlign = 'left';
      ctx!.fillText(`Score: ${currentScore.value}`, 10, 30);
      ctx!.fillText(`Best Score: ${bestScore.value}`, 200, 30);
    }

    function updateObstacles() {
      const currentTime = performance.now();

      if (currentTime - lastObstacleSpawnTime > obstacleSpawnCooldown) {
        const isFlying = currentScore.value < 5 ? false : Math.random() > 0.70;
        const newObstacle: Obstacle = {
          x: canvas!.width,
          width: isFlying ? 40 : 20,
          height: isFlying ? 30 : Math.floor(Math.random() * 30) + 30,
          type: isFlying ? 'flying' : 'ground',
          y: isFlying
            ? Math.floor(Math.random() * (200 - 160 + 1)) + 160
            : canvas!.height - 20,
        };
        obstacles.push(newObstacle);
        lastObstacleSpawnTime = currentTime;
        obstacleSpawnCooldown = Math.floor(Math.random() * 2000) + 1000;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
          currentScore.value++;
        }
      }
    }


    function detectCollision() {
      const dinoBottom = dinoY - jumpHeight + 40;

      obstacles.forEach((obstacle) => {
        const obstacleTop = obstacle.type === 'flying' ? obstacle.y : canvas!.height - obstacle.height;

        if (
          dinoX < obstacle.x + obstacle.width &&
          dinoX + 40 > obstacle.x &&
          dinoBottom > obstacleTop &&
          (obstacle.type === 'ground' || dinoY - jumpHeight < obstacle.y + obstacle.height)
        ) {
          isGameOver = true;
        }
      });
    }


    function updateGame() {
      if (!ctx || isGameOver || isPaused) {
        if (isPaused) {
          showPauseMessage();
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

      updateObstacles();
      drawGround();
      drawDino();
      drawObstacles();
      drawScores();
      detectCollision();

      if (!isGameOver) {
        requestAnimationFrame(updateGame);
      } else {
        if (currentScore.value > bestScore.value) {
          bestScore.value = currentScore.value;
        }
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
      obstacles.length = 0;
      currentScore.value = 0;
      jumpHeight = 0;
      isPaused = false;
      lastObstacleSpawnTime = 0;
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
