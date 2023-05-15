const cells = document.querySelectorAll('.cell');
const message = document.querySelector('#message');
const select = document.querySelector('#symbol');

// gameboard object
const gameBoard = (() => {

   const board = Array(9).fill('');
    
    // update board array with symbol selections
   function updateBoard() { 
  
        for(let i = 0; i < gameBoard.board.length; i++) {
          gameBoard.board[i] = cells[i].textContent;
        }
        return gameBoard.board
    }
    return {board,updateBoard};
})()

// current player object
const player = (() => { 
    // on page load current player is X
    const currentPlayer = 'X';

    // select symbol for player
    function selectSymbol(e) {
        player.currentPlayer = e.target.value;
        message.textContent = "It's " + player.currentPlayer + "'s turn";

        // disable drop down options after first selection
        const options = document.querySelectorAll('option');
        options[0].disabled = true;
        options[1].disabled = true;
    }
    
    return {currentPlayer, selectSymbol};
})()

// game flow object
const game = (() => {
    function handleClick(e) {
        // update gameboard & UI
        const cell = e.target;
        cell.textContent  = player.currentPlayer;
        gameBoard.updateBoard();

        if (game.checkForWin()) {
          message.textContent = player.currentPlayer + " wins!";
          cells.forEach(cell => {
            cell.removeEventListener("click", handleClick);
          });
        } else if (game.checkForDraw()) {
          message.textContent = "It's a draw!";
        } else {
          player.currentPlayer = (player.currentPlayer === "X" ? "O" : "X");
          message.textContent = "It's " + player.currentPlayer + "'s turn";
        }
    }

    function checkForWin() {
        let winningIndexCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
        ];
        for (let i = 0; i < winningIndexCombos.length; i++) {
        let [a, b, c] = winningIndexCombos[i];
        if (
            gameBoard.board[a] === player.currentPlayer &&
            gameBoard.board[b] === player.currentPlayer &&
            gameBoard.board[c] === player.currentPlayer
        ) {
            return true;
          }
        }
        return false;
    }

    function checkForDraw() {
        let isDraw = true;
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].textContent === "") {
            isDraw = false;
            break;
          }
        }
        return isDraw;
    }

    function resetGame() {  
        gameBoard.board = Array(9).fill('');
        cells.forEach(cell => (cell.textContent = null));

        // on game reset set currentPlayer to symbol X
        player.currentPlayer = 'X';

        // return to default index value
        select.selectedIndex = 0;

        // enable drop down menu options
        const options = document.querySelectorAll('option');
        options[0].disabled = false;
        options[1].disabled = false;
        
        message.textContent = "It's " + player.currentPlayer + "'s turn";
        cells.forEach(cell => cell.addEventListener('click', handleClick));
    }

    return {handleClick, checkForWin, checkForDraw, resetGame}
})()

document.querySelector('#reset').addEventListener('click', game.resetGame);
select.addEventListener('change', player.selectSymbol);

cells.forEach(cell => cell.addEventListener('click', game.handleClick));



