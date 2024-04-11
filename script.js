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

