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

function processImage(){
  var image = document.getElementById('camImage');
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
/*
  var image = document.getElementById('camImage');
				var raw = [];
				var letters = OCRAD(image, { verbose: true }).letters;
				// here's a list of recognized letters and their corresponding coordinates and confidences
				var wheel_of_fortune = /[123456789]/i;
				var image_offset = image.getBoundingClientRect();
				letters.filter(function(letter){
					// select the letters which have vanna white's approval
					return letter.matches.some(function(match){
						return wheel_of_fortune.test(match.letter);
					});
				}).forEach(function(letter){
					// draw a little yellow box over their faces
					var highlight = document.createElement('div');
					highlight.className = 'highlight';
					highlight.style.top = (letter.y + image_offset.top) + 'px';
					highlight.style.left = (letter.x + image_offset.left) + 'px';
					highlight.style.width = letter.width + 'px';
					highlight.style.height = letter.height + 'px';
					document.body.appendChild(highlight);
				});*/


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
