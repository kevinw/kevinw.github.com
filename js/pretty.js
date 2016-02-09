window.initMojulo = function(didUpdate) {
  if (window.Mojulo) {
    var equation = "(0x00ff<<((cos(time/50)+1)*2)*sqrt((x-(W/2))*(x-(W/2))+(y-(W/2))*(y-(W/2)))) / cos(r)";
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    var mojulo = new Mojulo(equation, canvas, didUpdate, {
      manualTime: true
    });
    mojulo.play();
    window.setPrettyCanvas(canvas);
    return mojulo;
  }
  return null;
}
