// Global Variable
var mapbox_tileset_id = "mapbox://jamesrak.5j600nrm"
var mapbox_style_layer = "innovate_uk-2011"
var mapbox_style_layer_2 = "innovate_uk-2021"
var mapbox_style_url = "mapbox://styles/jamesrak/clhh2galk01c901pnbh97ezcr"
var mapbox_style_url_2 = "mapbox://styles/jamesrak/clhf0sz1z019j01p61gv844hf"
mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNyYWsiLCJhIjoiY2p6aHNsbGtkMHZ5czNlcGhmcWh6eTYxOSJ9.sfyNLBf4VsDjjClwB8H2MA';


const map = new mapboxgl.Map({
container: 'before',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: "mapbox://styles/jamesrak/clhh2galk01c901pnbh97ezcr", // Mapbox style URL
	center: [-1.755, 52.844], // Initial map center coordinates [longitude, latitude]
	zoom: 6, // Initial zoom level
	transition: {
		'duration': 1000,
		'delay': 0
	}
});
 
const map2 = new mapboxgl.Map({
container: 'after',
style: "mapbox://styles/jamesrak/clhf0sz1z019j01p61gv844hf", // Mapbox style URL
	center: [-1.755, 52.844], // Initial map center coordinates [longitude, latitude]
	zoom: 6, // Initial zoom level
	transition: {
		'duration': 1000,
		'delay': 0
	}
});
 
// A selector or reference to HTML element
const container = '#comparison-container';
 
const comparemap = new mapboxgl.Compare(map, map2, container, {
// Set this to enable comparing two maps by mouse movement:
// mousemove: true
});

  
  // Add navigation controls to the map
  map.addControl(new mapboxgl.NavigationControl());
  
  // Add a marker to the map
  new mapboxgl.Marker()
    .setLngLat([-122.4194, 37.7749])
    .addTo(map);


map.on('load', function(){
    // map.setLayoutProperty('innovate_uk-2021', 'visibility', 'visible');
    
    ///////////////////// POP-UP ///////////////////////////

    // Create a popup, but don't add it to the map yet.
	var popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false
	});
    
    // function to add comma as thousands separators
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

	// style and handle popup
	map.on('click', mapbox_style_layer, function(e) {
			// console.log("hello")
			// Change the cursor style as a UI indicator.
			map.getCanvas().style.cursor = 'pointer';
			var description = '<p class = "tooltip-header-2"> ' + e.features[0].properties['Project Title'] + " </p>\
            <p class = 'tooltip-2'>Sector: " + e.features[0].properties['Sector'] + "</p>\
            <p class = 'tooltip-2'>Address LEPs: " + e.features[0].properties['Address LEP'] + "</p>\
			<p class = 'tooltip-2'>Local Authority: " + e.features[0].properties['Address Local Authority'] + "</p>\
			<p class = 'tooltip-2'>Award Offered (£): " + numberWithCommas(e.features[0].properties['Award Offered (£)'])+"<\p>\
            <p class = 'tooltip-2'>Participant: " + e.features[0].properties['Participant Name'] + "</p>\
            <p class = 'tooltip-2'>Start Date: " + e.features[0].properties['Project Start Date'] + "</p>\
            <p class = 'tooltip-2'>End Dates: " + e.features[0].properties['Project End Date'] + "</p>"

			popup
				.setLngLat(e.lngLat)
				.setHTML(description)
				.addTo(map);

		});


	map.on('mouseleave', mapbox_style_layer, function() {
		// print("leave")
		map.getCanvas().style.cursor = '';
		popup.remove();
	}); 



    ///////////////////// LEGEND ////////////////////////////
    // Make Legend
	const layers = [
		'Manufacturing, Materials & Mobility',
		'Ageing Society, Health & Nutrition',
		'AI & Data Economy',
		'Clean Growth & Infrastructure',
		'Disruptive Technology',
        'Others'
	  ];
	  const colors = [
		'rgb(255, 20, 103)',
		'rgb(24, 204, 0)',
		'rgb(0, 132, 240)',
		'rgb(255, 98, 36)',
		'rgb(255, 255, 92)',
        'rgb(98, 40, 40)'
	  ];
	// create legend
	const legend = document.getElementById('legend');

	layers.forEach((layer, i) => {
	const color = colors[i];
	const item = document.createElement('div');
	const key = document.createElement('span');
	key.className = 'legend-key';
	key.style.backgroundColor = color;

	const value = document.createElement('span');
	value.innerHTML = `${layer}`;
	item.appendChild(key);
	item.appendChild(value);
	legend.appendChild(item);
	});

	// Create the bubble size legend
    var legendContainer = document.getElementById('bubble-legend');
    var legendItems = [
      { size: 1, label: '£ 1 K' },
	  { size: 10, label: '£ 5 M' },
	  { size: 20, label: '£ 50 M' },
      { size: 25, label: '£ 100 M' },
    ];

    legendItems.forEach(function(item) {
      var legendItem = document.createElement('div');
      legendItem.className = 'bubble-legend-item';

      var legendItemColor = document.createElement('div');
      legendItemColor.className = 'bubble-legend-item-color';
      legendItemColor.style.backgroundColor = 'rgb(255, 20, 103)';
	  legendItemColor.style.borderRadius = '50%';
      legendItemColor.style.width = item.size + 'px';
      legendItemColor.style.height = item.size + 'px';

      var legendItemLabel = document.createElement('div');
      legendItemLabel.textContent = item.label;

      legendItem.appendChild(legendItemColor);
      legendItem.appendChild(legendItemLabel);
      legendContainer.appendChild(legendItem);
    });

});


/////////////////// Map 2 ////////////////////////////////////////////////////
// Add navigation controls to the map2
map2.addControl(new mapboxgl.NavigationControl());
  
// Add a marker to the map2
new mapboxgl.Marker()
  .setLngLat([-122.4194, 37.7749])
  .addTo(map2);


map2.on('load', function(){
  // map2.setLayoutProperty('innovate_uk-2021', 'visibility', 'visible');
  
  ///////////////////// POP-UP ///////////////////////////

  // Create a popup, but don't add it to the map2 yet.
  var popup = new mapboxgl.Popup({
	  closeButton: false,
	  closeOnClick: false
  });
  
  // function to add comma as thousands separators
  function numberWithCommas(x) {
	  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // style and handle popup
  map2.on('click', mapbox_style_layer_2, function(e) {
		  // console.log("hello")
		  // Change the cursor style as a UI indicator.
		  map2.getCanvas().style.cursor = 'pointer';
		  var description = '<p class = "tooltip-header-2"> ' + e.features[0].properties['Project Title'] + " </p>\
		  <p class = 'tooltip-2'>Sector: " + e.features[0].properties['Sector'] + "</p>\
		  <p class = 'tooltip-2'>Address LEPs: " + e.features[0].properties['Address LEP'] + "</p>\
		  <p class = 'tooltip-2'>Local Authority: " + e.features[0].properties['Address Local Authority'] + "</p>\
		  <p class = 'tooltip-2'>Award Offered (£): " + numberWithCommas(e.features[0].properties['Award Offered (£)'])+"<\p>\
		  <p class = 'tooltip-2'>Participant: " + e.features[0].properties['Participant Name'] + "</p>\
		  <p class = 'tooltip-2'>Start Date: " + e.features[0].properties['Project Start Date'] + "</p>\
		  <p class = 'tooltip-2'>End Dates: " + e.features[0].properties['Project End Date'] + "</p>"

		  popup
			  .setLngLat(e.lngLat)
			  .setHTML(description)
			  .addTo(map2);

	  });


  map2.on('mouseleave', mapbox_style_layer_2, function() {
	  // print("leave")
	  map2.getCanvas().style.cursor = '';
	  popup.remove();
  }); 
});