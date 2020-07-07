/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let endedGame = false;

function makeBoard() {
	// set "board" to empty HEIGHT x WIDTH matrix array
	for (let i = 0; i < HEIGHT; i++) {
		board.push([]);
		for (let j = 0; j < WIDTH; j++) {
			board[i][j] = null;
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	const htmlBoard = document.getElementById('board');

	// Create a top row and give it "column-top" styling, add event listener to top row
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// Create the table "columns" within the first row, give them proper styling and append the entire row
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Create 6 rows and 7 cells within each row. Give each cell a unique id
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (var x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	// loop through the rows - board[loop variable][x];
	for (let i = HEIGHT - 1; i >= 0; i--) {
		if (board[i][x] === null) return i;
	}
	// if the spot = null, return the y coordinate
	// return null after the loop finishes
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// make a div and insert into correct table cell
	let piece = document.createElement('div');
	let slot = document.getElementById(`${y}-${x}`);

	piece.classList.add('piece');
	piece.classList.add('p' + currPlayer);
	slot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	document.querySelector('h3').innerHTML = msg;
	endedGame = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	if (!endedGame) {
		// place piece in board and add to HTML table
		placeInTable(y, x);
		board[y][x] = currPlayer;

		// check for win
		if (checkForWin()) {
			return setTimeout(function() {
				endGame(`Player ${currPlayer} won!`);
			}, 100);
		}

		// check for tie
		for (let i = 0; i < HEIGHT; i++) {
			if (board.every((row) => row.every((slot) => slot !== null))) {
				return setTimeout(function() {
					endGame("It's a tie!");
				}, 100);
			}
		}

		// switch players
		if (currPlayer === 1) {
			currPlayer = 2;
		} else {
			currPlayer = 1;
		}

		// update currentPlayer Display
		let playerDisplay = document.getElementById('player');
		playerDisplay.innerText = currPlayer;
	}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// loops through each slot on the board and defines a horizontal, vertical, or diagonal win for that slot.
	// if a win exists in any direction, function will return true
	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			var horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			var vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			var diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			var diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
