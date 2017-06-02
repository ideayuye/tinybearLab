
var L = require('leaflet');
require('./LeafletPlayback');

var mymap = L.map('mapid').setView([22.516818, 113.898495], 13);

L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    subdomains:'7'
}).addTo(mymap);


var greenIcon = L.icon({
    iconUrl: 'people.png',
    iconSize:     [21, 26], // size of the icon
    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
});

var marker = L.marker([113.887125, 22.522761].reverse(),{icon:greenIcon});
marker.addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
marker.openPopup();

marker.remove();

marker = L.marker([113.887125, 22.522761].reverse(),{icon:greenIcon});
marker.addTo(mymap);


// var marker1 = L.marker([113.887125, 22.522761].reverse(),{icon:greenIcon});
// marker1.addTo(mymap);

//geoJSON
var geoFeature = {
		'type': 'Feature',
		'properties': {
			'name': '区域地块1',
			'type': 'area',
		},
		'geometry': {
			'type': 'Polygon',
			'coordinates': [
				[
					[113.86, 22.54],
					[113.95, 22.56],
					[114.00, 22.53],
					[113.96, 22.52],
					[113.88, 22.51],
					[113.86, 22.54],
				]],
		},
	}

var geo = L.geoJSON(geoFeature,{
    color:"#f50"
}).addTo(mymap);

geo.bindPopup("<b>Hello,geo!<b>");

//轨迹回放
var playback = null;
window.onload = function(){
	 // Get start/end times
    var startTime = new Date(demoTracks[0].properties.time[0]);
    var endTime = new Date(demoTracks[0].properties.time[demoTracks[0].properties.time.length - 1]);
	var map = mymap;

    // Center map and default zoom level
    map.setView([44.5, -123.6], 10);
    // Playback options
    var playbackOptions = {
        playControl: true,
        dateControl: true,
        
        // layer and marker options
        layer : {
            pointToLayer : function(featureData, latlng) {
                var result = {};
                
                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }
                
                if (!result.radius){
                    result.radius = 5;
                }
                
                return new L.CircleMarker(latlng, result);
            }
        },
        
        marker: { 
            getPopup: function(featureData) {
                var result = '';
                
                if (featureData && featureData.properties && featureData.properties.title) {
                    result = featureData.properties.title;
                }
                
                return result;
            }
        }
        
    };
        
    // Initialize playback
    playback = new L.Playback(map, null, onPlaybackTimeChange, playbackOptions);
    
    playback.setData(demoTracks);    
    playback.addData(blueMountain);

    // A callback so timeline is set after changing playback time
    function onPlaybackTimeChange (ms) {
        
    };
          
}

