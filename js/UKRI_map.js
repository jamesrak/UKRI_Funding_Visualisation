// Global Variable
var mapbox_tileset_id = "mapbox://murat93.dmzrlfyv"
var mapbox_style_layer = "aggregated_data-a3yz0d"
var mapbox_style_url = "mapbox://styles/mapbox/dark-v11"
mapboxgl.accessToken = 'pk.eyJ1IjoibXVyYXQ5MyIsImEiOiJjbGNybzAyZTEwaG1rM3BwZHRwZ210NXNqIn0.DCt_EmK0IBm90J5-s_8Jtw';
google.charts.load('current', { packages: ['corechart', 'table'] });
var csvData;
d3.csv("./Data/ukri.csv").then(function(data) {
    csvData = data;
});
d3.csv("./Data/projects.csv").then(function(data) {
    csvData2 = data;
});



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

function parseCSVGroupedByCouncilYear(csvString) {
    var arrayData = $.csv.toArrays(csvString, { onParseValue: $.csv.hooks.castToScalar });
    var groupedData = {};

    // Skip the header row
    for (var i = 1; i < arrayData.length; i++) {
        var row = arrayData[i];
        var Councilname = row[1];
        var year = row[3];
        var amountAwarded = row[10];

        if (!groupedData[Councilname]) {
            groupedData[Councilname] = {};
        }

        if (!groupedData[Councilname][year]) {
            groupedData[Councilname][year] = 0;
        }

        groupedData[Councilname][year] += amountAwarded;
    }
    console.log(groupedData)

    return groupedData;
}

function drawTopProjectsTable(data, universityName) {
    // Filter data for the given university
    var universityData = data.filter(row => row["Organisation"] == universityName);

    // Sort by award value in descending order
    universityData.sort((a, b) => parseInt(b["Award Value (£k)"]) - parseInt(a["Award Value (£k)"]));

    // Create the data table.
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Project Title');
    dataTable.addColumn('number', 'Award Value (£k)');
    dataTable.addColumn('string', 'Year');
    dataTable.addColumn('string', 'UKRI Council');
    universityData.forEach(project => dataTable.addRow([project["Project Title"], parseInt(project["Award Value (£k)"]), project["FY Decision Date"].split('-')[0], project["UKRI Council"]]));

    // Define table options
    var options = {
        width: '100%',
        height: '100%',
        page: 'enable',
		pageSize: 10,
        alternatingRowStyle: false,
        showRowNumber: true,
        cssClassNames: {
            headerRow: 'tableHeaderRow',
            tableRow: 'tableRow',
        },
    }

    // Instantiate and draw the table.
    var table = new google.visualization.Table(document.getElementById('funded_table'));
    table.draw(dataTable, options);
};










function drawPieChart(selectedYear) {
    // grab the CSV
    $.get("./Data/ukri.csv", function (csvString) {
      // Parse CSV data and get the data grouped by CouncilName and Year
      var groupedData = parseCSVGroupedByCouncilYear(csvString);
  
      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn("string", "CouncilName");
      data.addColumn("number", "Amount");
 
      if (selectedYear === "All") {
        var totalData = {};
        for (var council in groupedData) {
          for (var year in groupedData[council]) {
            if (!totalData[council]) {
              totalData[council] = groupedData[council][year];
            } else {
              totalData[council] += groupedData[council][year];
            }
          }
        }
        for (var council in totalData) {
          data.addRow([council, totalData[council]]);
        }
      } else {
        for (var council in groupedData) {
          if (groupedData[council][selectedYear]) {
            data.addRow([council, groupedData[council][selectedYear]]);
          }
        }
      }
  
      // Set chart options
      var options = {
        title: "Funding Allocation by Council and Year",
        is3D: true,
        backgroundColor: 'transparent',
        chartArea: {
          backgroundColor: 'transparent'
        },
        titleTextStyle: { color: '#FFFFFF' }
      };
  
      // Instantiate and draw the chart, passing in the options.
      var chart = new google.visualization.PieChart(document.getElementById("piechart"));
      chart.draw(data, options);
    });
  }


  function drawFundingAcceptancePieChart(data, universityName) {
    // Filter data for the given university
    var universityData = data.filter(row => row["Organisation"] == universityName);

    var totalApplications = 0;
    var totalAccepted = 0;

    universityData.forEach(row => {
        totalApplications += parseInt(row["NumberofApplications"]);
        totalAccepted += parseInt(row["NumberofAwards"]);
    });

    var totalRejected = totalApplications - totalAccepted;

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Status");
    data.addColumn("number", "Count");
    data.addRow(["Accepted", totalAccepted]);
    data.addRow(["Rejected", totalRejected]);

    // Set chart options
    var options = {
        title: "Funding Acceptance Rate for " + universityName,
        is3D: true,
        backgroundColor: 'transparent',
        chartArea: {
          backgroundColor: 'transparent'
        },
        legend: { 
            position: 'bottom',
            textStyle: { color: 'white' } // Add this line
        },
        titleTextStyle: { color: '#FFFFFF' }
    };

    // Instantiate and draw the chart, passing in the options.
    var chart = new google.visualization.PieChart(document.getElementById("acceptance-piechart"));
    chart.draw(data, options);
}

function drawFundingLineChart(data, universityName) {
    // Filter data for the given university
    var universityData = data.filter(row => row["Organisation"] == universityName);

    // Create a map to hold the annual funding data
    var fundingData = {};

    universityData.forEach(row => {
        var year = row["Year"];
        var council = row["Councilname"];
        var amountAwarded = parseInt(row["AmountAwarded"]);

        // Initialize the year if it's not already in the map
        if (!(year in fundingData)) {
            fundingData[year] = {
                total: 0
            };
        }

        // Add the amount to the total
        fundingData[year].total += amountAwarded;

        // Add the amount to the council's total
        if (!(council in fundingData[year])) {
            fundingData[year][council] = 0;
        }
        fundingData[year][council] += amountAwarded;
    });

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Year");
    data.addColumn("number", "Total Funding");

    // Add a column for each council
    var councils = Array.from(new Set(universityData.map(row => row["Councilname"])));
    councils.forEach(council => data.addColumn("number", council + " Funding"));

    // Add the data rows
    for (var year in fundingData) {
        var row = [year, fundingData[year].total];
        councils.forEach(council => {
            row.push(fundingData[year][council] || 0);
        });
        data.addRow(row);
    }

    // Set chart options
    var options = {
        title: "Funding Acceptance Rate for " + universityName,
        is3D: true,
        backgroundColor: 'transparent',
        chartArea: {
          backgroundColor: 'transparent'
        },
        legend: { 
            position: 'right',
            textStyle: { color: 'white' } // Add this line
        },
        titleTextStyle: { color: '#FFFFFF' }
    };



// Instantiate and draw the chart, passing in the options.
var chart = new google.visualization.LineChart(document.getElementById("funding-linechart"));
chart.draw(data, options);









    // Instantiate and draw the chart, passing in the options.
    var chart = new google.visualization.LineChart(document.getElementById("funding-linechart"));
    chart.draw(data, options);
};


  

map.on('load', function () {
    // Add a new layer for your data points
    map.addLayer({
        id: 'your-data-points-layer',
        type: 'circle',
        source: {
            type: 'vector',
            url: 'mapbox://murat93.dmzrlfyv' // Corrected source URL
        },
        'source-layer': 'aggregated_data-a3yz0d', // Replace with your layer name in the tileset
        paint: {
            // Customize the appearance of your data points
            'circle-color': '#f08',
            'circle-radius': 6,
        },
    });

    $("#draw-chart").click(function () {
        var selectedCouncil = $("#Councilname").val();
        var selectedYear = $("#year").val();

        drawPieChart(selectedCouncil, selectedYear);
    });


    $(document).ready(function(){
        // draw initial pie chart and table on page load
        drawPieChart("All");
      
        $("#overview").click(function(){
          // draw the pie chart and table again when the "overview" button is clicked
          drawPieChart("All");

           // Show the pie chart, year choice and draw chart button
            $("#piechart").show();
            $("#year").show();
            $("#draw-chart").show();
    
    // You might also want to redraw the pie chart here
    drawPieChart(selectedCouncil, selectedYear);
        });
      });
      

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

   

    map.on('mouseleave', 'your-data-points-layer', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });


    // Create a popup for hover, but don't add it to the map yet.
    var hoverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'your-data-points-layer', function (e) {
        map.getCanvas().style.cursor = 'pointer';

        // Get the organization name from the feature properties.
        var organizationName = e.features[0].properties['Organisation'];

        hoverPopup
            .setLngLat(e.lngLat)
            .setHTML(organizationName)
            .addTo(map);
    });

    map.on('mouseleave', 'your-data-points-layer', function () {
        map.getCanvas().style.cursor = '';
        hoverPopup.remove();
    });

    map.on('click', 'your-data-points-layer', function (e) {
        var organisationName = e.features[0].properties.Organisation;
        drawFundingAcceptancePieChart(csvData, organisationName);
        drawFundingLineChart(csvData, organisationName);
        drawTopProjectsTable(csvData2, organisationName);


        $("#piechart").hide();
        $("#year").hide();
        $("#draw-chart").hide();
        });

    

    ///////////////////// LEGEND ////////////////////////////
    // Make Legend

});
