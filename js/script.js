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

let turn = true;
let useCells = [];
let winner = false;
let ties = 0;
let checkwin = 0;

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
    played: [],
    score: 0
}

let player2 = {
    icon: '<i class="fa-regular fa-circle player2-color"></i>',
    played: [],
    score: 0
}

checkTurn();


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

function check(){
    let score1 = player1.score;
    let score2 = player2.score;
    if(score1 + score2 >= 5){
        checkWinner();
        if(score1 > score2){
            alert('player 1 is the winner!')
        }else{
            alert('player 2 is the winner!')
        }
        
    }
    reset();
}

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

    }

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
    };
    if (!winner && useCells.length == 25) {
        ties++;
        showScore();
        saveGameData();

        setTimeout(() => {
            displayMessage(null, true);
        }, 500);
    }
};

function isEmpty(i) {

    if (useCells.includes(i)) {
        return false;
    }

    return true;
}

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

};

function checkTurn() {
    if (turn) {
        currentTurn.innerHTML = player1.icon;
    } else {
        currentTurn.innerHTML = player2.icon;
    }
};

function showScore() {
    player1score.innerHTML = player1.score;
    player2score.innerHTML = player2.score;
    draw.innerHTML = ties;
};

function displayMessage(player, isDraw = false) {
    overlay.style.display = 'flex';

    if (isDraw) {
        messageContent.innerHTML = '<h2>It\'s a draw!</h2>';
        drawSound.play();
    } else {
        const icon = player === player1 ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-regular fa-circle"></i>';
        messageContent.innerHTML = `${icon} is the  <h2>Winner!</h2>`
        winSound.play();
        startConfetti();
    }
    reset();
};

function startConfetti() {
    setTimeout(function () {
        confetti.start();
    }, 500);

    setTimeout(function () {
        confetti.stop();
    }, 3000);
};

close.addEventListener('click', () => {
    overlay.style.display = 'none';
})

for (let i = 0; i < cells.length; i++) {

    cells[i].addEventListener('click', () => {

        if (isEmpty(i)) {

            if (turn) {

                setIcon(player1, cells[i], i);
                turn = false;
                checkWinner(player1);
                checkTurn();

            } else {

                setIcon(player2, cells[i], i);
                turn = true;
                checkWinner(player2);
                checkTurn();
            }
            check();

        } else {
            alert('choose empty cells');
        }
    });
};

window.addEventListener('DOMContentLoaded', loadGameData);

resetBtn.addEventListener('click', () => {

    localStorage.removeItem('ticTacToeGameData')
    reset();
});


