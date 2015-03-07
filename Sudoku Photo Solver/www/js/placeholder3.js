(function($) {
  function onDeviceReady() {
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByName("gray");

    $('#camera').on('click', function() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 300,
        targetHeight: 300,
      });
    });
  }

  function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
  }

  function onFail(message) {
    alert('Failed because: ' + message);
  }

  document.addEventListener("deviceready", onDeviceReady, false);
})(jQuery);
