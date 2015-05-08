//loading spinner
/* $(document).on("click", ".show-page-loading-msg", function() {    
  var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly");        
  html = $this.jqmData("html") || "";    
  $.mobile.loading("show", {            
    text: msgText,
                textVisible: textVisible,
                theme: theme,
                textonly: textonly,
                html: html    
  });
}); */

function cameraImage() {
  this.newGame();
  capturePhoto();
}

function libraryImage() {
  this.newGame();
  loadPhoto();
}

function manipulateImage() {
  processImage();
}

function readImage() {
  ocr();
}

function clearImage() {
  var img = document.getElementById('camImage');
  img.parentNode.removeChild(img);

  var canvas = document.getElementById('filterCanvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  if($("#filterCanvas").hasClass("imageProcessed")){
    $("#filterCanvas").removeClass("imageProcessed");
  }

  var cleanImage = $('<img id="camImage">');
  cleanImage.attr('src', "");
  cleanImage.appendTo('#imageDiv');
}

function newGame() {
  this.clearImage();
  this.clearGrid();

  if ($("#grid").hasClass("edit")) {
    this.editDone();
  } else if ($("#grid").hasClass("input")) {
    $("#grid.input").find(".inputCell").css("background-color", "#f9f9f9").removeClass("inputCell");
    $("#grid").removeClass("input");
  }
  if(!$(".processButtons").hasClass("hide")) {
    $(".processButtons").addClass("hide");
  }
}

function editSudoku() {
  $("#grid").addClass("edit");
  $(".playViewFooter").addClass("hide");
  $(".editViewFooter").removeClass("hide");
  if ($("#grid").hasClass("input")) {
    $("#grid.input").find(".inputCell").css("background-color", "#f9f9f9").removeClass("inputCell");
    $("#grid").removeClass("input");
  }
}

function editDone() {
  $("#grid").removeClass("edit");
  $(".playViewFooter").removeClass("hide");
  $(".editViewFooter").addClass("hide");
  if ($("#grid").hasClass("moveDigit")) {
    $("#grid.moveDigit").find(".moveFrom").css("background-color", "#f9f9f9").removeClass("moveFrom");
    $("#grid").removeClass("moveDigit");
  }
}

function moveDigits(caller) {
  var $child = $(caller).children("p").first();
  var $gridCell = $(caller);

  if ($("#grid").hasClass("moveDigit")) {
    var moveFromElement = $(".moveFrom", "#grid");
    var digit = moveFromElement.text();

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
    if ($gridCell.prop("tagName") == "TD") {
      $child.addClass("moveFrom").css("background-color", "#98ebe4");
    } else {
      $gridCell.addClass("moveFrom").css("background-color", "#98ebe4");
    }
    $("#grid").addClass("moveDigit");

  }
}

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

function gridListener(evt) {
  var call = evt.target || evt.srcElement;

  if ($("#grid").hasClass("edit")) {
    this.moveDigits(call);
  } else {
    this.playGame(call);
  }
}

function inputTableListener(evt) {
  var call = evt.target || evt.srcElement;

  if ($("#grid").hasClass("input")) {
    var $inputElement = $(".inputCell", "#grid");
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

function solvePuzzle() {
  var solver = new Solver();
  var row, column;
  for (row = 1; row < 10; row++) {
    for (column = 1; column < 10; column++) {
      var value = document.getElementById(row.toString() + column.toString()).innerText;
      if (value != '0') {
        solver.sudokuGrid[row - 1][column - 1] = value;
      }
    }
  }
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
  //  $.mobile.loading().hide();
}

function clearGrid() {
  for (var row = 1; row < 10; row++) {
    for (var column = 1; column < 10; column++) {
      var cell = document.getElementById(row.toString() + column.toString());
      cell.innerText = "";
    }
  }
}
