import "./styles.css";

const playerMarkers = ["x", "o"];
const noPlayers = playerMarkers.length;
var board; //board  this is going to be 2D
var N = 5; //board size
var turn = 1; //player's turn

//initialization
if (document.readyState !== "loading") {
  // Document ready, executing
  console.log("Document ready, executing");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function() {
    // Document was not ready, executing when loaded
    console.log("Document ready, executing after a wait");
    initializeCode();
  });
}

function initializeCode() {
  board = [];
  addTable(N);
  initialize2DArray(board, N, N);

  //Generate [N x N] table
  function addTable(N) {
    //const N = document.getElementById("tableDim").value;
    var tab = "";
    //document.write("<table>");

    for (var a = 0; a < N; a++) {
      tab = tab + "<tr>";

      for (var b = 0; b < N; b++) {
        tab = tab + "<td> </td>";
      }
      tab = tab + "</tr>";
    }

    //add the whole table in the end of the code in order for the browser to keep up...
    document.getElementById("board").innerHTML = tab;

    //add listener to the cells
    document.querySelector("#board").onclick = function(ev) {
      var rowIndex = ev.target.parentElement.rowIndex;
      var cellIndex = ev.target.cellIndex;
      updateTurn(rowIndex, cellIndex);
      checkWinner();
      manageTurns();
    };
  }
}

//advance turns and resets to 1
function manageTurns() {
  if (turn === noPlayers) {
    turn = 1;
  } else {
    turn++;
  }
}

function initialize2DArray(arr, nrows, ncols) {
  for (var i = 0; i < nrows; i++) {
    arr.push([0]);
    for (var j = 0; j < ncols; j++) {
      arr[i][j] = 0;
    }
  }
}

function print2DArray(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[0].length; j++) {
      if (j < arr[0].length - 1) {
        str = str + arr[i][j] + ", ";
      } else {
        str = str + arr[i][j] + "\n";
      }
    }
  }
  console.log(str);
}

function initialize1DArray(arr, n) {
  for (var i = 0; i < n; i++) {
    arr.push(0);
  }
}

function updateTurn(i, j) {
  var table = document.getElementById("board");

  for (var p = 0; p < noPlayers; p++) {
    //players
    if (turn === p + 1) {
      board[i][j] = playerMarkers[p];
      table.rows[i].cells[j].innerHTML = playerMarkers[p];
    }
  }
}

function checkWinner() {
  var square;
  var rowSums = [];
  var colSums = [];
  var diagSums = [];
  var winningCondition;

  initialize2DArray(rowSums, N, noPlayers);
  initialize2DArray(colSums, N, noPlayers);
  initialize2DArray(diagSums, 2, noPlayers);

  for (var p = 0; p < noPlayers; p++) {
    //players

    for (var i = 0; i < N; i++) {
      //board rows
      for (var j = 0; j < N; j++) {
        //board columns
        square = board[i][j];

        //check row sums
        if (square == playerMarkers[p]) {
          rowSums[i][p]++;
          colSums[j][p]++;

          //check TL-LR diagonal
          if (i == j) {
            diagSums[0][p]++;
          }

          //check TR-LL diagonal
          if (j == N - i - 1) {
            diagSums[1][p]++;
          }
        }
      }
    }
  }

  //check 2D array counts
  function isWinner(arr) {
    const nRows = arr.length;
    var res = [-1, -1];

    for (var i = 0; i < nRows; i++) {
      for (var j = 0; j < noPlayers; j++) {
        if (arr[i][j] == N) {
          //Note the equality sign here! Triple signs DON'T work here.
          res = [i + 1, j + 1];
          alert("Player " + (j + 1) + " won!"); //or use 'turn' in place of (j+1)
          break;
        }
      }
    }
    return res;
  }

  winningCondition = isWinner(rowSums);
  winningCondition = isWinner(colSums);
  winningCondition = isWinner(diagSums);
}
