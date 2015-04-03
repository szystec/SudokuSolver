var camera;

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
  camera = navigator.camera;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  var image = document.getElementById('myImage');


  // Unhide image elements
  //
  image.style.display = 'block';

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  image.src = "data:image/jpeg;base64," + imageData;


  /*  var fxCanvas = fx.canvas();
    var texture = fxCanvas.texture(image);

    fxCanvas.draw(texture)
      .hueSaturation(-1, -1) //grayscale
      .unsharpMask(20, 2)
      .brightnessContrast(0.4, 0.9)
      .update();

      $(image).attr('src', fxCanvas.toDataURL());*/

}


function ocr() {
  /*var img = document.getElementById('myImage');
  var ocrText = OCRAD(img,{numeric: true});
  var output = document.getElementById("ocr");
  output.innerHTML = ocrText + "image analysed";*/
  var canvas = document.getElementById('myCanvas');
  var img = document.getElementById('myImage');
  var fin = document.getElementById('postConversion');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");


  var c = Filters.filterImage(Filters.sobel, img);
  ctx.putImageData(c, 0, 0);
//  var d = Filters.filterImage(Filters.threshold, canvas, 100);
//  ctx.putImageData(d, 0, 0);


//  ctx.scale(0.2, 0.2);
//  ctx.drawImage(canvas, 0, 0);

  fin.src = canvas.toDataURL("image/jpeg");


}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as image file URI

  this.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 100,
    destinationType: Camera.DestinationType.DATA_URL,
    targetWidth: 400,
    targetHeight: 400
  });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Image not taken, because: ' + message);
}
