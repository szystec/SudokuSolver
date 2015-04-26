//loading spinner
$(document).on("click", ".show-page-loading-msg", function() {    
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
});

function cameraImage() {
  capturePhoto();

  if (!$(".imageFail").hasClass("hide")) {
    $(".imageFail").addClass("hide");
  }

  $(".ui-loader").hide();
}

function libraryImage() {
  loadPhoto();

  if (!$(".imageFail").hasClass("hide")) {
    $(".imageFail").addClass("hide");
  }
  $(".ui-loader").hide();
}

function manipulateImage() {
  processImage();
  $(".ui-loader").hide();
}

function readImage() {
  ocr();
  $(".ui-loader").hide();

}

function editSudoku() {
  $("#grid").addClass("edit");
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
      }
    }
  } else {
    alert("Unable to solve the puzzle!");
  }
  //  $.mobile.loading().hide();
}

function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 49 || charCode > 57))
    return false;
  return true;
}

function colour() {
  console.log("im there");
}

function interact(evt) {
  var caller = evt.target || evt.srcElement;

  if ($("#grid").hasClass("edit")) {
    var child = $(caller).children("p").first();

    if ($("#grid").hasClass("tagged")) {
      var element = $(".tag", "#grid");
      var digit = element.text();

      if ($(caller).prop("tagName") == "TD"){
        element.text("");
        child.text(digit);
      }else {
        element.text(caller.innerText);
        caller.innerText = digit;
      }
      $("#grid").removeClass("tagged");
      $(element).removeClass("tag");

    } else {
      if ($(caller).prop("tagName") == "TD") {
        $(child).addClass("tag");

      } else {
        $(caller).addClass("tag");
      }
      $("#grid").addClass("tagged");
      $(caller).css("color", "blue");
    }
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
