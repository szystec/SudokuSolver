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
   }

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as image file URI

  this.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL
  });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Image not taken, because: ' + message);
}
