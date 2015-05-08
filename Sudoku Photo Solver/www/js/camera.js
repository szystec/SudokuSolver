var deviceCamera; //CHANGE to camera if not working
var imageSource = 1;

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
  deviceCamera = navigator.camera;
}

// Called if something bad happens.
//
function onFail(message) {
  alert("Image was not loaded");
}

function ocr() {
  var img = document.getElementById('camImage');
  var ocrText = OCRAD(img, {
    numeric: true
  });

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

  if (!$(".processButtons").hasClass("hide")) {
    $(".processButtons").addClass("hide");
  }

  return true;
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

  return true;
//  this.ocr();
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  var img = document.getElementById('camImage');
  img.src = imageData;

  $(".processButtons").removeClass("hide");

  return true;
//  this.processImage();
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
  this.deviceCamera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 75,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: imageSource,
    targetWidth: 800,
    targetHeight: 800
  });
}
