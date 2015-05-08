/*
 * Author:  Ilmari Heikkinen
 *
 * https://github.com/kig/canvasfilters
 * http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 *
 * Copyright 2011  Ilmari Heikkinen
 * Released under the MIT license.
 * https://github.com/kig/canvasfilters/blob/master/README
 *
 */

// Filters object with the pipeline function for convinient
// filter usage.
Filters = {};

if (typeof Float32Array == 'undefined') {
  Filters.getFloat32Array =
    Filters.getUint8Array = function(len) {
      if (len.length) {
        return len.slice(0);
      }
      return new Array(len);
    };
} else {
  Filters.getFloat32Array = function(len) {
    return new Float32Array(len);
  };
  Filters.getUint8Array = function(len) {
    return new Uint8Array(len);
  };
}

if (typeof document != 'undefined') {
  Filters.tmpCanvas = document.createElement('canvas');
  Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

  // getPixels returns the ImageData object for an image or a canvas element.
  Filters.getPixels = function(img) {
    var c, ctx;
    if (img.getContext) {
      c = img;
      try {
        ctx = c.getContext('2d');
      } catch (e) {}
    }
    if (!ctx) {
      c = this.getCanvas(img.width, img.height);
      ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
    }
    return ctx.getImageData(0, 0, c.width, c.height);
  };

  // createImageData creates an ImageData object of the wanted dimensions.
  Filters.createImageData = function(w, h) {
    return this.tmpCtx.createImageData(w, h);
  };

  // getCanvas gets a canvas of the wanted dimensions.
  Filters.getCanvas = function(w, h) {
    //  var c = document.createElement('canvas');
    var c = document.getElementById('filterCanvas');
    c.width = w;
    c.height = h;
    return c;
  };

  // filterImage applies a filter function to an image or canvas element.
  // Arguments from the third onwards are passed as extra arguments to the filter function.
  Filters.filterImage = function(filter, image, var_args) {
    var args = [this.getPixels(image)];
    for (var i = 2; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return filter.apply(this, args);
  };

  // toCanvas returns a new canvas filled with the given ImageData object.
  Filters.toCanvas = function(pixels) {
    var canvas = this.getCanvas(pixels.width, pixels.height);
    canvas.getContext('2d').putImageData(pixels, 0, 0);
    return canvas;
  };


  Filters.toImageData = function(pixels) {
    return this.identity(pixels);
  };

} else {

  onmessage = function(e) {
    var ds = e.data;
    if (!ds.length) {
      ds = [ds];
    }
    postMessage(Filters.runPipeline(ds));
  };

  // createImageData creates an ImageData object of the wanted dimensions.
  Filters.createImageData = function(w, h) {
    return {
      width: w,
      height: h,
      data: this.getFloat32Array(w * h * 4)
    };
  };

}

Filters.runPipeline = function(ds) {
  var res = null;
  res = this[ds[0].name].apply(this, ds[0].args);
  for (var i = 1; i < ds.length; i++) {
    var d = ds[i];
    var args = d.args.slice(0);
    args.unshift(res);
    res = this[d.name].apply(this, args);
  }
  return res;
};

// createImageData creates an ImageData-like object backed by a Float32Array
// of the wanted dimensions.
Filters.createImageDataFloat32 = function(w, h) {
  return {
    width: w,
    height: h,
    data: this.getFloat32Array(w * h * 4)
  };
};

// identity returns a copy of the ImageData.
Filters.identity = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i = 0; i < d.length; i++) {
    dst[i] = d[i];
  }
  return output;
};

// grayscale converts the image to grayscale using
// (0.3*r + 0.59*g + 0.11*b).
Filters.grayscale = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = 0.3 * r + 0.59 * g + 0.11 * b;
    dst[i] = dst[i + 1] = dst[i + 2] = v;
    dst[i + 3] = d[i + 3];
  }
  return output;
};

// threshold converts the image to a two-color image with
// pixels brighter than or equal to the threshold value rendered white and
// pixels darker than the threshold rendered black
// The filter uses grayscale to compute the value of a pixel.
// (0.3*r + 0.59*g + 0.11*b).
Filters.threshold = function(pixels, threshold, high, low) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  if (high == null) high = 255;
  if (low == null) low = 0;
  var d = pixels.data;
  var dst = output.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = (0.3 * r + 0.59 * g + 0.11 * b >= threshold) ? high : low;
    dst[i] = dst[i + 1] = dst[i + 2] = v;
    dst[i + 3] = d[i + 3];
  }
  return output;
};

// brightnessContrast adjusts the brightness and contrast of the image.
// The brightness value ranges between -1 .. 1, with 0 being neutral.
// The contrast value ranges between 0 .. 127, with 1 being neutral.
Filters.brightnessContrast = function(pixels, brightness, contrast) {
  var lut = this.brightnessContrastLUT(brightness, contrast);
  return this.applyLUT(pixels, {
    r: lut,
    g: lut,
    b: lut,
    a: this.identityLUT()
  });
};

// applyLUT applies a color lookup table to the image.
// The lookup table is an object of form
// {r:Uint8[256], g:Uint8[256], b:Uint8[256], a:Uint8[256]}
// Result pixel values are calculated by looking up the current value from
// the corresponding lookup table: [lut.r[r], lut.g[g], lut.b[b], lut.a[a]]
Filters.applyLUT = function(pixels, lut) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var d = pixels.data;
  var dst = output.data;
  var r = lut.r;
  var g = lut.g;
  var b = lut.b;
  var a = lut.a;
  for (var i = 0; i < d.length; i += 4) {
    dst[i] = r[d[i]];
    dst[i + 1] = g[d[i + 1]];
    dst[i + 2] = b[d[i + 2]];
    dst[i + 3] = a[d[i + 3]];
  }
  return output;
};

Filters.identityLUT = function() {
  var lut = this.getUint8Array(256);
  for (var i = 0; i < lut.length; i++) {
    lut[i] = i;
  }
  return lut;
};

Filters.brightnessContrastLUT = function(brightness, contrast) {
  var lut = this.getUint8Array(256);
  var contrastAdjust = -128 * contrast + 128;
  var brightnessAdjust = 255 * brightness;
  var adjust = contrastAdjust + brightnessAdjust;
  for (var i = 0; i < lut.length; i++) {
    var c = i * contrast + adjust;
    lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
  }
  return lut;
};
