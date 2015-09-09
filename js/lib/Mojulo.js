Mojulo = (function() {
  // Constant properties for all mojulo displays
  // Possibly should be passable as a options hash, but instead making file-global
  var width = 100;
  var height = 100;
  var interval = 1000 / (10 /* fps */);

  // Pad out a string, adding padding to the front until it is the width width
  function pad(str, width, padding) {
    return Array(width - str.length).join(padding) + str;
  }

  function Mojulo(equation, canvas, didUpdate, opts) {
    this.equation  = mathparser.parse(equation); // Generate the equation
    this.canvas    = canvas;
    this.context   = canvas.getContext('2d');
    this.scale     = this.canvas.getAttribute('width') / width;
    this.imageData = this.context.createImageData(width * this.scale, height * this.scale);
    this.then      = +Date.now();
    this.paused    = true;
    this.didUpdate = didUpdate;
    this.manualTime = opts && opts.manualTime;
    this.frame     = 1;
  }

  Mojulo.prototype = {
    updateSize: function() {
      this.context   = this.canvas.getContext('2d');
      this.scale     = this.canvas.getAttribute('width') / width;
      this.imageData = this.context.createImageData(width * this.scale, height * this.scale);
    },

    play: function() {
      this.paused = false;
      this.step();
    },

    pause: function() {
      this.paused = true;
    },

    step: function() {
      // Rerun the step() function every animation frame
      if (this.paused) return;
      requestAnimFrame(this.step.bind(this));

      var now = +Date.now();
      var delta = now - this.then;
      if (delta > interval) {
        this.then = now;
        this.drawFrame();
        if (!this.manualTime)
          this.frame++;
      }
    },

    drawFrame: function() {
      var equationContext = {
        fns: {
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          rand: Math.random,
          sqrt: Math.sqrt
        },

        vars: {
          PI: Math.PI,
          time: this.frame,
          W: width,
          H: height
        }
      };

      var data = this.imageData.data;
      var scale = this.scale;

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          // Set the x, y, r and A variables
          equationContext.vars.x = x;
          equationContext.vars.y = y;
          equationContext.vars.r = Math.sqrt(x * x + y * y);
          equationContext.vars.A = Math.atan(y / x);

          // Get the color
          var color = this.equation(equationContext.fns, equationContext.vars);
          var R = (color & 0xff0000) >>> 16;
          var G = (color & 0x00ff00) >>> 8;
          var B = (color & 0x0000ff) >>> 0;

          var cx = x - width/2;
          var cy = y - height/2;

          var distance = Math.sqrt(cx*cx + cy*cy)/width;
          if (x == width/2 && y == 0)
            window.foo1 = distance;
          if (x == 0 && y == 0)
            window.foo2 = distance;


          var a = 255;//-(Math.sqrt(cx*cx + cy*cy)/width*1.5) * 255;
          if (distance > 0.5) {
            a = 0;
          }

          for (var sx = 0; sx < scale; sx++) {
            for (var sy = 0; sy < scale; sy++) {
              var i = (((y * scale + sy) * width * scale) + (x * scale + sx)) * 4;
              data[i]   = R;
              data[i+1] = G;
              data[i+2] = B;
              data[i+3] = a;
            }
          }
        }
      }

      this.context.putImageData(this.imageData, 0, 0);
      if (this.didUpdate) this.didUpdate();
    }
  };

  var requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 2000);
        };

  return Mojulo;
})();
