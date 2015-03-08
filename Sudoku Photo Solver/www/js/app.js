var camera;
// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

function id(element) {
  return document.getElementById(element);
}

// device APIs are available
//
function onDeviceReady() {
  camera = navigator.camera;
  cameraApp = new cameraApp();
  cameraApp.run();
}

function cameraApp() {}

cameraApp.prototype = {
  _pictureSource: null,

 _destinationType: null,

  run: function() {
    var that = this;
    id("cameraBtn").addEventListener("click", function() {
      that._capturePhoto(that, arguments);
    });
  },

  // Called when a photo is successfully retrieved
  //
  _onPhotoDataSuccess: function(imageData) {
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
  },

  // A button will call this function
  //
  _capturePhoto: function() {
    var that = this;

    // Take picture using device camera and retrieve image as image file URI

    this.camera.getPicture(function() {
      that._onPhotoDataSuccess(that, arguments);
    }, function(){
      that._onFail(that, arguments);
    }, {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL
    });
  },

  // Called if something bad happens.
  //
  _onFail: function(message) {
    alert('Image not taken, because: ' + message);
  }

};
