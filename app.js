var map;
var polylines = [];
var colors = ['#FF0000', '#00FF00', '#0000FF'];


function lineFromText(text) {
  return JSON.parse(text);
}

function drawLine(line, index) {
  new google.maps.Polyline({
    path: line,
    geodesic: true,
    strokeColor: polylineColor(),
    strokeOpacity: 0.5,
    strokeWeight: 5,
    zoom: 12,
    title: index
  }).setMap(map);
  fitView(line);
}

function polylineColor(){
  color = (polylines.length - 1) >= 3 ? '#223344' : colors[polylines.length - 1];
  return color;
}

function fitView(path){
  var centerPointIndex = Math.ceil(path.length / 2);
  map.setCenter(new google.maps.LatLng({lat: path[centerPointIndex].lat , lng: path[centerPointIndex].lng}));

  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < polylines.length; i++) {
    for (var j = 0; j < polylines[i].length; j++) {
      bounds.extend(new google.maps.LatLng(polylines[i][j].lat, polylines[i][j].lng));
    }
  }

  map.fitBounds(bounds);
}

function initMap() {
  google.maps.Map.prototype.clearMarkers = function() {
    if (!this.markers) {
        return;
    }
    for(var i=0; i < this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = [];
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {"lat": 40.765, "lng": -73.975},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
}

$(document).ready(function() {
  $(".add_lines_button").click(function(e) {
    e.preventDefault();
    $(".input_lines_wrap").append('<div><input type="text" name="lines[]"/>&nbsp;<a href="#" class="remove_field">Remove</a></div>');
  });

  $('#draw-button').click(function(e) {
    e.preventDefault();
    map.clearMarkers();
    polylines = [];

    $(".input_lines_wrap input[type='text']").each(function(i) {
      if ($(this).val() !== '') {
        pts = lineFromText($(this).val());
        polylines.push(pts);
        drawLine(pts, 0);
      }
    });
  });

  $('.input_lines_wrap').on("click",".remove_field", function(e) {
    e.preventDefault(); $(this).parent('div').remove();
  });
});
