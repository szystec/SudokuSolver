/*

viewController.js:
 This files contains view manipulation and components invokng functions.
 All user interactions should pass through this file and be appropriatelly
 pass further.

*/

// Prepares the application for the new image and calls camera function.
// This one function call should retrive, manipulate and OCR the image.
// iOS and Windows Phone break the action after image it retrived.
function cameraImage() {
  this.newGame();
  capturePhoto();
}

// Prepares the application for the new image and calls Photo Library function.
// This one function call should retrive, manipulate and OCR the image.
// iOS and Windows Phone break the action after image it retrived.
function libraryImage() {
  this.newGame();
  loadPhoto();
}

// Used for seperate manipulate image function call.
function manipulateImage() {
  processImage();
}

// Used for seperate OCR image function call.
function readImage() {
  ocr();
}

// Clears the Canvas and image object.
// Called before new image is uploaded.
function clearImage() {
  var img = document.getElementById('camImage');
  img.parentNode.removeChild(img);

  // Canvas clear
  var canvas = document.getElementById('filterCanvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  if ($("#filterCanvas").hasClass("imageProcessed")) {
    $("#filterCanvas").removeClass("imageProcessed");
  }

  //New image object
  var cleanImage = $('<img id="camImage">');
  cleanImage.attr('src', "");
  cleanImage.appendTo('#imageDiv');
}

// Prepares the application for new game.
// Clears Canvas and Image object, clears Sudoku grid
function newGame() {
  this.clearImage();
  this.clearGrid();

  // clears grid tags
  if ($("#grid").hasClass("edit")) {
    this.editDone();
  } else if ($("#grid").hasClass("input")) {
    $("#grid.input").find(".inputCell").css("background-color", "#f9f9f9").removeClass("inputCell");
    $("#grid").removeClass("input");
  }

  // sets defult footer view
  if (!$(".processingViewFooter").hasClass("hide")) {
    $(".processingViewFooter").addClass("hide");
  }
}

// Sets the application interaction to Edit,
// allowing to move the digits around the grid.
function editSudoku() {
  $("#grid").addClass("edit");
  $(".playViewFooter").addClass("hide");
  $(".editViewFooter").removeClass("hide");
  if ($("#grid").hasClass("input")) {
    $("#grid.input").find(".inputCell").css("background-color", "#f9f9f9").removeClass("inputCell");
    $("#grid").removeClass("input");
  }
}

// Restores the default interaction after Edit function.
function editDone() {
  $("#grid").removeClass("edit");
  $(".playViewFooter").removeClass("hide");
  $(".editViewFooter").addClass("hide");
  if ($("#grid").hasClass("moveDigit")) {
    $("#grid.moveDigit").find(".moveFrom").css("background-color", "#f9f9f9").removeClass("moveFrom");
    $("#grid").removeClass("moveDigit");
  }
}

// Clear the whole Sudoku grid.
function clearGrid() {
  for (var row = 1; row < 10; row++) {
    for (var column = 1; column < 10; column++) {
      var cell = document.getElementById(row.toString() + column.toString());
      cell.innerText = "";
    }
  }
}

// Allows to move the Sudoku digits around the grid.
function moveDigits(caller) {
  var $child = $(caller).children("p").first();
  var $gridCell = $(caller);

  if ($("#grid").hasClass("moveDigit")) {
    var moveFromElement = $(".moveFrom", "#grid");
    var digit = moveFromElement.text();

    //if the element was an empty cell
    if ($gridCell.prop("tagName") == "TD") {
      moveFromElement.text("");
      $child.text(digit);
    } else {
      moveFromElement.text(caller.innerText);
      caller.innerText = digit;
    }
    $("#grid").removeClass("moveDigit");
    $(moveFromElement).removeClass("moveFrom").css("background-color", "#f9f9f9");

  } else {
    //if the element was an empty cell
    if ($gridCell.prop("tagName") == "TD") {
      $child.addClass("moveFrom").css("background-color", "#98ebe4");
    } else {
      $gridCell.addClass("moveFrom").css("background-color", "#98ebe4");
    }
    $("#grid").addClass("moveDigit");

  }
}

// Tags the Sudoku grid for user input.
function playGame(caller) {
  var $paragraph = $(caller).children("p").first();
  var $gridCell = $(caller);

  if ($("#grid").hasClass("input")) {
    var inputElement = $(".inputCell", "#grid");
    inputElement.removeClass("inputCell").css("background-color", "#f9f9f9");
    $("#grid").removeClass("input");
  }
  $gridCell.addClass("inputCell").css("background-color", "#93ed94");
  $("#grid").addClass("input");
}

// Sudoku grid listener function.
// Performs different opperations based on grid status.
function gridListener(evt) {
  var call = evt.target || evt.srcElement;

  if ($("#grid").hasClass("edit")) {
    this.moveDigits(call);
  } else {
    this.playGame(call);
  }
}

// Input table listener function.
// inserts the specified digit in the tagged grid place.
function inputTableListener(evt) {
  var call = evt.target || evt.srcElement;

  if ($("#grid").hasClass("input")) {
    var $inputElement = $(".inputCell", "#grid");
    // if the tagged cell is empty.
    if ($inputElement.prop("tagName") == "TD") {
      if (call.innerText == "0") {
        $inputElement.children("p").first().text("");
      } else {
        $inputElement.children("p").first().text(call.innerText);
      }
    } else {
      if (call.innerText == "0") {
        $inputElement.text("");
      } else {
        $inputElement.text(call.innerText);
      }
    }
  }
}

// Solver function call.
// Passes the current grid information to solver object.
// If the puzzle is solved updates the Sudoku grid with the solution,
// displays error otherwise.
function solvePuzzle() {
  var solver = new Solver();

  // get the grid info
  var row, column;
  for (row = 1; row < 10; row++) {
    for (column = 1; column < 10; column++) {
      var value = document.getElementById(row.toString() + column.toString()).innerText;
      if (value != '0') {
        solver.sudokuGrid[row - 1][column - 1] = value;
      }
    }
  }
  // print the solution
  if (solver.initiateSolver()) {
    for (row = 1; row < 10; row++) {
      for (column = 1; column < 10; column++) {
        var cell = document.getElementById(row.toString() + column.toString());
        cell.innerHTML = solver.sudokuGrid[row - 1][column - 1];
        cell.style.color = "green";
      }
    }
  } else {
    alert("Unable to solve the puzzle!");
  }
}
