// Global Variable
var mapbox_tileset_id = "mapbox://jamesrak.5j600nrm"
var mapbox_style_layer = "innovate_uk-2010-2022"
var mapbox_style_url = "mapbox://styles/jamesrak/clhpimhpp01ul01pg814wg9vp"
mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNyYWsiLCJhIjoiY2p6aHNsbGtkMHZ5czNlcGhmcWh6eTYxOSJ9.sfyNLBf4VsDjjClwB8H2MA';

// Mapbox Initialisation
var map = new mapboxgl.Map({
	container: 'map', // HTML container ID where the map will be rendered
	style: mapbox_style_url, // Mapbox style URL
	center: [-1.755, 52.544], // Initial map center coordinates [longitude, latitude]
	zoom: 6, // Initial zoom level
	transition: {
		'duration': 1000,
		'delay': 0
	}
});
  
  // Add navigation controls to the map
  map.addControl(new mapboxgl.NavigationControl());
  
  // Add a marker to the map
  new mapboxgl.Marker()
    .setLngLat([-122.4194, 37.7749])
    .addTo(map);


///////////////////// SIDEBAR ///////////////////////////

/////// Line Chart

// Google Chart Initialisation
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart','table']});
      google.charts.setOnLoadCallback(drawLineChart);
	  google.charts.setOnLoadCallback(drawTable);

      function drawLineChart() {

		// grab the CSV
		$.get("data/IUK-FundedProjects-Funding_by_Sector_pivot.csv", function(csvString) {
		// transform the CSV string into a 2-dimensional array
		var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
		// this new DataTable object holds all the data
		 // Use object notation to explicitly specify the data type.
		arrayData[0] = [{type:'string', label:'Year'},
		{type:'number', label:'AI & Data Economy'},
		{type:'number', label:'Ageing Society, Health & Nutrition'},
		{type:'number', label:'Clean Growth & Infrastructure'},
		{type:'number', label:'Disruptive Technology'},
		{type:'number', label:'Manufacturing, Materials & Mobility'}]
		var data = new google.visualization.arrayToDataTable(arrayData);
		// var data = new google.visualization.DataTable();
		// data.addColumn('string', 'Year');
		// data.addColumn('number', 'AI & Data Economy');
		// data.addColumn('number', 'Ageing Society, Health & Nutrition');
		// data.addColumn('number', 'Clean Growth & Infrastructure');
		// data.addColumn('number', 'Disruptive Technology');
		// data.addColumn('number', 'Manufacturing, Materials & Mobility');
		// data = new google.visualization.arrayToDataTable(arrayData);
		// this view can select a subset of the data at a time
		var view = new google.visualization.DataView(data);

		function formatNumber(num) {
			if (Math.abs(num) >= 1000000000) {
			  return (Math.abs(num) / 1000000000).toFixed(1) + 'B';
			} else if (Math.abs(num) >= 1000000) {
			  return (Math.abs(num) / 1000000).toFixed(1) + 'M';
			} else if (Math.abs(num) >= 1000) {
			  return (Math.abs(num) / 1000).toFixed(1) + 'K';
			}
			return num.toString();
		  }

		for (let i = 1; i <= 5; i++) {
			var formatter = new google.visualization.NumberFormat({
				prefix: '£',
				fractionDigits:0,
				// suffix:formatNumber(data.getValue(0,i))
			});
			formatter.format(data, i);  
		}

        var options = {
          title: 'Projects Funded Over Time',
		  titleTextStyle: {
			color: '#FFF'
		},
		colors: ['rgb(0, 132, 240)', 'rgb(24, 204, 0)', 'rgb(255, 98, 36)','rgb(255, 255, 92)', 'rgb(255, 20, 103)'],
		//   'width':500,
		//   'height':300,
		  chartArea: {width: '65%'},
          legend: {textStyle: {color: 'white', fontSize: 11}, position: 'top' ,maxLines:3},
		  'backgroundColor': '#262626',
		  hAxis: {
			textStyle:{color: '#FFF'},
			format: ''
		},
		vAxis: {
			textStyle:{color: '#FFF'},
			format: 'short'
		},
		tooltip: {
			textStyle:{color: '#000'},
			format: 'short'
		},
		chartArea: {
            left: 60,
            right: 70
          },
		  focusTarget: 'category'
        };  

        var chart = new google.visualization.LineChart(document.getElementById('funded_by_year_chart'));

        chart.draw(view, options);
		});
      }

	  function drawTable() {
		// grab the CSV
		$.get("data/IUK-FundedProjects-2004-2022-Dataset.csv", function(csvString) {
			// transform the CSV string into a 2-dimensional array
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var data = new google.visualization.arrayToDataTable(arrayData);
			var numberFormatter = new google.visualization.NumberFormat({
				prefix: '£',
				pattern: 'short'
			  });

			numberFormatter.format(data, 7); // Apply formatting to the 'Amount' column

			var colorFormatter = new google.visualization.ColorFormat();
			colorFormatter.addRange('Manufacturing, Materials & Mobility', 'Manufacturing, Materials & Mobility', 'rgb(255, 20, 103)', '#FFFFFF'); //#1a1a1a
			colorFormatter.addRange('Ageing Society, Health & Nutrition', 'Ageing Society, Health & Nutrition', 'red', 'white'); //#1a1a1a
			colorFormatter.addRange('2018/19','2018/19', 'red', 'white'); //#1a1a1a
	  
			colorFormatter.format(data, 1); // Apply formatting to the 'sector' column


			var view = new google.visualization.DataView(data);
			view.setColumns([3,2,4,1,7,12,11]);
			// Sort the DataView by 'amount' column in descending order
			view.setRows(data.getSortedRows({
				column: 7,  // Sort by the 'amount' column (index 1)
				desc: true  // Sort in descending order
			  }));

			// Apply conditional formatting on the 'sector' column
			// view.setRows(data.getFilteredRows([{column: 1, value: 'Manufacturing, Materials & Mobility'}]));

			var table = new google.visualization.Table(document.getElementById('funded_table'));

			options = {
				page: 'enable',
				pageSize: 4,
				showRowNumber: true,
				allowHtml: true,
				cssClassNames: {
					headerRow: 'header-row',
					tableRow: 'table-row',
					oddTableRow: 'odd-table-row',
					selectedTableRow: 'selected-table-row',
					hoverTableRow: 'hover-table-row',
					headerCell: 'header-cell',
					tableCell: 'table-cell',
					rowNumberCell: 'row-number-cell'
					},
			};

			table.draw(view, options);
		});
	  }



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