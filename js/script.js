const cells = document.querySelectorAll('.cell');
const resetBtn = document.querySelector('.reset');
const currentTurn = document.querySelector('.current-turn');
const player1score = document.querySelector('.score1');
const player2score = document.querySelector('.score2');
const draw = document.querySelector('.draw');
const overlay = document.querySelector('#overlay');
const messageContent = document.querySelector('#content');
const close = document.querySelector('#close');

const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

let turn = true; // true for Player 1, false for Player 2
let useCells = []; // Array to keep track of used cells
let winner = false; // Flag to check if there's a winner
let ties = 0; // Number of ties
let checkwin = 0; // Not used in this code

// Array of winning combinations for a 5x5 Tic-Tac-Toe board
const winningCombos = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
];

let player1 = {
    icon: '<i class="fa-solid fa-xmark player1-color">',
    played: [], // Array to keep track of cells played by Player 1
    score: 0 // Score of Player 1
};

let player2 = {
    icon: '<i class="fa-regular fa-circle player2-color"></i>',
    played: [], // Array to keep track of cells played by Player 2
    score: 0 // Score of Player 2
};

checkTurn();

/**
 * Saves the current game state to localStorage.
 */
function saveGameData() {
    const gameData = {
        player1: {
            score: player1.score,
            played: player1.played
        },
        player2: {
            score: player2.score,
            played: player2.played
        },
        turn: turn,
        useCells: useCells,
        ties: ties
    };
    localStorage.setItem('ticTacToeGameData', JSON.stringify(gameData));
}

/**
 * Loads the game state from localStorage and restores it.
 */
function loadGameData() {
    const savedData = localStorage.getItem('ticTacToeGameData');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        player1.score = gameData.player1.score;
        player1.played = gameData.player1.played;
        player2.score = gameData.player2.score;
        player2.played = gameData.player2.played;
        turn = gameData.turn;
        ties = gameData.ties;
        useCells = gameData.useCells;

        cells.forEach((cell, index) => {
            if (player1.played.includes(index)) {
                cell.innerHTML = player1.icon;
            } else if (player2.played.includes(index)) {
                cell.innerHTML = player2.icon;
            }
        });

        showScore();
        checkTurn();
    }
}

/**
 * Sets the icon for the current player on the clicked cell and updates the game state.
 * @param {Object} player - The current player object (player1 or player2).
 * @param {HTMLElement} cell - The clicked cell element.
 * @param {number} index - The index of the clicked cell.
 */
function setIcon(player, cell, index) {
    cell.innerHTML = player.icon;
    cell.classList.add('icon-animation');
    clickSound.currentTime = 0;

    setTimeout(() => {
        cell.classList.remove('icon-animation');
    }, 300);

    player.played.push(index);
    useCells.push(index);
    clickSound.play();

    saveGameData();
}

/**
 * Checks if the current player has won or if the game is a draw.
 * @param {Object} player - The current player object (player1 or player2).
 */
function checkWinner(player) {
    if (!winner) {
        winningCombos.some(combo => {
            if (combo.every(index => player.played.includes(index))) {
                winner = true;
                player.score++;
                showScore();
                saveGameData();

                setTimeout(() => {
                    displayMessage(player);
                }, 500);
                return true;
            }
        });
    }

    if (!winner && useCells.length === 25) {
        ties++;
        showScore();
        saveGameData();

        setTimeout(() => {
            displayMessage(null, true);
        }, 500);
    }
}

/**
 * Checks if a cell is empty (not yet used).
 * @param {number} i - The index of the cell.
 * @returns {boolean} - Returns true if the cell is empty, otherwise false.
 */
function isEmpty(i) {
    return !useCells.includes(i);
}

/**
 * Resets the game board and game state for a new game.
 */
function reset() {
    cells.forEach(cell => {
        cell.innerHTML = '';
    });

    useCells = [];
    player1.played = [];
    player2.played = [];
    winner = false;
    turn = true;
    checkTurn();
    saveGameData();
}

/**
 * Updates the display to show whose turn it is.
 */
function checkTurn() {
    if (turn) {
        currentTurn.innerHTML = player1.icon;
    } else {
        currentTurn.innerHTML = player2.icon;
    }
}

/**
 * Updates the display to show the scores of both players and the number of ties.
 */
function showScore() {
    player1score.innerHTML = player1.score;
    player2score.innerHTML = player2.score;
    draw.innerHTML = ties;
}

/**
 * Displays a message when a player wins or if there is a draw.
 * @param {Object|null} player - The winning player object or null in case of a draw.
 * @param {boolean} isDraw - Indicates if the game ended in a draw.
 */
function displayMessage(player, isDraw = false) {
    overlay.style.display = 'flex';

    if (isDraw) {
        messageContent.innerHTML = '<h2>It\'s a draw!</h2>';
        drawSound.play();
    } else {
        const icon = player === player1 ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-regular fa-circle"></i>';
        messageContent.innerHTML = `${icon} is the  <h2>Winner!</h2>`;
        winSound.play();
        startConfetti();
    }
    reset();
}

/**
 * Starts the confetti animation to celebrate a win.
 */
function startConfetti() {
    setTimeout(() => {
        confetti.start();
    }, 500);

    setTimeout(() => {
        confetti.stop();
    }, 3000);
}

close.addEventListener('click', () => {
    overlay.style.display = 'none';
});

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', () => {
        if (isEmpty(i)) {
            if (turn) {
                setIcon(player1, cells[i], i);
                turn = false;
                checkWinner(player1);
            } else {
                setIcon(player2, cells[i], i);
                turn = true;
                checkWinner(player2);
            }
            checkTurn();
            saveGameData();
        }
    });
}

window.addEventListener('DOMContentLoaded', loadGameData);

resetBtn.addEventListener('click', () => {
    localStorage.removeItem('ticTacToeGameData');
    reset();
});
