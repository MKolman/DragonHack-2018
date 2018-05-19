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
  init: function() {
    // Sentinel Hub WMS service
    // tiles generated using EPSG:3857 projection - Leaflet takes care of that
    let baseUrl = "https://services.sentinel-hub.com/ogc/wms/eb8d1af9-2242-455d-9719-61ec3f6dc505";
    let sentinelHub = L.tileLayer.wms(baseUrl, {
        tileSize: 512,
        attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
        	 	 	 	maxcc:20,
     	 	 	 	minZoom:6,
     	 	 	 	maxZoom:16,
     	 	 	 	preset:"TRUE_COLOR",
     	 	 	 	layers:"TRUE_COLOR",
     	 	 	 	time:"2015-01-01/2018-05-19",
    });

    let overlayMaps = {
        'Sentinel Hub WMS': sentinelHub
    }

    let map = L.map('themap', {
        center: [45.994099482736715, 14.887847900390625], // lat/lng in EPSG:4326
        zoom: 10,
        layers: [sentinelHub]
    });

    L.control.layers(overlayMaps).addTo(map);
  }
}
