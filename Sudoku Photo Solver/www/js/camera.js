var camera;
var imageSource = 1;

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
  camera = navigator.camera;
}

// Called if something bad happens.
//
function onFail(message) {
  $(".imageFail").removeClass("hide");
  $.mobile.loading("hide");
}

function ocr() {
  var img = document.getElementById('camImage');
  var ocrText = OCRAD(img, {
    numeric: true
  });

  var row = 0;
  var column = 0;
  for (var i = 0; i < ocrText.length; i++) {
    if (ocrText[i] == parseInt(ocrText[i])) {
      var sudokuPlane = document.getElementById(row.toString() + column.toString());
      sudokuPlane.innerHTML = ocrText[i];
      column++;
      if (column == 9) {
        row++;
        column = 0;
      }
    }
  }


  $("#camera").addClass("hide");
  $(img).addClass("imageProcessed");
  if (!$(".processButtons").hasClass("hide")) {
    $(".processButtons").addClass("hide");
  }
  $.mobile.loading("hide");
  //  navigator.camera.cleanup();
}

function processImage() {
  var image = document.getElementById('camImage');
  var canvas = document.getElementById('filterCanvas');
  canvas.width = image.width;
  canvas.height = image.height;

  var ctx = canvas.getContext("2d");
  var filtered = Filters.filterImage(Filters.threshold, image, 120);
  ctx.putImageData(filtered, 0, 0);

  image.src = canvas.toDataURL("image/jpeg");

  this.ocr();
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  var img = document.getElementById('camImage');
  img.src = "data:image/jpeg;base64," + imageData;

  $(".processButtons").removeClass("hide");
  this.processImage();
}

function capturePhoto() {
  this.imageSource = 1;
  this.getPhoto();
}

function loadPhoto() {
  this.imageSource = 2;
  this.getPhoto();
}

function getPhoto() {
  this.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 75,
    //change destinationType to DATA_URL to use in a simulator
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: imageSource,
    targetWidth: 800,
    targetHeight: 800
  });
}
