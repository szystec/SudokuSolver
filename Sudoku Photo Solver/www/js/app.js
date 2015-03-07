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
function onPhotoURISuccess(imageURI) {
     // Uncomment to view the image file URI
     // console.log(imageURI);

     // Get image handle
     //
     var largeImage = document.getElementById('largeImage');

     // Unhide image elements
     //
     largeImage.style.display = 'block';

     // Show the captured photo
     // The in-line CSS rules are used to resize the image
     //
     largeImage.src = imageURI;
   }

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  this.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI //0 - DATA_URL, 1 - FILE_URI, 2 - NATIVE_URI
  });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}
