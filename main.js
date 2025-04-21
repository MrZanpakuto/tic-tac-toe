const cells = document.querySelectorAll('.cell');
const message = document.querySelector('#message');
const select = document.querySelector('#symbol');

const symbols = {
  player_X: 'Ichigo',
  player_O: 'Byakuya',
};

const time_delay = 600; // milliseconds

// add data attribute symbol to each cell
cells.forEach(cell => cell.dataset.symbol = '');

// gameboard object
class GameBoard {
  constructor() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
  }

  updateBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = cells[i * 3 + j].dataset.symbol;
      }
    }
    return this.board;
  }

  resetGame() {
    
     this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

      //  remove symbol from each cell
      cells.forEach(cell => {
        cell.dataset.symbol = '';
        cell.classList.remove('x-symbol');
        cell.classList.remove('o-symbol');
      });
    
      // on game reset set currentPlayer to symbol X
      player.currentPlayer = symbols.player_X;

      // return to default index value of form control dropdown
      select.selectedIndex = 0;

      // enable drop down menu options
      const options = document.querySelectorAll('option');
      options[0].disabled = false;
      options[1].disabled = false;
      
      message.textContent = "It's " + player.currentPlayer + "'s turn";
      cells.forEach(cell => cell.addEventListener('click', game.handleClick));
  }
}

const gameBoard = new GameBoard();

// current player class
class Player {
  constructor(name) {
    this.currentPlayer = name;
  }

  // select symbol for player
  selectSymbol(e) {
    player.currentPlayer = e.target.value;
    console.log('Select Symbol:', player.currentPlayer);
    
    message.textContent = "It's " + player.currentPlayer + "'s turn";
  }

  // disable drop down options after first move
  disableOptions() {
    const options = document.querySelectorAll('option');
    options[0].disabled = true;
    options[1].disabled = true;
  }

  changePlayer() {
    if (this.currentPlayer === symbols.player_X) {
      this.currentPlayer = symbols.player_O;
      console.log('Change Player:', this.currentPlayer);
    } else {
      this.currentPlayer = symbols.player_X;
    }
  }

  identifyPlayers() {
    const humanPlayer = select.value;
    let aiPlayer = '';

    if (humanPlayer === symbols.player_X) {
      aiPlayer = symbols.player_O;
    } else {
      aiPlayer = symbols.player_X;
    }

    return { humanPlayer, aiPlayer };
  }
}

const player = new Player(symbols.player_X);
console.log('Default Player:', player.currentPlayer);

// game flow object
class Game {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

     handleClick(e) {
        console.log('On Click:', player.currentPlayer);
       

        // const { aiPlayer } = player.identifyPlayers();

         // update gameboard UI
        const cell = e.target;
        player.disableOptions();

        // add data attribute with current players symbol value to cell
        if(cell.dataset.symbol != '') return;
        cell.dataset.symbol = player.currentPlayer;

        // display symbol on UI board
        this.addSymbol(cell);

        gameBoard.updateBoard();

        if (this.isGameOver(gameBoard.board, player.currentPlayer).win) {
          message.textContent = player.currentPlayer + " wins!";
          cells.forEach(cell => cell.removeEventListener("click", this.handleClick));
        } else if (this.isGameOver(gameBoard.board, null).draw) {
          message.textContent = "It's a Tie!";
        } else {
          player.changePlayer();

          // Add a delay for the AI's move
          setTimeout(() => {
            const { aiPlayer } = player.identifyPlayers();
            if (aiPlayer === symbols.player_X) {
              this.bestMove(gameBoard.board);
            } else {
              this.randomMove(gameBoard.board);
            }
          }, time_delay);
        }
     }
    checkForWin(board, symbol) {
      return this.isGameOver(board, symbol).win;
    }

    checkForDraw(board) {
      return this.isGameOver(board, null).draw;
    }

    randomMove(board) { 
      const emptyCells = this.getEmptyCells(board); // Get all empty cells
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { i, j } = emptyCells[randomIndex];
        board[i][j] = player.currentPlayer;
    
        // Update board UI
        const cell = cells[i * 3 + j];
        cell.dataset.symbol = player.currentPlayer;
        this.addSymbol(cell);
      }
    
      if (this.checkForWin(board, player.currentPlayer)) {
        message.textContent = player.currentPlayer + " Wins!";
        cells.forEach(cell => cell.removeEventListener("click", this.handleClick));
      } else if (this.checkForDraw(board)) {
        message.textContent = "It's a Tie!";
      } else {
        player.changePlayer();
        message.textContent = "It's " + player.currentPlayer + "'s turn";
      }
    }

    addSymbol(cell) {
      if(cell.dataset.symbol === symbols.player_X) {
         cell.classList.add("x-symbol");
      } else if (cell.dataset.symbol === symbols.player_O) {
        cell.classList.add("o-symbol");
      }
    }

    addGiphy(player) {
      const board = document.getElementById('gameboard');
      board.setAttribute('id','winner');

      if(player == symbols.player_X) {
        board.classList.add('x-symbol');
      } else {
        board.classList.add('y-symbol');   
      }
    }   

    bestMove(board) {
      const { aiPlayer, humanPlayer } = player.identifyPlayers();
      let bestScore = -Infinity;
      let move;
    
      const emptyCells = this.getEmptyCells(board); // Get all empty cells
      for (const { i, j } of emptyCells) {
        board[i][j] = aiPlayer; // Simulate move
        let score = this.minimax(board, 0, false, aiPlayer, humanPlayer); // Evaluate move
        board[i][j] = ''; // Undo move
        if (score > bestScore) {
          bestScore = score;
          move = { i, j }; // Store the best move
        }
      }
    
      // Make the best move
      if (move) {
        board[move.i][move.j] = aiPlayer;
        const cell = cells[move.i * 3 + move.j];
        cell.dataset.symbol = aiPlayer;
        this.addSymbol(cell);
      }
    
      if (this.checkForWin(board, aiPlayer)) {
        message.textContent = aiPlayer + " Wins!";
        cells.forEach(cell => cell.removeEventListener("click", this.handleClick));
      } else if (this.checkForDraw(board)) {
        message.textContent = "It's a Tie!";
      } else {
        player.changePlayer();
        message.textContent = "It's " + player.currentPlayer + "'s turn";
      }
    }

    minimax(board, depth, isMaximizing, aiPlayer, humanPlayer) {
      // Check for terminal states (win, lose, draw)
      // If it's maximizing's turn, opponent won (-10), else computer won (+10)
      if (this.checkForWin(board, aiPlayer)) return 10 - depth;
      if (this.checkForWin(board, humanPlayer)) return depth - 10;
      if (this.checkForDraw(board)) return 0; // Draw

      // Maximizing player's turn (computer)
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
              board[i][j] = aiPlayer; // Simulate move
              let score = this.minimax(board, depth + 1, false,aiPlayer, humanPlayer); // Recurse
              board[i][j] = ''; // Undo move
              bestScore = Math.max(score, bestScore); // Get the best score
            }
          }
        }
        return bestScore;
      } else {
        // Minimizing player's turn (human)
        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
              board[i][j] = humanPlayer; // Simulate move
              let score = this.minimax(board, depth + 1, true,aiPlayer, humanPlayer); // Recurse
              board[i][j] = ''; // Undo move
              bestScore = Math.min(score, bestScore); // Get the best score
            }
          }
        }
        return bestScore;
      }
    }

    getEmptyCells(board) {
      const emptyCells = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === '') {
            emptyCells.push({ i, j });
          }
        }
      }
      return emptyCells;
    }

    isGameOver(board, symbol) {
      // Check for horizontal and vertical wins
      for (let i = 0; i < 3; i++) {
        if (
          board[i][0] === symbol &&
          board[i][1] === symbol &&
          board[i][2] === symbol
        ) return { win: true, draw: false };
        if (
          board[0][i] === symbol &&
          board[1][i] === symbol &&
          board[2][i] === symbol
        ) return { win: true, draw: false };
      }
    
      // Check for diagonal wins
      if (
        (board[0][0] === symbol &&
          board[1][1] === symbol &&
          board[2][2] === symbol) ||
        (board[0][2] === symbol &&
          board[1][1] === symbol &&
          board[2][0] === symbol)
      ) {
        return { win: true, draw: false };
      }
    
      // Check for draw
      const isDraw = board.flat().every(cell => cell !== '');
      if (isDraw) return { win: false, draw: true };
    
      // No win or draw
      return { win: false, draw: false };
    }
}

const game = new Game();

document.querySelector('#reset').addEventListener('click', gameBoard.resetGame);
select.addEventListener('change', player.selectSymbol);
cells.forEach(cell => cell.addEventListener('click', game.handleClick));

document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  document.getElementById('copyright-year').textContent = year;
});


