import "./styles.css";

const playerMarkers = ["X", "O"];
var board; //board  this is going to be 2D
var N; //table size
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
  console.log("Initializing");
  const button = document.getElementById("generateTable");
  button.addEventListener("mousedown", event => {
    board = [];
    N = document.getElementById("tableDim").value;
    addTable(N);
    initialize2DArray(board, N, N);
    //print2DArray(board);
    event.stopPropagation();
  });

  //Generate [N x N] table
  function addTable(N) {
    //const N = document.getElementById("tableDim").value;
    var tab = "";
    //document.write("<table>");

    for (var a = 0; a < N; a++) {
      //document.write("<tr>");
      //document.getElementById("thisTable").innerHTML = "<tr>";
      tab = tab + "<tr>";

      for (var b = 0; b < N; b++) {
        //document.write("<td>" + a * b + "</td>");
        //document.getElementById("thisTable").innerHTML = "<td>" + a * b + "</td>";
        //tab = tab + "<td>" + a * b + "</td>";
        tab = tab + "<td> </td>";
      }

      //document.write("</tr>");
      //document.getElementById("thisTable").innerHTML = "</tr>";
      tab = tab + "</tr>";
    }

    //document.write("</table>");

    //add the whole table in the end of the code in order for the browser to keep up...
    document.getElementById("thisTable").innerHTML = tab;

    //add listener to the cells
    document.querySelector("#thisTable").onclick = function(ev) {
      var rowIndex = ev.target.parentElement.rowIndex;
      var cellIndex = ev.target.cellIndex;

      updateTurn(rowIndex, cellIndex);
      //alert("player: " +turn+ ", [" +rowIndex+ ", " +cellIndex+ "]: " +board[rowIndex][cellIndex]);

      //check winner
      //var res = checkWinner();
      checkWinner();

      /*
      if(res[0] === 1) {
        alert("Player " +res[1]+ " won!");
      }
      */

      //reset turns
      manageTurns();
      //alert('Row = ' + rowIndex + ', Column = ' + cellIndex);
    };
  }
}

function manageTurns() {
  if (turn === playerMarkers.length) {
    turn = 1;
  } else {
    turn++;
  }
}

function initialize2DArray(arr, nrows, ncols) {
  for (var i = 0; i < nrows; i++) {
    arr.push([0]);
    //arr[i] = 0;
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

//sum 1D array
function sum1DArray(arr) {
  var sum = [];
  const n = arr.length;
  initialize1DArray(arr, n);

  for (var i = 0; i < n; i++) {
    sum += arr[i];
  }

  return sum;
}

//sum 2D array rows or columns
function sum2DArray(arr, dim) {
  var i;
  var j;
  const n = arr.length;
  const m = arr[0].length;
  var sum = [];

  if (dim === 2) {
    initialize1DArray(sum, n);
    for (i = 0; i < n; i++) {
      for (j = 0; j < m; j++) {
        sum[i] += arr[i][j];
      }
    }
  } else if (dim === 1) {
    initialize1DArray(sum, m);
    for (j = 0; j < m; j++) {
      for (i = 0; i < n; i++) {
        sum[j] += arr[i][j];
      }
    }
  }

  return sum;
}

//update tables
/*
function updateTurn(i,j) {
    //update turn
    var table = document.getElementById('thisTable');

    if(turn === 1) {
      board[i][j] = 'X';
      //ev.target.value = 'X';
      table.rows[i].cells[j].innerHTML = "X";
    } else {
      board[i][j] = 'O';
      //ev.target.value = 'O';
      table.rows[i].cells[j].innerHTML = "O";
    }
}
*/

function updateTurn(i, j) {
  const noPlayers = playerMarkers.length;
  var table = document.getElementById("thisTable");

  for (var p = 0; p < noPlayers; p++) {
    //players
    if (turn === p + 1) {
      board[i][j] = playerMarkers[p];
      table.rows[i].cells[j].innerHTML = playerMarkers[p];
    }
  }
}

function checkWinner() {
  //Input: markers used by each player
  const noPlayers = playerMarkers.length;

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

  function isWinner(arr) {
    const noPlayers = playerMarkers.length;
    const nRows = arr.length;
    var res = [-1, -1];

    for (var i = 0; i < nRows; i++) {
      for (var j = 0; j < noPlayers; j++) {
        if (arr[i][j] == N) {
          //Note the equality sign here! Triple signs DON'T work here.
          res = [i + 1, j + 1];
          break;
        }
      }
    }
    return res;
  }

  winningCondition = isWinner(rowSums);
  console.log("Row sums:");
  print2DArray(rowSums);
  console.log("Row sums:" + winningCondition);
  if (winningCondition[0] !== -1) {
    console.log(
      "Player " +
        winningCondition[1] +
        " won from row no " +
        winningCondition[0]
    );
    return;
  }

  winningCondition = isWinner(colSums);
  console.log("Col sums:");
  print2DArray(colSums);
  console.log("Col sums:" + winningCondition);
  if (winningCondition[0] !== -1) {
    console.log(
      "Player " +
        winningCondition[1] +
        " won from col no " +
        winningCondition[0]
    );
    return;
  }

  winningCondition = isWinner(diagSums);
  console.log("diag sums:");
  print2DArray(diagSums);
  console.log("Diag sums:" + winningCondition);
  if (winningCondition[0] !== -1) {
    console.log(
      "Player " +
        winningCondition[1] +
        " won from diag no " +
        winningCondition[0]
    );
    return;
  }

  console.log("------------------------");
  /*
  console.log("Row sums:");  print2DArray(rowSums);
  console.log("Col sums:");  print2DArray(colSums);
  console.log("diag sums 1:");  print2DArray(diagSums1);
  console.log("diag sums 2:");  print2DArray(diagSums2);
  console.log("------------------------");
  */
}

/*
function checkWinner() { 
  //Input: markers used by each player 
  const noPlayers = playerMarkers.length;

  var square;
  var res = []; initialize1DArray(res,2);
  res[0] = 0;

  playerLoop: //label the outer loop (or use return)
  for(var p = 0; p < noPlayers; p++) { //players
    var rowSums = [];  
    var colSums = [];  
    var diagSums1 = [];  
    var diagSums2 = [];
    initialize1DArray(rowSums, N);
    initialize1DArray(colSums, N);
    initialize1DArray(diagSums1, N);
    initialize1DArray(diagSums2, N);

    for(var i = 0; i < N; i++) {  //board rows
      for(var j = 0; j < N; j++) { //board columns
        square = board[i][j];

        //check row sums
        if(square === playerMarkers[p]) {
          rowSums[j]++;
          colSums[i]++;

         //check TL-LR diagonal
          if(i === j) {
            diagSums1[i]++;
          }

          //check TR-LL diagonal
          if(j === N-i-1) {
            diagSums2[i]++;
          }
          
          console.log("player " +(p+1)+ " | rowSums: " +rowSums[j]+ ", colSums: " +colSums[i]+ ", diagSums1: " +diagSums1[i]+ ", diagSums2: " +diagSums2[i]);

         //Check winning condition for a player
          if(rowSums[j] === N || colSums[i] === N || diagSums1[i] === N || diagSums2[i] === N) {
            alert('MASSIVILEY AMPLIFIED SQUEAK FART NOISE!')
            res[0] = 1; //raise exit flag
            res[1] = p+1; //store player number
            break playerLoop;
          }
        }

      }
    }
  }

  return res;
}
*/

//check winning condition
/*
function checkWinner() {

  var rowSums = [];  initialize2DArray(rowSums, N,2);
  var colSums = [];  initialize2DArray(colSums, N,2);
  var diagSums1 = [];  initialize2DArray(diagSums1, N,2);
  var diagSums2 = [];  initialize2DArray(diagSums2, N,2);

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(board[i][j] === 'X') {
        rowSums[j][0]++;
        colSums[i][0]++;
        if(colSums[i][0] === N || colSums[i][0] === N) {
          return 1;
        }

      } else if(board[i][j] === 'O') {
        rowSums[j][1]++;
        colSums[i][1]++;
        if(rowSums[j][1] === N || colSums[i][1] === N) {
          return 1;
        }
      }

      if(i === j) {
        if(board[i][j] === 'X') {
          diagSums1[i][0]++;
          if(diagSums1[i][0] === N) {
            return 1;
          }
        } else if(board[i][j] === 'O') {
          diagSums1[i][1]++;
          if(diagSums1[i][1] === N) {
            return 1;
          }
        }
      }

      if(j === N-i-1) {
        if(board[i][j] === 'X') {
          diagSums2[i][0]++;
          if(diagSums2[i][0] === N) {
            return 1;
          }
        } else if(board[i][j] === 'O') {
          diagSums2[i][1]++;
          if(diagSums2[i][1] === N) {
            return 1;
          }
        }
      }

    }
  }

  console.log("Row sums:");
  print2DArray(rowSums);
  
  console.log("Col sums:");
  print2DArray(colSums);
  
  console.log("TL-BR sums:");
  print2DArray(diagSums1);
  
  console.log("TR-BL sums:");
  print2DArray(diagSums2);
  return 0;  
}
*/
