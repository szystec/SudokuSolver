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

  Filters.getPixels = function(img) {
    var c,ctx;
    if (img.getContext) {
      c = img;
      try { ctx = c.getContext('2d'); } catch(e) {}
    }
    if (!ctx) {
      c = this.getCanvas(img.width, img.height);
      ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
    }
    return ctx.getImageData(0,0,c.width,c.height);
  };

  Filters.createImageData = function(w, h) {
    return this.tmpCtx.createImageData(w, h);
  };

  Filters.getCanvas = function(w,h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  };

  Filters.filterImage = function(filter, image, var_args) {
    var args = [this.getPixels(image)];
    for (var i=2; i<arguments.length; i++) {
      args.push(arguments[i]);
    }
    return filter.apply(this, args);
  };

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

  Filters.createImageData = function(w, h) {
    return {width: w, height: h, data: this.getFloat32Array(w*h*4)};
  };

}

Filters.runPipeline = function(ds) {
  var res = null;
  res = this[ds[0].name].apply(this, ds[0].args);
  for (var i=1; i<ds.length; i++) {
    var d = ds[i];
    var args = d.args.slice(0);
    args.unshift(res);
    res = this[d.name].apply(this, args);
  }
  return res;
};

Filters.createImageDataFloat32 = function(w, h) {
  return {width: w, height: h, data: this.getFloat32Array(w*h*4)};
};

Filters.identity = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i=0; i<d.length; i++) {
    dst[i] = d[i];
  }
  return output;
};

Filters.grayscale = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = 0.3*r + 0.59*g + 0.11*b;
    dst[i] = dst[i+1] = dst[i+2] = v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.invert = function(pixels) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var d = pixels.data;
  var dst = output.data;
  for (var i=0; i<d.length; i+=4) {
    dst[i] = 255-d[i];
    dst[i+1] = 255-d[i+1];
    dst[i+2] = 255-d[i+2];
    dst[i+3] = d[i+3];
  }
  return output;
};


Filters.threshold = function(pixels, threshold, high, low) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  if (high == null) high = 255;
  if (low == null) low = 0;
  var d = pixels.data;
  var dst = output.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.3*r + 0.59*g + 0.11*b >= threshold) ? high : low;
    dst[i] = dst[i+1] = dst[i+2] = v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.brightnessContrast = function(pixels, brightness, contrast) {
  var lut = this.brightnessContrastLUT(brightness, contrast);
  return this.applyLUT(pixels, {r:lut, g:lut, b:lut, a:this.identityLUT()});
};

Filters.applyLUT = function(pixels, lut) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var d = pixels.data;
  var dst = output.data;
  var r = lut.r;
  var g = lut.g;
  var b = lut.b;
  var a = lut.a;
  for (var i=0; i<d.length; i+=4) {
    dst[i] = r[d[i]];
    dst[i+1] = g[d[i+1]];
    dst[i+2] = b[d[i+2]];
    dst[i+3] = a[d[i+3]];
  }
  return output;
};

Filters.createLUTFromCurve = function(points) {
  var lut = this.getUint8Array(256);
  var p = [0, 0];
  for (var i=0,j=0; i<lut.length; i++) {
    while (j < points.length && points[j][0] < i) {
      p = points[j];
      j++;
    }
    lut[i] = p[1];
  }
  return lut;
};

Filters.identityLUT = function() {
  var lut = this.getUint8Array(256);
  for (var i=0; i<lut.length; i++) {
    lut[i] = i;
  }
  return lut;
};

Filters.invertLUT = function() {
  var lut = this.getUint8Array(256);
  for (var i=0; i<lut.length; i++) {
    lut[i] = 255-i;
  }
  return lut;
};

Filters.brightnessContrastLUT = function(brightness, contrast) {
  var lut = this.getUint8Array(256);
  var contrastAdjust = -128*contrast + 128;
  var brightnessAdjust = 255 * brightness;
  var adjust = contrastAdjust + brightnessAdjust;
  for (var i=0; i<lut.length; i++) {
    var c = i*contrast + adjust;
    lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
  }
  return lut;
};

Filters.convolve = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy*side+cx];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

Filters.verticalConvolve = function(pixels, weightsVector, opaque) {
  var side = weightsVector.length;
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
        var scx = sx;
        var srcOff = (scy*sw+scx)*4;
        var wt = weightsVector[cy];
        r += src[srcOff] * wt;
        g += src[srcOff+1] * wt;
        b += src[srcOff+2] * wt;
        a += src[srcOff+3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

Filters.horizontalConvolve = function(pixels, weightsVector, opaque) {
  var side = weightsVector.length;
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cx=0; cx<side; cx++) {
        var scy = sy;
        var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
        var srcOff = (scy*sw+scx)*4;
        var wt = weightsVector[cx];
        r += src[srcOff] * wt;
        g += src[srcOff+1] * wt;
        b += src[srcOff+2] * wt;
        a += src[srcOff+3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

Filters.separableConvolve = function(pixels, horizWeights, vertWeights, opaque) {
  return this.horizontalConvolve(
    this.verticalConvolveFloat32(pixels, vertWeights, opaque),
    horizWeights, opaque
  );
};

Filters.convolveFloat32 = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageDataFloat32(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy*side+cx];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};


Filters.verticalConvolveFloat32 = function(pixels, weightsVector, opaque) {
  var side = weightsVector.length;
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageDataFloat32(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
        var scx = sx;
        var srcOff = (scy*sw+scx)*4;
        var wt = weightsVector[cy];
        r += src[srcOff] * wt;
        g += src[srcOff+1] * wt;
        b += src[srcOff+2] * wt;
        a += src[srcOff+3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

Filters.horizontalConvolveFloat32 = function(pixels, weightsVector, opaque) {
  var side = weightsVector.length;
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageDataFloat32(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cx=0; cx<side; cx++) {
        var scy = sy;
        var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
        var srcOff = (scy*sw+scx)*4;
        var wt = weightsVector[cx];
        r += src[srcOff] * wt;
        g += src[srcOff+1] * wt;
        b += src[srcOff+2] * wt;
        a += src[srcOff+3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

Filters.separableConvolveFloat32 = function(pixels, horizWeights, vertWeights, opaque) {
  return this.horizontalConvolveFloat32(
    this.verticalConvolveFloat32(pixels, vertWeights, opaque),
    horizWeights, opaque
  );
};

Filters.laplaceKernel = Filters.getFloat32Array(
  [-1,-1,-1,
   -1, 8,-1,
   -1,-1,-1]);
Filters.laplace = function(pixels) {
  return Filters.convolve(pixels, this.laplaceKernel, true);
};

Filters.sobelSignVector = Filters.getFloat32Array([-1,0,1]);
Filters.sobelScaleVector = Filters.getFloat32Array([1,2,1]);

Filters.sobelVerticalGradient = function(px) {
  return this.separableConvolveFloat32(px, this.sobelSignVector, this.sobelScaleVector);
};

Filters.sobelHorizontalGradient = function(px) {
  return this.separableConvolveFloat32(px, this.sobelScaleVector, this.sobelSignVector);
};

Filters.sobelVectors = function(px) {
  var vertical = this.sobelVerticalGradient(px);
  var horizontal = this.sobelHorizontalGradient(px);
  var id = {width: vertical.width, height: vertical.height,
            data: this.getFloat32Array(vertical.width*vertical.height*8)};
  var vd = vertical.data;
  var hd = horizontal.data;
  var idd = id.data;
  for (var i=0,j=0; i<idd.length; i+=2,j++) {
    idd[i] = hd[j];
    idd[i+1] = vd[j];
  }
  return id;
};

Filters.sobel = function(px) {
  px = this.grayscale(px);
  var vertical = this.sobelVerticalGradient(px);
  var horizontal = this.sobelHorizontalGradient(px);
  var id = this.createImageData(vertical.width, vertical.height);
  for (var i=0; i<id.data.length; i+=4) {
    var v = Math.abs(vertical.data[i]);
    id.data[i] = v;
    var h = Math.abs(horizontal.data[i]);
    id.data[i+1] = h;
    id.data[i+2] = (v+h)/4;
    id.data[i+3] = 255;
  }
  return id;
};

Filters.bilinearSample = function (pixels, x, y, rgba) {
  var x1 = Math.floor(x);
  var x2 = Math.ceil(x);
  var y1 = Math.floor(y);
  var y2 = Math.ceil(y);
  var a = (x1+pixels.width*y1)*4;
  var b = (x2+pixels.width*y1)*4;
  var c = (x1+pixels.width*y2)*4;
  var d = (x2+pixels.width*y2)*4;
  var df = ((x-x1) + (y-y1));
  var cf = ((x2-x) + (y-y1));
  var bf = ((x-x1) + (y2-y));
  var af = ((x2-x) + (y2-y));
  var rsum = 1/(af+bf+cf+df);
  af *= rsum;
  bf *= rsum;
  cf *= rsum;
  df *= rsum;
  var data = pixels.data;
  rgba[0] = data[a]*af + data[b]*bf + data[c]*cf + data[d]*df;
  rgba[1] = data[a+1]*af + data[b+1]*bf + data[c+1]*cf + data[d+1]*df;
  rgba[2] = data[a+2]*af + data[b+2]*bf + data[c+2]*cf + data[d+2]*df;
  rgba[3] = data[a+3]*af + data[b+3]*bf + data[c+3]*cf + data[d+3]*df;
  return rgba;
};



if (typeof require != 'undefined') {
  exports.Filters = Filters;
}