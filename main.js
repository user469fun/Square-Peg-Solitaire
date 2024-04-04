<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Peg Solitaire</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
<style>
  body {
    font-family: 'Roboto', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #141218;
    color: #E6E0E9;
    margin: 0;
  }
  
  .container {
    text-align: center;
  }
  
  h1, .instructions, .timer {
    font-family: 'Roboto', sans-serif;
  }
  
  .board {
    display: grid;
    grid-template-columns: repeat(7, 50px);
    grid-template-rows: repeat(7, 50px);
    margin-bottom: 2rem;
    border-radius: 3.5rem;
    overflow: hidden;
    width: 350px;
    margin: 0 auto; /* Centering the board */
    background-color: #4F378B;
    padding: 1rem;
  }
  
  .cell {
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    transition: background-color 0.3s ease;
    border-radius: 2rem;
  }
  
  .cell.selected {
    background-color: #381E72;
  }
  
  .cell.moving {
    transition: transform 300ms ease;
  }
  
  .cell.moving.occupied {
    transition-delay: 0.3s;
  }
  
  .instructions {
    font-size: 1rem;
    margin-top: 2rem;
  }
  
  .timer {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  
  .btn {
    display: inline-block;
    padding: 0rem 2.5rem;
    font-size: 1rem;
    line-height: 1;
    border-radius: 6rem;
    color: #EADDFF;
    background-color: #4F378B;
    border: 1rem solid transparent;
    box-shadow: 0 1rem 2rem 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    outline: none;
    transition: all 200ms;
  }
  
  .btn:active {
    background-color: #381E72;
  }
</style>
</head>
<body>
<div class="container">
  <h1>Square Peg Solitaire</h1>
  <div class="timer" id="timer">00:00.00</div>
  <div class="board" id="board"></div>
  
  <div class="instructions">
    <p>To play, click on a peg to select it, then click on an empty cell to move the peg there. The peg can only move horizontally or vertically, jumping over another peg into an empty cell.</p>
  </div>
  <button class="btn" id="resetButton">
    Reset Game
  </button>
</div>
<script>
  const board = document.getElementById('board');
  const timerDisplay = document.getElementById('timer');
  let seconds = 0;
  let timerInterval;
  
  const createCell = (row, col) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.innerText = '●';
      cell.addEventListener('click', () => handleClick(cell));
      return cell;
  };
  
  const handleClick = (cell) => {
      if (cell.classList.contains('selected')) {
          cell.classList.remove('selected');
      } else {
          const selected = document.querySelector('.selected');
          if (selected) {
              if (isAdjacent(selected, cell) && !cell.innerText.trim()) {
                  const jumpedCell = getJumpedCell(selected, cell);
                  if (jumpedCell && jumpedCell.innerText === '●') {
                      selected.classList.add('moving');
                      setTimeout(() => {
                          selected.innerText = '';
                          selected.classList.remove('moving');
                      }, 300);
                      jumpedCell.classList.add('moving');
                      setTimeout(() => {
                          jumpedCell.innerText = '';
                          jumpedCell.classList.remove('moving');
                      }, 300);
                      cell.classList.add('moving', 'occupied');
                      setTimeout(() => {
                          cell.innerText = '●';
                          cell.classList.remove('moving', 'occupied');
                      }, 300);
                  }
              }
              selected.classList.remove('selected');
          }
          cell.classList.add('selected');
      }
  };
  
  const isAdjacent = (cell1, cell2) => {
      const row1 = parseInt(cell1.dataset.row);
      const col1 = parseInt(cell1.dataset.col);
      const row2 = parseInt(cell2.dataset.row);
      const col2 = parseInt(cell2.dataset.col);
      return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 2;
  };
  
  const getJumpedCell = (cell1, cell2) => {
      const row1 = parseInt(cell1.dataset.row);
      const col1 = parseInt(cell1.dataset.col);
      const row2 = parseInt(cell2.dataset.row);
      const col2 = parseInt(cell2.dataset.col);
      const jumpedRow = (row1 + row2) / 2;
      const jumpedCol = (col1 + col2) / 2;
      return document.querySelector(`.cell[data-row="${jumpedRow}"][data-col="${jumpedCol}"]`);
  };
  
  const resetGame = () => {
      clearInterval(timerInterval); // Clear the interval
      seconds = 0; // Reset seconds back to 0
      timerInterval = setInterval(updateTimer, 10); // Restart the timer
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell) => {
          cell.innerText = '●';
          cell.classList.remove('moving', 'selected', 'occupied');
      });
      const centerCell = document.querySelector('.cell[data-row="3"][data-col="3"]');
      centerCell.innerText = '';
  };
  
  // Attach the resetGame function to the reset button
  document.getElementById("resetButton").addEventListener('click', resetGame);
  
  // Update timer display
  const updateTimer = () => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const millisecs = Math.floor((seconds % 1) * 100);
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millisecs.toString().padStart(2, '0')}`;
      seconds += 0.01; // Incrementing by 0.01 to represent milliseconds
  };
  
  // Start the timer
  timerInterval = setInterval(updateTimer, 10);
  
  for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
          const cell = createCell(row, col);
          if ((row < 2 || row > 4) && (col < 2 || col > 4)) {
              cell.classList.add('invalid');
          }
          if (row === 3 && col === 3) { // Set the center cell to empty
              cell.innerText = '';
          }
          board.appendChild(cell);
      }
  }
</script>
</body>
</html>
