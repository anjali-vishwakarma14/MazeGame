const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');
const solveBtn = document.getElementById('solve-btn');
const resetBtn = document.getElementById('reset-btn');
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// popup
const winPopup = document.getElementById('win-popup');
const closePopup =document.getElementById('close-popup');
const playAgainBtn = document.getElementById('play-again-btn');

// canvas size
canvas.width = 400;
canvas.height = 400;

const mazeSize = 20;
const cellSize = canvas.width / mazeSize;

let maze = [];
let player = { x: 0, y: 0 };
let end = { x: mazeSize - 1, y: mazeSize - 1 };

// generate random maze (0 for walls , 1 for path)
function generateMaze() {
    maze = new Array(mazeSize).fill().map(() => new Array(mazeSize).fill(0).map(() =>
        (Math.random() > 0.3 ? 1 : 0))
    );
    maze[0][0] = 1; //start point
    maze[mazeSize - 1][mazeSize - 1] = 1; //end point
}

// draw maze
function drawMaze() {
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? 'white' : 'black';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    drawPlayer();
    drawEnd();
}

// drawPlayer
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function drawEnd() {
    ctx.fillStyle = 'green';
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
}

// solve maze using bfs
function solveMaze() {
    const directions = [
        { x: 0, y: -1 }, //up
        { x: 0, y: 1 }, //down
        { x: -1, y: 0 }, //left
        { x: 1, y: 0 }, //right
    ];

    const queue = [{ x: player.x, y: player.y, path: [] }];
    const visited = new Array(mazeSize).fill().map(() => new Array(mazeSize).fill(false));
    visited[player.y][player.x] = true;

    while (queue.length > 0) {
        const current = queue.shift();
        const { x, y, path } = current;

        if (x === end.x && y === end.y) {
            animatedPath(path);
            return;
        }

        for (const dir of directions) {
            const newX = x + dir.x;
            const newY = y + dir.y;

            if(newX >= 0 && newY >= 0 && newX < mazeSize && newY < mazeSize && 
                maze[newY][newX] === 1 &&  !visited[newY][newX]){
                    visited[newY][newX] = true;
                    queue.push({ x: newX, y: newY, path: [...path,{x: newX, y: newY}] });
                }
        }
    }
}

// animate the solvd path
function animatedPath(path){
    let i = 0;
    const interval = setInterval(() => {
        if(i >= path.length) {
            clearInterval(interval);
            checkWin();
            return;
        }
        player.x = path[i].x;
        player.y = path[i].y;
        drawMaze();
        i++;
    }, 100);
}

function checkWin(){
    if(player.x === end.x && player.y === end.y){
        showWinPopup();
    }
}

function showWinPopup(){
    winPopup.style.display = 'block';
}

closePopup.onclick = function(){
    winPopup.style.display = 'none';
}

playAgainBtn.onclick = function(){
    winPopup.style.display = 'none';
    resetMaze();
};

// reset maze
function resetMaze(){
    generateMaze();
    player = {x: 0, y: 0};
    drawMaze();
}

// move player
function movePlayer(dir){
    const directions = {
        up: { x: 0, y: -1 }, //up
        down: { x: 0, y: 1 }, //down
        left: { x: -1, y: 0 }, //left
        right: { x: 1, y: 0 }, //right
    };

    const move = directions[dir];
    if(move){
        const newX = player.x + move.x;
        const newY = player.y + move.y;

        if(newX >= 0 && newY >= 0 && newX < mazeSize && newY< mazeSize && maze[newY][newX] === 1){
            player.x = newX;
            player.y = newY;
            drawMaze();
            checkWin();
        }
    }
}

upBtn.addEventListener('click', () => movePlayer('up'));
downBtn.addEventListener('click', () => movePlayer('down'));
leftBtn.addEventListener('click', () => movePlayer('left'));
rightBtn.addEventListener('click', () => movePlayer('right'));

solveBtn.addEventListener('click', solveMaze);
resetBtn.addEventListener('click', resetMaze);

resetMaze();