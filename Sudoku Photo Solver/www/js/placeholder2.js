document.addEventListener("deviceready", onDeviceReady, false);

function domElement(element) {
  return document.getElementById(element);
}

function onDeviceReady() {
  app = new app();
  app.run();
}

function app() {}

app.prototype = {

  run: function() {
    var that = this;

    domElement("camera").addEventListener("click", function() {
      that._capturePhoto();
    });
  },

  _capturePhoto: function() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
      });
  },

  _onSuccess: function(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
  },

  _onFail: function(message) {
    alert('Failed because: ' + message);
  },

  _getPhoto: function(source) {
    var that = this;
    // Retrieve image file location from specified source.
    navigator.camera.getPicture(function() {
      that._onPhotoURISuccess.apply(that, arguments);
    }, function() {
      app._onFail.apply(that, arguments);
    }, {
      quality: 50,
      destinationType: app._destinationType.FILE_URI,
      sourceType: source
    });
  }

};
