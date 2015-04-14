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

function processImage(image){
  var canvas = document.getElementById('filterCanvas');
  canvas.width = image.width;
  canvas.height = image.height;

  var ctx = canvas.getContext("2d");
  var filtered = Filters.filterImage(Filters.threshold, image, 100);
  ctx.putImageData(filtered, 0, 0);

  image.src = canvas.toDataURL("image/jpeg");
  $("#camImage").addClass("imageProcessed");
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  var img = document.getElementById('camImage');

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  img.src = "data:image/jpeg;base64," + imageData;
  this.processImage(img);
}


function ocr() {
  var img = document.getElementById('camImage');
  var ocrText = OCRAD(img,{numeric: true});
  var output = document.getElementById("ocr");
  output.innerHTML = ocrText;
}

function capturePhoto(){
  this.imageSource = 1;
  this.getPhoto();
}

function loadPhoto(){
  this.imageSource = 2;
  this.getPhoto();
}
// A button will call this function
//
function getPhoto() {
  // Take picture using device camera and retrieve image as image file URI

  this.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 100,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType:  imageSource,
    targetWidth: 400,
    targetHeight: 400
  });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Image not taken, because: ' + message);
}

function writeNumber(){
  element = document.getElementById('11');
  element.innerHTML = '2';
  //$("#11").addClass("number");
}
