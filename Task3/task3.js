document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    
    // Score elements
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const scoreDraw = document.getElementById('scoreDraw');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    // Scores
    let scores = {
        X: 0,
        O: 0,
        draw: 0
    };
    
    const winningConditions = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top-left to bottom-right
        [2, 4, 6]  // diagonal top-right to bottom-left
    ];
    
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell is already filled or game is not active, ignore the click
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        
        // Check for win or draw
        checkResult();
    }
    
    function checkResult() {
        let roundWon = false;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                break;
            }
        }
        
        // If a player has won
        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            scores[currentPlayer]++;
            updateScoreboard();
            gameActive = false;
            return;
        }
        
        // If the game is a draw
        if (!gameState.includes('')) {
            status.textContent = 'Game ended in a draw!';
            scores.draw++;
            updateScoreboard();
            gameActive = false;
            return;
        }
        
        // If game continues, switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    function updateScoreboard() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
        scoreDraw.textContent = scores.draw;
    }
    
    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
        });
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', resetGame);
});