function Solver() {
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

//TODO
Solver.prototype.setAllowedValues = function() {
    //update the whole table, problem jest taki ze tableka nie jest wczytywana
    //cala od razu tylko po polu. trzeba zmienic zeby wczytalo wszystko i dopiero
    //wykonywalo dzialania

};

//TODO
Solver.prototype.updateAllowedValues = function(currentRow, currentColumn, input) {
  //row po pierwsze usunac wszystkie allowedvalues z pola ktore zostaje wczytane
  //i dopiero usuwac konkretne value z reszty
  for (var column = 0; column < 9; column++) {
    for(var value = 0; value < this.allowedValues[currentRow][column].length; value++){
      if (column != currentColumn && this.allowedValues[currentRow][column][value] == input) {
        this.allowedValues[currentRow][column].splice(value,1);
        console.log(this.allowedValues[currentRow][column].toString());
    }

    }
  }
/*
  //column
  for (var row = 0; row < 9; row++) {
    if (row != currentRow && this.sudokuGrid[row][currentColumn] == input) {
      return false;
    }
  }

  //region
  var regionRow = Math.floor(currentRow / 3);
  var regionColumn = Math.floor(currentColumn / 3);

  for (var rcolumn = regionColumn * 3; rcolumn < regionColumn * 3 + 3; rcolumn++) {
    for (var rrow = regionRow * 3; rrow < regionRow * 3 + 3; rrow++) {
      if (rcolumn != currentColumn && rrow != currentRow && this.sudokuGrid[row][column] == input) {
        return false;
      }
    }
  }*/
};

//TODO
Solver.prototype.nakedSingle = function() {
  var foundSingle = false;

  if(false){
    this.updateAllowedValues();
  }
  return foundSingle;
};

//TODO
Solver.prototype.nakedPair = function() {

  if(false){
    this.updateAllowedValues();
  }
  return false;
};

//TODO
Solver.prototype.hiddenSingle = function() {

  if(false){
    this.updateAllowedValues();
  }
  return false;
};

Solver.prototype.isRowValid = function(currentRow, currentColumn) {
  var input = this.sudokuGrid[currentRow][currentColumn];
  for (var column = 0; column < 9; column++) {
    if (column != currentColumn && this.sudokuGrid[currentRow][column] == input) {
      return false;
    }
  }
  return true;
};

Solver.prototype.isColumnValid = function(currentRow, currentColumn) {
  var input = this.sudokuGrid[currentRow][currentColumn];
  for (var row = 0; row < 9; row++) {
    if (row != currentRow && this.sudokuGrid[row][currentColumn] == input) {
      return false;
    }
  }
  return true;
};

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
  if (this.sudokuGrid[currentRow][currentColumn] != 0) {
    if (!(this.isRowValid(currentRow, currentColumn) && this.isColumnValid(currentRow, currentColumn) && this.isRegionValid(currentRow, currentColumn))) {
      return false;
    }
    return this.solve(currentRow, currentColumn);

  //find patterns
  } else if(this.nakedSingle() || this.nakedPair() || this.hiddenSingle()){
    return this.solve(currentRow, currentColumn);

  //backtrack
  } else {
    for (var x = 1; x < 10; x++) {
      this.sudokuGrid[currentRow][currentColumn] = x;
      if (this.isRowValid(currentRow, currentColumn) && this.isColumnValid(currentRow, currentColumn) && this.isRegionValid(currentRow, currentColumn)) {
    //    this.updateAllowedValues(currentRow, currentColumn);
        if (this.solve(currentRow, currentColumn)) {
          return true;
        }
      }
    }
    this.sudokuGrid[currentRow][currentColumn] = 0;
  //  this.setAllowedValues();
    return false;
  }
};

//TODO
Solver.prototype.initiateSolver = function() {

  if (this.solve(0, -1)) {
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        var cell = document.getElementById(row.toString() + column.toString());
        if(cell.innerText != '0'){
          cell.innerText = this.sudokuGrid[row][column];
          this.updateAllowedValues(row, column, cell.innerText);
        }
      }
    }
    return true;
  } else {
    return false;
  }
};
