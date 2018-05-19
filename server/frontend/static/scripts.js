var App = {
  state: {
    location: null,
    map_type: 'default',
    page_state: null,
    zoom_level: 10
  },

  getState: function() {
    $.getJSON('/state', function(json) {
      console.log(json);

      App.updateLocation(json.location);
      App.updateMapType(json.map_type);
      App.updateZoomLevel(json.zoom_level);
      App.updatePageState(json.page_state);

      window.setTimeout(App.getState, 100);
    });
  },

  updateLocation: function(location) {
    if (location == App.state.location)
      return;

    App.state.location = location;

    Map.changeLocation(location);
  },

  updateMapType: function(map_type) {
    if (map_type == App.state.map_type)
      return;

    App.state.map_type = map_type;

    Map.changeMap(map_type);
  },

  updatePageState: function(page_state) {
    if (page_state == App.state.page_state)
      return;

    App.state.page_state = page_state;

    if (page_state == 'intro') {
      App.intro();
    } else if (page_state == 'map') {
      App.displayMap();
    } else if (page_state == 'vr') {
      window.location.replace('/vr');
    } else {
      window.location.replace('/');
    }
  },

  updateZoomLevel: function(zoom_level) {
    if (zoom_level == App.state.zoom_level)
      return;

    App.state.zoom_level = zoom_level;

    Map.changeZoom(zoom_level);
  },

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
      zoom: App.state.zoom_level,
      layers: [Map.layerLeft],
      zoomControl: false,
    });
  },

  initVR: function() {
    Map.layerRight = Map.initLayer();
    Map.right = L.map('themapvr', {
      center: [45.994099482736715, 14.887847900390625], // lat/lng in EPSG:4326
      zoom: App.state.zoom_level,
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

  changeLocation: function(location) {
    if (!location) return;

    if (Map.left) {
      Map.left.panTo(new L.LatLng(location[0], location[1]));
    }

    if (Map.right) {
      Map.right.panTo(new L.LatLng(location[0], location[1]));
    }
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

  changeZoom: function(zoom) {
    if (Map.left) {
      Map.left.setZoom(zoom);
    }

    if (Map.right) {
      Map.right.setZoom(zoom);
    }
  }
}

$(document).ready(function() {
  App.getState();

  // VR
  if (!$('body').hasClass('vr')) return;

  Map.init();
  Map.initVR();
});
