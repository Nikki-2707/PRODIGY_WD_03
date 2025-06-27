console.log("Welcome To Tic Tac Toe");

// Audio files
let winSound = new Audio("effects/goodresult.mp3");
let drawSound = new Audio("effects/game-over.mp3");
let moveSound = new Audio("effects/glass-ting.mp3");

// Image paths for X and O
let xImg = "effects/x.png";
let oImg = "effects/o.png";

let currentPlayer = "X";
let gameOver = false;
let mode = "2p"; // default mode
const modeSelect = document.getElementById("mode");
const info = document.querySelector('.info');

// Change player turn
const changeTurn = () => currentPlayer === "X" ? "O" : "X";

// Check for a win
const checkWin = () => {
    let boxtexts = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, -20, 5, 0],
        [3, 4, 5, -20, 15, 0],
        [6, 7, 8, -20, 25, 0],
        [0, 3, 6, -29.5, 15, 90],
        [1, 4, 7, -19.5, 15, 90],
        [2, 5, 8, -9, 15, 90],
        [0, 4, 8, -20, 14, 45],
        [2, 4, 6, -19, 15, 135]
    ];
    document.querySelector(".info").classList.remove("win-effect", "draw-effect"); 
    wins.forEach(e => {
        let b1 = boxtexts[e[0]].querySelector('img')?.src;
        let b2 = boxtexts[e[1]].querySelector('img')?.src;
        let b3 = boxtexts[e[2]].querySelector('img')?.src;

        if (b1 && b2 && b3 && b1 === b2 && b2 === b3) {
            // const info = document.querySelector('.info');
            info.innerText = "Player " + (b1.includes("x.png") ? "X" : "O") + " Won!";
            info.classList.add("win-effect");
            gameOver = true;
            winSound.play();

            document.querySelector('.imgbox img').style.width = "200px";
            document.querySelector(".line").style.transform = `translate(${e[3]}vw,${e[4]}vw) rotate(${e[5]}deg)`;
            document.querySelector(".line").style.width = "30vw";
        }
    });

    // Check draw
    let allFilled = [...boxtexts].every(b => b.querySelector('img'));
    if (!gameOver && allFilled) {
        // const info = document.querySelector('.info');
        info.innerText = "It's a draw!";
        info.classList.add("draw-effect");
        drawSound.play();
        gameOver = true;
    }
};

// Computer makes a move (simple random AI)
function computerMove() {
    if (gameOver) return;

    const boxtexts = document.getElementsByClassName("boxtext");
    const board = Array.from(boxtexts).map(box => {
        const img = box.querySelector('img');
        if (!img) return '';
        return img.src.includes("x.png") ? "X" : "O";
    });

    const winningCombinations = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    // Try to win
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] === "O" && board[b] === "O" && board[c] === "") return placeAt(c);
        if (board[a] === "O" && board[c] === "O" && board[b] === "") return placeAt(b);
        if (board[b] === "O" && board[c] === "O" && board[a] === "") return placeAt(a);
    }

    // Try to block player
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return placeAt(c);
        if (board[a] === "X" && board[c] === "X" && board[b] === "") return placeAt(b);
        if (board[b] === "X" && board[c] === "X" && board[a] === "") return placeAt(a);
    }

    // Take center
    if (board[4] === "") return placeAt(4);

    // Take a corner
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => board[i] === "");
    if (emptyCorners.length > 0) {
        return placeAt(emptyCorners[Math.floor(Math.random() * emptyCorners.length)]);
    }

    // Fallback to random empty cell
    const emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
    if (emptyIndices.length > 0) {
        return placeAt(emptyIndices[Math.floor(Math.random() * emptyIndices.length)]);
    }

    // Helper to place the move
    function placeAt(index) {
        const targetBox = boxtexts[index];
        if (targetBox.querySelector('img')) return;

        const img = document.createElement("img");
        img.src = oImg;
        img.alt = "O mark";
        img.classList.add("xo-img");
        targetBox.appendChild(img);

        moveSound.play();
        checkWin();

        if (!gameOver) {
            currentPlayer = changeTurn();
            document.querySelector(".info").innerText = "Turn of " + currentPlayer;
        }
    }
}


// Game logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (!boxtext.querySelector('img') && !gameOver) {
            let img = document.createElement("img");
            img.src = currentPlayer === "X" ? xImg : oImg;
            img.alt = currentPlayer === "X" ? "X mark" : "O mark";
            img.classList.add("xo-img");
            boxtext.appendChild(img);

            moveSound.play();
            checkWin();

            if (!gameOver) {
                currentPlayer = changeTurn();
                document.querySelector(".info").innerText = "Turn of " + currentPlayer;

                // If single player and it's O's turn, trigger computer move
                if (mode === "1p" && currentPlayer === "O") {
                    setTimeout(computerMove, 500);
                }
            }
        }
    });
});

// Reset button functionality
document.getElementById("reset").addEventListener('click', () => {
    
    let boxtexts = document.querySelectorAll('.boxtext');

    boxtexts.forEach(box => box.innerHTML = '');

    currentPlayer = "X";
    gameOver = false;

    // const info = document.querySelector(".info");
    info.classList.remove("win-effect", "draw-effect");
    info.innerText = "Turn of " + currentPlayer;

    document.querySelector('.imgbox img').style.width = "0px";
    document.querySelector(".line").style.width = "0vw";
});

modeSelect.addEventListener("change", (e) => {
    mode = e.target.value;
    document.getElementById("reset").click(); // reset board on mode change
});
