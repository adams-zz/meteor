function getScript(src) {
    document.write('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSoM9HgrTGLXgnm9mjzDY0194TPVx0mtw&sensor=true" type="text/javascript"></script>');
}

getScript();

Template.map.rendered = function() {
    var mapOptions;
    mapOptions = {
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      scrollwheel: false,
      zoom: 13,
      center: new google.maps.LatLng(37.755401, -122.446806),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    return map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
};

function getCanvasSize() {
  // TODO better const
  canvasWidth = document.getElementById("map_canvas").offsetWidth;
  console.log(canvasWidth);
  canvasHeight = 
      document.getElementById("map_canvas").offsetHeight - MAP_VERT_PADDING * 2;
}

getCanvasSize();