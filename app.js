const boardSize = 4;
let board = [];
let gameOver = false;

// Variables to track touch start and end positions for swipe
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function initBoard() {
    // Initialize an empty board
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) {
                emptyTiles.push({ x: i, y: j });
            }
        }
    }
    if (emptyTiles.length > 0) {
        let { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[x][y] = Math.random() > 0.9 ? 4 : 2;
    }
}

function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(tile => {
            const tileDiv = document.createElement('div');
            tileDiv.classList.add('tile');
            tileDiv.textContent = tile === 0 ? '' : tile;
            tileDiv.setAttribute('data-value', tile); // Set tile value to control color
            gameBoard.appendChild(tileDiv);
        });
    });

    // Check if the game is over after each move
    if (isGameOver()) {
        showGameOverMessage();
    }
}

function slide(row) {
    let arr = row.filter(val => val);
    let missing = boardSize - arr.length;
    let zeros = Array(missing).fill(0);
    return arr.concat(zeros);
}

function combine(row) {
    for (let i = 0; i < boardSize - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveLeft() {
    let newBoard = board.map(row => slide(combine(slide(row))));
    if (boardChanged(newBoard)) {
        board = newBoard;
        addRandomTile();
        renderBoard();
    }
}

function moveRight() {
    let newBoard = board.map(row => slide(combine(slide(row.reverse()))).reverse());
    if (boardChanged(newBoard)) {
        board = newBoard;
        addRandomTile();
        renderBoard();
    }
}

function moveUp() {
    let transposed = transpose(board);
    let newBoard = transposed.map(row => slide(combine(slide(row))));
    if (boardChanged(transpose(newBoard))) {
        board = transpose(newBoard);
        addRandomTile();
        renderBoard();
    }
}

function moveDown() {
    let transposed = transpose(board);
    let newBoard = transposed.map(row => slide(combine(slide(row.reverse()))).reverse());
    if (boardChanged(transpose(newBoard))) {
        board = transpose(newBoard);
        addRandomTile();
        renderBoard();
    }
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function boardChanged(newBoard) {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] !== newBoard[i][j]) return true;
        }
    }
    return false;
}

function isGameOver() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) return false; // If there are empty spaces, not game over
            if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) return false; // Check horizontal moves
            if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) return false; // Check vertical moves
        }
    }
    return true;
}

function showGameOverMessage() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    // Display the Game Over message
    const messageDiv = document.createElement('div');
    messageDiv.textContent = "Game Over!";
    messageDiv.style.fontSize = '36px';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.color = '#333';
    messageDiv.style.marginBottom = '20px';
    gameBoard.appendChild(messageDiv);

    // Display the "Restart" button
    const restartButton = document.createElement('button');
    restartButton.textContent = "Restart Game";
    restartButton.style.fontSize = '18px';
    restartButton.style.padding = '10px 20px';
    restartButton.onclick = () => location.reload(); // Reload the page to restart the game
    gameBoard.appendChild(restartButton);
}

// Swipe event handlers
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault();  // Prevent scrolling on mobile devices
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchend', (e) => {
    handleSwipe();
});

// Detect the swipe direction
function handleSwipe() {
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
    }
});

initBoard();
