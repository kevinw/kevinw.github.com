(function() {
  var equation = "(0x00ff<<((cos(time/50)+1)*2)*sqrt((x-50)*(x-50)+(y-50)*(y-50))) / cos(r)";
  var mojulo = new Mojulo(equation, document.getElementById("playground-display"));
  mojulo.play();
})();
