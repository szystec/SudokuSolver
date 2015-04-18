function Solver() {
  this.workingGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
}

Solver.prototype.isRowValid = function(currentRow, currentColumn) {
  var input = this.workingGrid[currentRow][currentColumn];
  for (var column = 0; column < 9; column++) {
    if (column != currentColumn && this.workingGrid[currentRow][column] == input) {
      return false;
    }
  }
  return true;
};

Solver.prototype.isColumnValid = function(currentRow, currentColumn) {
  var input = this.workingGrid[currentRow][currentColumn];
  for (var row = 0; row < 9; row++) {
    if (row != currentRow && this.workingGrid[row][currentColumn] == input) {
      return false;
    }
  }
  return true;
};

Solver.prototype.isRegionValid = function(currentRow, currentColumn) {
  var input = this.workingGrid[currentRow][currentColumn];
  var regionRow = Math.floor(currentRow / 3);
  var regionColumn = Math.floor(currentColumn / 3);

  for (var column = regionColumn * 3; column < regionColumn * 3 + 3; column++) {
    for (var row = regionRow * 3; row < regionRow * 3 + 3; row++) {
      if (column != currentColumn && row != currentRow && this.workingGrid[row][column] == input) {
        return false;
      }
    }
  }
  return true;
};

Solver.prototype.solve = function(currentRow, currentColumn) {

  currentColumn++;
  if (currentColumn > 8) {
    currentColumn = 0;
    currentRow++;
    if (currentRow > 8) {
      return true;
    }
  }

  // if cell has a predetermined value sanity check if it is valid
  // with Sudoku rules.
  if (this.workingGrid[currentRow][currentColumn] != 0) {
    if (!(this.isRowValid(currentRow, currentColumn) && this.isColumnValid(currentRow, currentColumn) && this.isRegionValid(currentRow, currentColumn))) {
      return false;

    }
    return this.solve(currentRow, currentColumn);

  } else {
    for (var x = 1; x < 10; x++) {
      this.workingGrid[currentRow][currentColumn] = x;
      if (this.isRowValid(currentRow, currentColumn) && this.isColumnValid(currentRow, currentColumn) && this.isRegionValid(currentRow, currentColumn)) {
        if (this.solve(currentRow, currentColumn)) {
          return true;
        }
      }
    }
    this.workingGrid[currentRow][currentColumn] = 0;
    return false;
  }
};

Solver.prototype.initiateSolver= function() {

  if (this.solve(0, -1)) {
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        var cell = document.getElementById(row.toString() + column.toString());
        cell.innerText = this.workingGrid[row][column];
      }
    }
    return true;
  } else {
    return false;
  }
};
