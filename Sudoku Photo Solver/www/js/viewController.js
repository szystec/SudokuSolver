function solvePuzzle() {
  var solver = new Solver();
  var row, column;
  for ( row = 0; row < 9; row++) {
    for ( column = 0; column < 9; column++) {
      var value = document.getElementById(row.toString() + column.toString()).innerText;
      if (value != '0') {
        solver.sudokuGrid[row][column] = value;
      }
    }
  }
  if (solver.initiateSolver()) {
    for ( row = 0; row < 9; row++) {
      for ( column = 0; column < 9; column++) {
        var cell = document.getElementById(row.toString() + column.toString());
        cell.innerText = solver.sudokuGrid[row][column];
      }
    }
  } else {
    alert("Unable to solve the puzzle!");
  }
}



function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 49 || charCode > 57))
    return false;
  return true;
}

function onTextFieldChanged(evt) {
  var caller = evt.target || evt.srcElement;

  if (caller.innerText == 2) {
    caller.style.backgroundColor = '#afffff';
  } else {
    caller.style.backgroundColor = '#e92929';
  }
}

function clearGrid() {
  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      var cell = document.getElementById(row.toString() + column.toString());
      cell.innerText = null;
      cell.style.backgroundColor = '#ffffff';
    }
  }
}
