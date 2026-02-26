const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

let gamePaused = false;

let startTime = null;
let elaspedTime = 0;
let timerInterval = null;

const timerDisplay = document.getElementById("time");

const message = document.getElementById("finishOverlay");

let rows = 20;
let cols = 20;
let cellSize;

const canvasSize = 550;
canvas.width = canvasSize;
canvas.height = canvasSize;

let timerRunning = false;

const rollSound = new Audio("files/sound.mp3");
rollSound.loop = false;
rollSound.volume = 0.3;

const victorySound = new Audio("files/win.mp3");
victorySound.volume = 0.6;

const winOverlay = document.getElementById("winOverlay");
const playAgainBtn = document.getElementById("playAgain");

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
    }

    draw() {
        const x = this.col * cellSize;
        const y = this.row * cellSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#318ae9";
        ctx.lineWidth = 10;

        if (this.walls.top) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y), ctx.stroke();
        if (this.walls.right) ctx.beginPath(), ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
        if (this.walls.bottom) ctx.beginPath(), ctx.moveTo(x, y + cellSize), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
        if (this.walls.left) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x, y + cellSize), ctx.stroke();
    }
    getUnvisitedNeighbors() {

        const neighbors = [];

        const top = grid[index(this.row - 1, this.col)];
        const right = grid[index(this.row, this.col + 1)];
        const bottom = grid[index(this.row + 1, this.col)];
        const left = grid[index(this.row, this.col - 1)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            return next;
        } else {
            return undefined;
        }
    }
}

const grid = [];
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        grid.push(new Cell(r, c));
    }
}

let current = grid[0];
const stack = [];

let startCell = grid[0];
let finishCell = grid[grid.length - 1];

function index(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols) return -1;
    return row * cols + col;
}


function removeWalls(a, b) {
    const x = a.col - b.col;
    const y = a.row - b.row;

    if (x === 1) {
        a.walls.left = false;
        b.walls.right = false;
    } else if (x === -1) {
        a.walls.right = false;
        b.walls.left = false;
    }

    if (y === 1) {
        a.walls.top = false;
        b.walls.bottom = false;
    } else if (y === -1) {
        a.walls.bottom = false;
        b.walls.top = false;
    }
}

function generateMaze() {
    current.visited = true;
    const next = current.getUnvisitedNeighbors();

    if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
}

function isNode(cell) {
    const walls = Object.values(cell.walls);
    const openPaths = walls.filter(w => !w).length;
    return openPaths !== 2;
}

let ball = {
    row: 0,
    col: 0,
    x: 0,
    y: 0,
    target: null,
    speed: 4
};

const directions = {
    ArrowUp: { row: -1, col: 0, wall: "top" },
    ArrowRight: { row: 0, col: 1, wall: "right" },
    ArrowDown: { row: 1, col: 0, wall: "bottom" },
    ArrowLeft: { row: 0, col: -1, wall: "left" }
};

function getNextNode(row, col, dir) {
    let r = row;
    let c = col;
    let prevR = row;
    let prevC = col;

    while (true) {
        const cell = grid[index(r, c)];
        const walls = Object.values(cell.walls);
        const openPaths = walls.filter(w => !w).length;
        const isNode = openPaths !== 2;
        if (isNode && !(r === row && c === col)) break;

        const nextR = r + dir.row;
        const nextC = c + dir.col;
        const nextCell = grid[index(nextR, nextC)];
        if (!nextCell) break;
        if (cell.walls[dir.wall]) break;

        prevR = r;
        prevC = c;
        r = nextR;
        c = nextC;
    }
    return grid[index(r, c)];
}

ctx.fillStyle = "red";
ctx.beginPath();
ctx.arc(ball.x + cellSize / 2, ball.y + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
ctx.fill();

ball.x = ball.col * cellSize;
ball.y = ball.row * cellSize;

function moveBall() {
    if (!ball.target) return;

    const targetX = ball.target.col * cellSize;
    const targetY = ball.target.row * cellSize;

    const dx = ball.target.col * cellSize - ball.x;
    const dy = ball.target.row * cellSize - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < ball.speed) {
        ball.x = ball.target.col * cellSize;
        ball.y = ball.target.row * cellSize;
        ball.row = ball.target.row;
        ball.col = ball.target.col;
        ball.target = null;
        if (ball.row === finishCell.row && ball.col === finishCell.col) {
            message.innerHTML = `Finished in ${elaspedTime.toFixed(2)} seconds!`;
            victorySound.currentTime = 0;
            victorySound.play();
            timerRunning = false;
            winOverlay.classList.remove("hidden");
            gamePaused = true;
        }
    } else {
        ball.x += (dx / dist) * ball.speed;
        ball.y += (dy / dist) * ball.speed;
    }
}

window.addEventListener("keydown", e => {
    if (gamePaused) return;
    if (ball.target) return;

    const dir = directions[e.key];
    if (!dir) return;

    const NextNode = getNextNode(ball.row, ball.col, dir);
    if (NextNode) {
        if (!timerRunning) {
            startTime = Date.now();
            timerRunning = true;
        }
        ball.target = NextNode;
        rollSound.play();
    }
});

initMaze(10);

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#47dd30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    generateMaze();

    grid.forEach(cell => cell.draw());

    drawPortal(startCell, "#00b336");
    drawPortal(finishCell, "#cf0c0c", true); 
    moveBall();
    /*
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x + cellSize / 2, ball.y + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();
    */

    let stretch = ball.target ? 1 + 0.3 * Math.sin(Date.now() / 80) * 2 : 0;

    const centerX = ball.x + cellSize / 2;
    const centerY = ball.y + cellSize / 2;

    const gradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 5, centerX, centerY, cellSize / 3);

    gradient.addColorStop(0, "#ffffffaa");
    gradient.addColorStop(1, "#9c6eff");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    const radius = cellSize / 2 - 6;
    ctx.ellipse(centerX, centerY, radius + stretch, radius - stretch, 0, 0, Math.PI * 2);
    ctx.fill();

    if (timerRunning) {
        elaspedTime = (Date.now() - startTime) / 1000;
        timerDisplay.textContent = elaspedTime.toFixed(2);
    }
    requestAnimationFrame(animate);
}

animate();


function initMaze(size) {
    rows = size;
    cols = size;
    cellSize = canvasSize / size;

    grid.length = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid.push(new Cell(r, c));
        }
    }

    current = grid[0];
    stack.length = 0;

    startCell = grid[0];
    finishCell = grid[grid.length - 1];

    ball.row = startCell.row;
    ball.col = startCell.col;
    ball.x = ball.col * cellSize;
    ball.y = ball.row * cellSize;
    ball.target = null; 
}

const buttons = document.querySelectorAll(".controls button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        winOverlay.classList.add("hidden");
        gamePaused = false;
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const size = parseInt(button.getAttribute("data-size"));
        initMaze(size);
    });
});
buttons.forEach(btn => {
    if (parseInt(btn.getAttribute("data-size")) === 10) {
        btn.classList.add("active");
    }
});

// reset button
document.getElementById("resetBtn").addEventListener("click", () => {
    if (!winOverlay.classList.contains("hidden")) {
        winOverlay.classList.add("hidden");
        gamePaused = false;
    }
    initMaze(rows);
    timerRunning = false;
    timerDisplay.textContent = "0.00";
    initMaze(rows);
});



let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;


function handleSwipe() {
    if (gamePaused) return;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    const threshold = 30;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

    let dirKey;
    if (Math.abs(dx) > Math.abs(dy)) {
        dirKey = dx > 0 ? "ArrowRight" : "ArrowLeft";
    } else {
        dirKey = dy > 0 ? "ArrowDown" : "ArrowUp";
    }

    const dir = directions[dirKey];
    if (!dir || ball.target) return;
    const NextNode = getNextNode(ball.row, ball.col, dir);
    if (NextNode) {
        if (!timerRunning) {
            startTime = Date.now();
            timerRunning = true;
        }
        ball.target = NextNode;
        rollSound.play();
    }
};

canvas.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", e => {
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    handleSwipe();
});

canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}), { passive: false }; 


function drawPortal(cell, color, pulse=false) {
    const centerX = cell.col * cellSize + cellSize / 2;
    const centerY = cell.row * cellSize + cellSize / 2;

    let radius = cellSize / 2 - 12;
    if (pulse) {
        radius += Math.sin(Date.now() / 250) * 4;
    }
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.stroke();
}

playAgainBtn.addEventListener("click", () => {
    winOverlay.classList.add("hidden");
    gamePaused = false;
    initMaze(rows);
    timerDisplay.textContent = "0.00";
});

// adaptive

function scaleCont() {
    const baseWidth = 700;

    const scale = Math.min(
        window.innerWidth / baseWidth,
        window.innerHeight / baseWidth,
        1
    );
    document.querySelector(".container").style.transform = `scale(${scale})`;
}
window.addEventListener("resize", scaleCont);
window.addEventListener("load", () => {
    scaleCont();
});
setTimeout(scaleCont, 100);