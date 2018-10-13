"use strict";

update_scores()
var score = 0;

const BOARD_SIZE = 4;

const DIRECTION = Object.freeze({
  NONE: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4
});

//identity function. if we bring in lodash, we can get rid of this
const IDENTITY = (x) => x;

//range generator. another thing provided by lodash
function range(size, start = 0) {
  return Array.from(Array(size).keys()).map((n) => n + start);
}

function randInt(upper) {
  return Math.floor(Math.random() * upper);
}

class Tile {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.color = "white";
    this.element = document.createElement('div');
    this.element.textContent = value;
    this.element.classList.add("tile");
    this.element.classList.add(`value_${this.value}`)
  }

  doubleValue() {
    this.element.classList.remove(`value_${this.value}`)
    this.value = this.value * 2;
    this.element.textContent = this.value;
    this.element.classList.add(`value_${this.value}`);
    score += this.value;
    updateLocalScore();
  }
}

class Game {
  constructor(gameElement) {
    this.gameElement = gameElement;
    this.gameBoard = new Array(BOARD_SIZE);
    for (let i in range(BOARD_SIZE)) {
      this.gameBoard[i] = new Array(BOARD_SIZE);
    }
  }

  init() {
    console.debug("Initializing new game!")
    this._dropRandomTiles(2);
  }

  handleMove(direction) {
    let tilesMoved = false;

    for(let primary_axis in range(BOARD_SIZE)) {
      for(let secondary_axis in range(BOARD_SIZE)) {
        let move;
        switch(direction) {
          case DIRECTION.UP:
            move = this._handleMoveUp(primary_axis, secondary_axis);
            break;
          case DIRECTION.LEFT:
            move = this._handleMoveLeft(secondary_axis, primary_axis);
            break;
          case DIRECTION.DOWN:
            move = this._handleMoveDown(this._reverseAxis(primary_axis), secondary_axis);
            break;
          case DIRECTION.RIGHT:
            move = this._handleMoveRight(secondary_axis, this._reverseAxis(primary_axis));
            break;
          default:
            console.debug("Move called with invalid direction!")
            move = null;
        }
        if(move) {
          tilesMoved = true;
          this._moveTile(move.old.row, move.old.col, move.new.row, move.new.col);

          if(move.combine && move.combine === true) {
            this.gameBoard[move.new.row][move.new.col].doubleValue();
          }
        }

      }
    }

    // add a tile to a random location, but only if a move occurred
    if(tilesMoved) {
      this._dropRandomTiles(1);
    } else {
      if(this.getNumTiles() === BOARD_SIZE * BOARD_SIZE) {
        console.debug("Game over!");
        alert("Game over!");
      }
    }
  }

  // wipe the tiles off the board for a reset
  destroy() {
    this.gameElement.querySelectorAll(".row > .cell").forEach((cell) => cell.firstChild ?cell.removeChild(cell.firstChild) : null)
  }

  getNumTiles() {
    return this.gameBoard.flatMap((row) => {
      return row.flatMap((elem) => elem ? 1 : 0);
    }).reduce((acc, val) => {
      return acc += val;
    });
  }

  // gets the reversed index (e.g. first -> last, last -> first)
  _reverseAxis(axis) {
    return BOARD_SIZE - axis - 1;
  }

  _handleMoveUp(row, col) {
    let myComparator = (newRow, _) => {
      return newRow >= 0;
    }
    let myMod = (row) => parseInt(row - 1);

    return this.__handleMove(row, col, myComparator, myMod, IDENTITY);
  }

  _handleMoveDown(row, col) {
    let myComparator = (newRow, _) => {
      return newRow < BOARD_SIZE;
    }
    let myMod = (row) => parseInt(row + 1);

    return this.__handleMove(row, col, myComparator, myMod, IDENTITY);
  }

  _handleMoveRight(row, col) {
    let myComparator = (_, newCol) => {
      return newCol < BOARD_SIZE;
    }
    let myMod = (col) => parseInt(col + 1);

    return this.__handleMove(row, col, myComparator, IDENTITY, myMod);
  }

  _handleMoveLeft(row, col) {
    let myComparator = (_, newCol) => {
      return newCol >= 0;
    }
    let myMod = (col) => parseInt(col - 1);

    return this.__handleMove(row, col, myComparator, IDENTITY, myMod);
  }

  //janky-ass abstraction around movement generation
  __handleMove(row, col, comparator, modRow = IDENTITY, modCol = IDENTITY) {
    let myTile = this.gameBoard[row][col]

    if(!myTile) {
      // fail fast for empty tiles
      return null;
    }

    let newRow = modRow(row), newCol = modCol(col);
    let movement = null;

    //move tiles until we get to a filled one, then see if we can combine
    while(comparator(newRow, newCol)) {
      let tileTocheck = this.gameBoard[newRow][newCol];

      //tile exists: break out, and maybe combine
      if(tileTocheck) {
        if(tileTocheck.value === myTile.value) {
          movement = {
            old: {
              row: row,
              col: col
            },
            new: {
              row: newRow,
              col: newCol
            },
            combine: true
          };
        }
        return movement;
      }

      //tile doesn't exist: just move
      movement = {
        old: {
          row: row,
          col: col
        },
        new: {
          row: newRow,
          col: newCol
        },
        combine: false
      };

      newRow = modRow(newRow)
      newCol = modCol(newCol)
    }

    return movement;
  }

  _dropRandomTiles(count = 1) {
    let emptyTiles = new Array();
    for(let row in range(4)) {
      for(let col in range(4)) {
        if(!this.gameBoard[row][col]) {
          emptyTiles.push({row: row, col: col});
        }
      }
    }

    for(let _ in range(count)) {
      let chosenTile = emptyTiles.splice(randInt(emptyTiles.length) , 1)[0];

      this._addTile(parseInt(chosenTile.row), parseInt(chosenTile.col), this._pickInitVal());
    }
  }

  _addTile(row, col, val) {
    console.debug(`Adding tile at row: ${row}, column: ${col} with value: ${val}`);
    let newTile = new Tile(row, col, val);
    this.gameBoard[row][col] = newTile;
    let query = `.cell.row_${row + 1}.col_${col + 1}`
    console.debug(`Using query: ${query}`)
    document.querySelector(query).append(newTile.element)
  }

  _moveTile(startRow, startCol, endRow, endCol) {
    let parentDiv = document.querySelector(`.cell.row_${parseInt(endRow) + 1}.col_${parseInt(endCol) + 1}`);
    let oldTile = this.gameBoard[endRow][endCol];
    if(oldTile) {
      parentDiv.removeChild(oldTile.element);
    }

    let tile = this.gameBoard[startRow][startCol];
    this.gameBoard[endRow][endCol] = tile;
    tile.row = endRow;
    tile.col = endCol;
    this.gameBoard[startRow][startCol] = null;

    tile.element.parentElement.removeChild(tile.element)
    parentDiv.appendChild(tile.element);
  }

  _pickInitVal() {
    return (randInt(5) === 0) ? 4 : 2;
  }
}

function newGame() {
  if(window.game) {
    highscore(score);
    window.game.destroy();
    delete(window.game);
  }
  score = 0;

  window.game = new Game(document.getElementById("gameBoard"));
  window.game.init();

  updateLocalScore();
}

function updateLocalScore() {
  document.getElementById("scoreContainer").textContent = score;
}

document.addEventListener("DOMContentLoaded", () => {
  console.debug("Document loaded!");

  // bind the game object to the window for ease of debugging, and ensure it's a singleton
  if(!window.game) {
    newGame()

    document.addEventListener("keydown", (e) => {
      console.debug("Key pressed!")
      switch(e.key) {
        case "ArrowUp":
          window.game.handleMove(DIRECTION.UP)
          break;
        case "ArrowLeft":
          window.game.handleMove(DIRECTION.LEFT)
          break;
        case "ArrowDown":
          window.game.handleMove(DIRECTION.DOWN)
          break;
        case "ArrowRight":
          window.game.handleMove(DIRECTION.RIGHT)
          break;
        default:
          //no-op
      }
    });

    document.getElementById("newGame").onclick = (_) => {
      newGame();
    }
  }
});
