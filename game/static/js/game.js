(function () {
  "use strict";

  const COLS = 24;
  const ROWS = 18;
  const CELL = 24;
  const INITIAL_LEN = 3;
  const WORDS_FOR_POEM = 8;
  const SCORE_PER_WORD = 10;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const overlayText = document.getElementById("overlayText");
  const scoreEl = document.getElementById("score");
  const lengthEl = document.getElementById("length");
  const wordCountEl = document.getElementById("wordCount");
  const wordBox = document.getElementById("wordBox");
  const poemPanel = document.getElementById("poemPanel");
  const poemText = document.getElementById("poemText");
  const btnStart = document.getElementById("btnStart");
  const btnRestart = document.getElementById("btnRestart");
  const speedLabel = document.getElementById("speedLabel");
  const speedButtonsEl = document.getElementById("speedButtons");

  let speed = 5;
  let tickMs = 275;
  let timer = null;
  let state = "idle"; // idle | playing | paused | gameover | poem

  let snake = [];
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let food = null;
  let score = 0;
  let collectedWords = [];

  const OPPOSITE = {
    "1,0": "-1,0",
    "-1,0": "1,0",
    "0,1": "0,-1",
    "0,-1": "0,1",
  };

  function speedToMs(level) {
    return Math.round(520 - (level - 1) * 47);
  }

  function initSpeedButtons() {
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "speed-btn" + (i === speed ? " active" : "");
      btn.textContent = i;
      btn.dataset.level = i;
      btn.addEventListener("click", () => setSpeed(i));
      speedButtonsEl.appendChild(btn);
    }
    speedLabel.textContent = speed;
    tickMs = speedToMs(speed);
  }

  function setSpeed(level) {
    if (state === "playing") return;
    speed = level;
    tickMs = speedToMs(speed);
    speedLabel.textContent = speed;
    document.querySelectorAll(".speed-btn").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.level) === speed);
    });
  }

  function setOverlay(text, kind) {
    if (!text) {
      overlay.classList.add("hidden");
      overlayText.className = "overlay-text";
      return;
    }
    overlayText.textContent = text;
    overlayText.className = "overlay-text" + (kind ? " " + kind : "");
    overlay.classList.remove("hidden");
  }

  function resetGame() {
    clearInterval(timer);
    timer = null;

    const midY = Math.floor(ROWS / 2);
    snake = [];
    for (let i = INITIAL_LEN - 1; i >= 0; i--) {
      snake.push({ x: 5 + i, y: midY });
    }
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    collectedWords = [];
    food = spawnFood();

    updateHUD();
    renderWordBox();
    poemPanel.classList.add("hidden");
    setOverlay(null);
  }

  function spawnFood() {
    const occupied = new Set(snake.map((s) => s.x + "," + s.y));
    let pos;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
      attempts++;
    } while (occupied.has(pos.x + "," + pos.y) && attempts < 500);

    return {
      x: pos.x,
      y: pos.y,
      word: pickRandomWord(collectedWords),
    };
  }

  function updateHUD() {
    scoreEl.textContent = score;
    lengthEl.textContent = snake.length;
    wordCountEl.textContent = collectedWords.length + " / " + WORDS_FOR_POEM;
  }

  function renderWordBox() {
    wordBox.innerHTML = "";
    if (collectedWords.length === 0) {
      wordBox.innerHTML = '<p class="word-box-empty">还没有收集到单词</p>';
      return;
    }
    collectedWords.forEach((w) => {
      const chip = document.createElement("span");
      chip.className = "word-chip";
      chip.textContent = w;
      wordBox.appendChild(chip);
    });
  }

  function startGame() {
    if (state === "playing") return;
    resetGame();
    state = "playing";
    btnStart.disabled = true;
    btnRestart.disabled = false;
    document.querySelectorAll(".speed-btn").forEach((b) => (b.disabled = true));
    setOverlay(null);
    timer = setInterval(tick, tickMs);
  }

  function restartGame() {
    state = "idle";
    btnStart.disabled = false;
    btnRestart.disabled = true;
    document.querySelectorAll(".speed-btn").forEach((b) => (b.disabled = false));
    resetGame();
    setOverlay("按「开始游戏」开始");
  }

  function gameOver(reason) {
    clearInterval(timer);
    timer = null;
    state = "gameover";
    btnStart.disabled = true;
    btnRestart.disabled = false;
    document.querySelectorAll(".speed-btn").forEach((b) => (b.disabled = false));
    setOverlay(reason || "游戏结束", "danger");
  }

  function showPoem() {
    clearInterval(timer);
    timer = null;
    state = "poem";
    btnStart.disabled = true;
    btnRestart.disabled = false;
    document.querySelectorAll(".speed-btn").forEach((b) => (b.disabled = false));

    const poem = generatePoem(collectedWords.slice(0, WORDS_FOR_POEM));
    poemText.textContent = poem;
    poemPanel.classList.remove("hidden");
    setOverlay("集齐 8 个单词！诗已生成 ✨", "success");
  }

  function tick() {
    direction = { ...nextDirection };

    const head = snake[0];
    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    };

    if (
      newHead.x < 0 ||
      newHead.x >= COLS ||
      newHead.y < 0 ||
      newHead.y >= ROWS
    ) {
      gameOver("撞墙了！游戏结束");
      return;
    }

    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
        gameOver("撞到自己了！游戏结束");
        return;
      }
    }

    snake.unshift(newHead);

    if (food && newHead.x === food.x && newHead.y === food.y) {
      score += SCORE_PER_WORD;
      collectedWords.push(food.word);
      renderWordBox();
      updateHUD();

      if (collectedWords.length >= WORDS_FOR_POEM) {
        draw();
        showPoem();
        return;
      }

      food = spawnFood();
    } else {
      snake.pop();
    }

    updateHUD();
    draw();
  }

  function drawGrid() {
    ctx.fillStyle = "#121a24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(45, 63, 86, 0.35)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(COLS * CELL, y * CELL);
      ctx.stroke();
    }

    ctx.strokeStyle = "#3dd68c";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, COLS * CELL - 2, ROWS * CELL - 2);
  }

  function drawFood() {
    if (!food) return;

    const cx = food.x * CELL + CELL / 2;
    const cy = food.y * CELL + CELL / 2;
    const r = CELL / 2 - 3;

    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    grad.addColorStop(0, "#ffd699");
    grad.addColorStop(1, "#ffb454");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a2332";
    ctx.font = "600 11px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(food.word, cx, cy);
  }

  function drawSnake() {
    snake.forEach((seg, i) => {
      const pad = i === 0 ? 2 : 3;
      const x = seg.x * CELL + pad;
      const y = seg.y * CELL + pad;
      const size = CELL - pad * 2;
      const radius = i === 0 ? 7 : 5;

      ctx.fillStyle = i === 0 ? "#3dd68c" : "#2a9d63";
      if (i === 0) {
        ctx.shadowColor = "rgba(61, 214, 140, 0.5)";
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }

      roundRect(ctx, x, y, size, size, radius);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (i === 0) {
        drawEyes(seg);
      }
    });
  }

  function drawEyes(head) {
    const cx = head.x * CELL + CELL / 2;
    const cy = head.y * CELL + CELL / 2;
    let ex1, ey1, ex2, ey2;

    if (direction.x === 1) {
      ex1 = cx + 4; ey1 = cy - 3;
      ex2 = cx + 4; ey2 = cy + 3;
    } else if (direction.x === -1) {
      ex1 = cx - 4; ey1 = cy - 3;
      ex2 = cx - 4; ey2 = cy + 3;
    } else if (direction.y === -1) {
      ex1 = cx - 3; ey1 = cy - 4;
      ex2 = cx + 3; ey2 = cy - 4;
    } else {
      ex1 = cx - 3; ey1 = cy + 4;
      ex2 = cx + 3; ey2 = cy + 4;
    }

    ctx.fillStyle = "#0f1419";
    ctx.beginPath();
    ctx.arc(ex1, ey1, 2, 0, Math.PI * 2);
    ctx.arc(ex2, ey2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  function draw() {
    drawGrid();
    drawFood();
    drawSnake();
  }

  function handleKey(e) {
    if (state !== "playing") return;

    const key = e.key;
    let nd = null;

    if (key === "ArrowUp") nd = { x: 0, y: -1 };
    else if (key === "ArrowDown") nd = { x: 0, y: 1 };
    else if (key === "ArrowLeft") nd = { x: -1, y: 0 };
    else if (key === "ArrowRight") nd = { x: 1, y: 0 };
    else return;

    e.preventDefault();
    const cur = direction.x + "," + direction.y;
    const nxt = nd.x + "," + nd.y;
    if (OPPOSITE[cur] === nxt) return;
    nextDirection = nd;
  }

  btnStart.addEventListener("click", startGame);
  btnRestart.addEventListener("click", restartGame);
  document.addEventListener("keydown", handleKey);

  initSpeedButtons();
  resetGame();
  setOverlay("选择速度，然后按「开始游戏」");
  draw();
})();
