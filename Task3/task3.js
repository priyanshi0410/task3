<script>
        document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Elements ---
            const cells = document.querySelectorAll('.cell');
            const statusDisplay = document.getElementById('status');
            const resetButton = document.getElementById('reset');
            const clearScoreButton = document.getElementById('clear-score');
            const scoreXDisplay = document.getElementById('scoreX');
            const scoreODisplay = document.getElementById('scoreO');
            const scoreDrawDisplay = document.getElementById('scoreDraw');
            const winnerModal = document.getElementById('winner-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const playAgainButton = document.getElementById('play-again');

            // --- SVG Icons ---
            const svgX = `<svg class="icon-x" viewBox="0 0 100 100"><line x1="15" y1="15" x2="85" y2="85"></line><line x1="85" y1="15" x2="15" y2="85"></line></svg>`;
            const svgO = `<svg class="icon-o" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none"></circle></svg>`;

            // --- Game State ---
            let currentPlayer = 'X';
            let gameState = ['', '', '', '', '', '', '', '', ''];
            let gameActive = true;
            let scores = JSON.parse(localStorage.getItem('ticTacToeScores')) || { X: 0, O: 0, draw: 0 };
            
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];

            // --- Game Functions ---
            function handleCellClick(e) {
                const clickedCell = e.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
                if (gameState[clickedCellIndex] !== '' || !gameActive) return;
                updateCell(clickedCell, clickedCellIndex);
                checkResult();
            }

            function updateCell(cell, index) {
                gameState[index] = currentPlayer;
                cell.innerHTML = currentPlayer === 'X' ? svgX : svgO;
            }
            
            function checkResult() {
                let roundWon = false;
                let winningCombo = [];

                for (let i = 0; i < winningConditions.length; i++) {
                    const winCondition = winningConditions[i];
                    const [a, b, c] = winCondition.map(index => gameState[index]);
                    if (a === '' || b === '' || c === '') continue;
                    if (a === b && b === c) {
                        roundWon = true;
                        winningCombo = winCondition;
                        break;
                    }
                }
                
                if (roundWon) {
                    scores[currentPlayer]++;
                    gameActive = false;
                    highlightWinningCells(winningCombo);
                    updateScoreboard();
                    setTimeout(() => showModal(false), 800);
                    createSparkles();
                    return;
                }
                
                if (!gameState.includes('')) {
                    scores.draw++;
                    gameActive = false;
                    updateScoreboard();
                    setTimeout(() => showModal(true), 500);
                    return;
                }
                
                switchPlayer();
            }

            function switchPlayer() {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            }

            function highlightWinningCells(combo) {
                combo.forEach(index => cells[index].classList.add('winning-cell'));
            }
            
            function updateScoreboard() {
                scoreXDisplay.textContent = scores.X;
                scoreODisplay.textContent = scores.O;
                scoreDrawDisplay.textContent = scores.draw;
                localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
            }
            
            function resetGame() {
                gameState = Array(9).fill('');
                gameActive = true;
                statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
                cells.forEach(cell => {
                    cell.innerHTML = '';
                    cell.classList.remove('winning-cell');
                    cell.style.animation = '';
                });
                winnerModal.classList.remove('visible');
            }
            
            function clearScore() {
                scores = { X: 0, O: 0, draw: 0 };
                updateScoreboard();
            }
            
            // --- Modal & Effects ---
            function showModal(isDraw) {
                if (isDraw) {
                    modalTitle.textContent = "A Draw";
                    modalMessage.innerHTML = `<span style="font-size: 1.2rem;">A hard-fought match!</span>`;
                } else {
                    modalTitle.textContent = "Victory!";
                    modalMessage.innerHTML = `<span>Player ${currentPlayer === 'X' ? svgX : svgO} wins!</span>`;
                }
                winnerModal.classList.add('visible');
            }
            
            function createSparkles() {
                const sparkleContainer = document.body;
                for (let i = 0; i < 30; i++) {
                    const sparkle = document.createElement('div');
                    sparkle.classList.add('sparkle');
                    const size = Math.random() * 5 + 2 + 'px';
                    sparkle.style.width = size;
                    sparkle.style.height = size;
                    sparkle.style.left = Math.random() * 100 + 'vw';
                    sparkle.style.top = Math.random() * 100 + 'vh';
                    // Custom properties for animation
                    sparkle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                    sparkle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
                    sparkle.style.animationDelay = Math.random() * 0.5 + 's';
                    sparkleContainer.appendChild(sparkle);

                    setTimeout(() => sparkle.remove(), 1000);
                }
            }
            
            // --- Event Listeners ---
            cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            resetButton.addEventListener('click', resetGame);
            clearScoreButton.addEventListener('click', clearScore);
            playAgainButton.addEventListener('click', resetGame);
            winnerModal.addEventListener('click', e => {
                if(e.target === winnerModal) winnerModal.classList.remove('visible');
            });

            updateScoreboard();
        });
    </script>