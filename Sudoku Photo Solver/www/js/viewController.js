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
  capturePhoto();

  if (!$(".imageFail").hasClass("hide")) {
    $(".imageFail").addClass("hide");
  }

}

function libraryImage() {
  loadPhoto();

  if (!$(".imageFail").hasClass("hide")) {
    $(".imageFail").addClass("hide");
  }
}

function manipulateImage() {
  processImage();
}

function readImage() {
  ocr();
}

function editSudoku() {
  $("#grid").addClass("edit");
  $(".userInput").addClass("hide");
  $(".editGrid").removeClass("hide");
}

function editDone() {
  $("#grid").removeClass("edit");
  $(".userInput").removeClass("hide");
  $(".editGrid").addClass("hide");
  if ($("#grid").hasClass("tagged")) {
    $("#grid.tagged").find(".tag").css("background-color", "#f9f9f9").removeClass("tag");
    $("#grid").removeClass("tagged");
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

function moveDigits(caller){
  var child = $(caller).children("p").first();

  if ($("#grid").hasClass("tagged")) {
    var element = $(".tag", "#grid");
    var digit = element.text();

    if ($(caller).prop("tagName") == "TD") {
      element.text("");
      child.text(digit);
    } else {
      element.text(caller.innerText);
      caller.innerText = digit;
    }
    $("#grid").removeClass("tagged");
    $(element).removeClass("tag").css("background-color", "#f9f9f9");

  } else {
    if ($(caller).prop("tagName") == "TD") {
      $(child).addClass("tag");
      $(child).css("background-color", "#98ebe4");

    } else {
      $(caller).addClass("tag").css("background-color", "#98ebe4");
    }
    $("#grid").addClass("tagged");

  }
}

function playGame(caller){
  //at the begining remove class input and tapped
  //to clear previous selectiona and select a new one

  var child = $(caller).children("p").first();

  if ($("#grid").hasClass("input")){

  } else {
    if ($(caller).prop("tagName") == "TD") {
      $(caller).addClass("tapped");
      $(caller).css("background-color", "#93ed94");
      //#grid set class input
    }
  }
}

function interact(evt) {
  var call = evt.target || evt.srcElement;

  if ($("#grid").hasClass("edit")) {
    this.moveDigits(call);
  } else {
    this.playGame(call);
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
