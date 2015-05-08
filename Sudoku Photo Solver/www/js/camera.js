/*

Camera.js:
 This files contains camera functionality used for capturing, manipulating
 and retriving the information from of the physical Sudoku puzzles.

*/

// Global camera variable,
// without this variable the camera was not initiating
var deviceCamera;
var imageSource = 1; //By default set to Camera

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available,
// initiate native camera functionality
function onDeviceReady() {
  deviceCamera = navigator.camera;
}

// Displays error message if the image was corrupted
// retriving.
function onFail(message) {
  alert("Image was not loaded");
}

// Optical Character Recognition function,
// uses OCRAD object to perform the recognition on the specified image.
// Due to iOS and Windows Phone Problems the grid update and some view
// manipulation is performed here as well.
function ocr() {
  var img = document.getElementById('filterCanvas');
  var ocrText = OCRAD(img, {
    numeric: true
  });

  // Updates Sudoku grid with the recognised values
  var row = 1;
  var column = 1;
  for (var i = 0; i < ocrText.length; i++) {
    if (ocrText[i] == parseInt(ocrText[i])) {
      var sudokuPlane = document.getElementById(row.toString() + column.toString());
      sudokuPlane.innerHTML = ocrText[i];
      column++;
      if (column == 10) {
        row++;
        column = 1;
      }
    }
  }

  // Udpates footer to fit the purpose
  if (!$(".processingViewFooter").hasClass("hide")) {
    $(".processingViewFooter").addClass("hide");
  }
  $("#filterCanvas").addClass("imageProcessed");

  return true;
}

// Image manipulation function using Filters object from canvasFilters.js
function processImage() {
  var image = document.getElementById('camImage');
  var canvas = document.getElementById('filterCanvas');
  canvas.width = image.width;
  canvas.height = image.height;

  var ctx = canvas.getContext("2d");
  var filtered = Filters.filterImage(Filters.threshold, image, 120);
  ctx.putImageData(filtered, 0, 0);

  this.ocr();
}

// Called when a photo is successfully retrieved,
// cretes the image object using imageData.
function onPhotoDataSuccess(imageData) {
  var img = document.getElementById('camImage');
  img.src = "data:image/jpeg;base64," + imageData;
  $(".processingViewFooter").removeClass("hide");

  this.processImage();
}

// Sets the camera source type to Camera
function capturePhoto() {
  this.imageSource = 1;
  this.getPhoto();
}

// Sets the camera source type to Photo Library
function loadPhoto() {
  this.imageSource = 2;
  this.getPhoto();
}

// Retrives the image from either camera or Photo Library,
function getPhoto() {
  this.deviceCamera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 75,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: imageSource,
    targetWidth: 800,
    targetHeight: 800
  });
}
