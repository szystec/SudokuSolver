/*

sudokuSolver.js:
 This files contains the sudolu solver logic algorithm.
 The solver combines two solving algrorithms, Pattern Matching and Backtracking.

*/

// Solver object constructor with two tables, current Sudoku Grid
// and candidate values. Tables are hard coded for better performance.
function Solver() {
  // Main table contating Sudoku grid values and solver input.
  this.sudokuGrid = [
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

  // Table containing candidate cell values based on Sudoku grid
  // and Sudoku rules.
  this.allowedValues = [
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
    [ [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9], [1,2,3,4,5,6,7,8,9]
    ],
  ];
}


// Function updates candidate values in all the cells
// affected by new digit insertion.
Solver.prototype.updateAllowedValues = function(currentRow, currentColumn) {
  var input = this.sudokuGrid[currentRow][currentColumn];
  this.allowedValues[currentRow][currentColumn] = 0;

  // update row
  for (var column = 0; column < 9; column++) {
    for (var rValue = 0; rValue < this.allowedValues[currentRow][column].length; rValue++) {
      if (column != currentColumn && this.allowedValues[currentRow][column][rValue] == input) {
        this.allowedValues[currentRow][column].splice(rValue, 1);
      }
    }
  }

  // update column
  for (var row = 0; row < 9; row++) {
    for (var cValue = 0; cValue < this.allowedValues[row][currentColumn].length; cValue++) {
      if (row != currentRow && this.allowedValues[row][currentColumn][cValue] == input) {
        this.allowedValues[row][currentColumn].splice(cValue, 1);
      }
    }
  }

  // update region
  var regionRow = Math.floor(currentRow / 3);
  var regionColumn = Math.floor(currentColumn / 3);

  for (var reColumn = regionColumn * 3; reColumn < regionColumn * 3 + 3; reColumn++) {
    for (var reRow = regionRow * 3; reRow < regionRow * 3 + 3; reRow++) {
      for (var reValue = 0; reValue < this.allowedValues[reRow][reColumn].length; reValue++) {
        if (reColumn != currentColumn && reRow != currentRow && this.allowedValues[reRow][reColumn][reValue] == input) {
          this.allowedValues[reRow][reColumn].splice(reValue, 1);
        }
      }
    }
  }
};

// Iterates through @sudokuGrid table and removes duplicated cell values
// in @allowedValues table.
Solver.prototype.setAllowedValues = function() {
  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      if (this.sudokuGrid[row][column] != 0) {
        this.updateAllowedValues(row, column);
      }
    }
  }
};

// Searches and inserts all Naked Single digits.
// Returns true if at least one was found.
Solver.prototype.nakedSingle = function() {
  var foundSingle = false;

  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      if (this.sudokuGrid[row][column] == 0 && this.allowedValues[row][column].length == 1) {
        this.sudokuGrid[row][column] = this.allowedValues[row][column][0];
        this.updateAllowedValues(row, column);
        foundSingle = true;
      }
    }
  }
  return foundSingle;
};

// Validates the repetition of the digits in a current row.
// returns true if none found.
Solver.prototype.isRowValid = function(currentRow, currentColumn) {
  var input = this.sudokuGrid[currentRow][currentColumn];
  for (var column = 0; column < 9; column++) {
    if (column != currentColumn && this.sudokuGrid[currentRow][column] == input) {
      return false;
    }
  }
  return true;
};

// Validates the repetition of the digits in a current column.
// returns true if none found.
Solver.prototype.isColumnValid = function(currentRow, currentColumn) {
  var input = this.sudokuGrid[currentRow][currentColumn];
  for (var row = 0; row < 9; row++) {
    if (row != currentRow && this.sudokuGrid[row][currentColumn] == input) {
      return false;
    }
  }
  return true;
};

// Validates the repetition of the digits in a current region.
// returns true if none found.
Solver.prototype.isRegionValid = function(currentRow, currentColumn) {
  var input = this.sudokuGrid[currentRow][currentColumn];
  var regionRow = Math.floor(currentRow / 3);
  var regionColumn = Math.floor(currentColumn / 3);

  for (var column = regionColumn * 3; column < regionColumn * 3 + 3; column++) {
    for (var row = regionRow * 3; row < regionRow * 3 + 3; row++) {
      if (column != currentColumn && row != currentRow && this.sudokuGrid[row][column] == input) {
        return false;
      }
    }
  }
  return true;
};

// Checks all the grid for the patterns.
// loops until no patterns were found.
Solver.prototype.solvePatterns = function() {
  // add new patterns in this if statement using || assignemnt.
  // Make sure they return true if found and false if not.
  if (this.nakedSingle()) {
    this.solvePatterns();
  }
  return false;
};

// Backtracking algorithm logic.
Solver.prototype.solveBacktracking = function(currentRow, currentColumn) {
  // Backtrack new cell
  currentColumn++;
  if (currentColumn > 8) {
    currentColumn = 0;
    currentRow++;
    if (currentRow > 8) {
      return true;
    }
  }

  // if cell already has a digit check if it is valid with Sudoku rules
  // Sanity check for incorrect grids.
  if (this.sudokuGrid[currentRow][currentColumn] != 0) {
    if (!(this.isRowValid(currentRow, currentColumn) && this.isColumnValid(currentRow, currentColumn) && this.isRegionValid(currentRow, currentColumn))) {
      // stop solver if not correct
      return false;
    }
    // if ok proceed to next cell
    return this.solveBacktracking(currentRow, currentColumn);

  } else {
    // Backtracking logic, use only the values from allowedValues table.
    for (var x = 0; x < this.allowedValues[currentRow][currentColumn].length; x++) {
      this.sudokuGrid[currentRow][currentColumn] = this.allowedValues[currentRow][currentColumn][x];
      if (this.isRowValid(currentRow, currentColumn) && this.isColumnValid(currentRow, currentColumn) && this.isRegionValid(currentRow, currentColumn)) {
        // if the value is valid proceed to the next cell.
        if (this.solveBacktracking(currentRow, currentColumn)) {
          return true;
        }
      }
    }
    // fall back to previous cell if no more possible combinations.
    this.sudokuGrid[currentRow][currentColumn] = 0;
    return false;
  }
};

// main solver function, initialises solver logic. 
Solver.prototype.initiateSolver = function() {
  this.setAllowedValues();
  if (this.solvePatterns()) {
    return true;
  } else if (this.solveBacktracking(0, -1)) {
    return true;
  }
  return false;
};
