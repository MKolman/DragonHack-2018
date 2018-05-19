var App = {
  intro: function() {
    $('#intro-caption').fadeOut(500, function() {
      $('#intro-caption').remove();
      $('#locating').fadeIn(250);
    });
    $('body').removeClass('intro');
  },

  displayMap: function() {
    $('#locating').fadeOut(250, function() {
      $('#locating').remove();
    });

    Map.init();
  }
}

var Map = {
  left: null,
  right: null,
  layerLeft: null,
  layerRight: null,

  init: function() {
    Map.layerLeft = Map.initLayer();
    Map.left = L.map('themap', {
      center: [45.994099482736715, 14.887847900390625], // lat/lng in EPSG:4326
      zoom: 10,
      layers: [Map.layerLeft],
      zoomControl: false,
    });
  },

  initVR: function() {
    Map.layerRight = Map.initLayer();
    Map.right = L.map('themapvr', {
      center: [45.994099482736715, 14.887847900390625], // lat/lng in EPSG:4326
      zoom: 10,
      layers: [Map.layerRight],
      zoomControl: false,
    });
    Map.left.sync(Map.right);
    Map.right.sync(Map.left);
  },

  initLayer: function() {
    let baseUrl = "https://services.sentinel-hub.com/ogc/wms/eb8d1af9-2242-455d-9719-61ec3f6dc505";
    return L.tileLayer.wms(baseUrl, {
      tileSize: 512,
      attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
      maxcc: 20,
      minZoom: 6,
      maxZoom: 16,
      preset: "TRUE_COLOR",
      layers: "TRUE_COLOR",
      time: "2015-01-01/2018-05-19",
    });
  },

  changeMap: function(map) {
    if (Map.layerLeft) {
      Map.layerLeft.setParams({
        preset: "FALSE_COLOR",
        layers: "FALSE_COLOR"
      }, false);
    }

    if (Map.layerRight) {
      Map.layerRight.setParams({
        preset: "FALSE_COLOR",
        layers: "FALSE_COLOR"
      }, false);
    }
  },


}



$(document).ready(function() {
  // request


  // VR
  if (!$('body').hasClass('vr')) return;

  Map.init();
  Map.initVR();
});
