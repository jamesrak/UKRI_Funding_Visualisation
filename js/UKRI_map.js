// Global Variable
var mapbox_tileset_id = "mapbox://murat93.dmzrlfyv"
var mapbox_style_layer = "aggregated_data-a3yz0d"
var mapbox_style_url = "mapbox://styles/mapbox/dark-v11"
mapboxgl.accessToken = 'pk.eyJ1IjoibXVyYXQ5MyIsImEiOiJjbGNybzAyZTEwaG1rM3BwZHRwZ210NXNqIn0.DCt_EmK0IBm90J5-s_8Jtw';
google.charts.load('current', { packages: ['corechart', 'table'] });
var csvData;
d3.csv("./data/ukri.csv").then(function(data) {
    csvData = data;
});
d3.csv("./data/projects.csv").then(function(data) {
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

    var options = {
        width: '100%',
        height: '100%',
        page: 'enable',
        pageSize: 20,
        alternatingRowStyle: false,
        showRowNumber: true,
        cssClassNames: {
            headerRow: 'tableHeaderRow',
            tableRow: 'tableRow',
            headerCell: 'blackHeader'
        },
    }

    // Instantiate and draw the table.
    var table = new google.visualization.Table(document.getElementById('funded_table'));
    table.draw(dataTable, options);
};


function drawTopProjectsAcrossAll(data) {
    // Sort by award value in descending order
    var sortedData = [...data];
    sortedData.sort((a, b) => parseInt(b["Award Value (£k)"]) - parseInt(a["Award Value (£k)"]));

    // Get top 10 projects
    var topProjects = sortedData.slice(0, 20);

    // Create the data table.
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Project Title');
    dataTable.addColumn('number', 'Award Value (£k)');
    dataTable.addColumn('string', 'Year');
    dataTable.addColumn('string', 'UKRI Council');
    dataTable.addColumn('string', 'Organisation');
    topProjects.forEach(project => dataTable.addRow([project["Project Title"], parseInt(project["Award Value (£k)"]), project["FY Decision Date"].split('-')[0], project["UKRI Council"], project["Organisation"]]));

    // Define table options
    var options = {
        width: '100%',
        height: '100%',
        page: 'enable',
        pageSize: 20,
        alternatingRowStyle: false,
        showRowNumber: true,
        cssClassNames: {
            headerRow: 'tableHeaderRow',
            tableRow: 'tableRow',
            headerCell: 'blackHeader'
        },
    }

    // Instantiate and draw the table.
    var table = new google.visualization.Table(document.getElementById('funded_table'));
    table.draw(dataTable, options);
}









function drawPieChart(selectedYear) {
    // grab the CSV
    $.get("./data/ukri.csv", function (csvString) {
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
        is3D: false,
        backgroundColor: 'transparent',
        chartArea: {
          backgroundColor: 'transparent',
        },
        titleTextStyle: { color: '#FFFFFF' },
        width: 400,  // Modify this as per requirement
        height: 400,  // Modify this as per requirement
        legend: { textStyle: { color: '#FFFFFF' } } 
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
        is3D: false,
        backgroundColor: 'transparent',
        chartArea: {
            backgroundColor: 'transparent',
            width: '70%', // control the width of the chart area
            height: '70%' // control the height of the chart area
        },
        legend: { 
            position: 'bottom',
            textStyle: { color: 'white' }
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

    // Define the order of years
var orderedYears = ["2015-16", "2016-17", "2017-18", "2018-19", "2019-20"];

// Add the data rows
for (var i = 0; i < orderedYears.length; i++) {
    var year = orderedYears[i];
    if(year in fundingData) {
        var row = [year, fundingData[year].total];
        councils.forEach(council => {
            row.push(fundingData[year][council] || 0);
        });
        data.addRow(row);
    }
}

    // Set chart options
    var options = {
        title: "Funding Recieved " + universityName,
        is3D: false,
        backgroundColor: 'transparent',
        chartArea: {
            left: '10%', // adjust as needed
            top: '10%', // adjust as needed
            width: '50%', // adjust as needed
            height: '50%', // adjust as needed
            backgroundColor: 'transparent'
        },
        legend: { 
            position: 'right',
            alignment: 'start',
            textStyle: { 
                color: 'white', 
                fontSize: 12
            } 
        },
        titleTextStyle: { color: '#FFFFFF' },
        
        vAxis: {
            textStyle: {
                color: '#FFFFFF'
            }
        },

        hAxis: {
            textStyle: {
                color: '#FFFFFF'
            }
        }
    };
    


// Instantiate and draw the chart, passing in the options.
var chart = new google.visualization.LineChart(document.getElementById("funding-linechart"));
chart.draw(data, options);









    // Instantiate and draw the chart, passing in the options.
    var chart = new google.visualization.LineChart(document.getElementById("funding-linechart"));
    chart.draw(data, options);
};

$.get("./data/ukri.csv", function (csvString) {
    var arrayData = $.csv.toArrays(csvString, { onParseValue: $.csv.hooks.castToScalar });
    var universityLocation = {};
    var universityList = $("#university-list");  // Grab reference to the datalist element

    // A JavaScript Set only stores unique values
    var uniqueUniversities = new Set();

    // Skip the header row
    for (var i = 1; i < arrayData.length; i++) {
        var row = arrayData[i];
        var university = row[2]; //assuming 3rd column is University
        var latitude = row[11]; //assuming 12th column is Latitude
        var longitude = row[12]; //assuming 13th column is Longitude

        universityLocation[university] = [latitude, longitude];

        // Only add the university to the Set if it's not already present
        if (!uniqueUniversities.has(university)) {
            uniqueUniversities.add(university);

            // Add the university as an option to the datalist
            var option = document.createElement('option');
            option.value = university;
            universityList.append(option);
        }
    }

    // Store the map for future reference
    universityLocations = universityLocation;
});


var universityLocations = {};
$.get("./data/ukri.csv", function (csvString) {
    universityLocations = parseCSVToMapUniversityLocation(csvString);
});

function parseCSVToMapUniversityLocation(csvString) {
    var arrayData = $.csv.toArrays(csvString, { onParseValue: $.csv.hooks.castToScalar });
    var universityLocation = {};

    // Skip the header row
    for (var i = 1; i < arrayData.length; i++) {
        var row = arrayData[i];
        var university = row[2]; //assuming 3rd column is University
        var longitude = row[11]; //assuming 12th column is Latitude
        var latitude  = row[12]; //assuming 13th column is Longitude

        universityLocation[university] = [latitude, longitude];
    }

    return universityLocation;
}


$("#search-btn").click(function() {
    var universityName = $("#university-search").val();
    var latLng = universityLocations[universityName];

    if (latLng) {
        // Set new center to the map
        map.flyTo({ 
            center: latLng,
            zoom: 12  // specify the desired zoom level here
        });
        
    } else {
        alert("University not found");
    }
});


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

        drawPieChart(selectedYear);
    });


    $(document).ready(function(){
        // draw initial pie chart and table on page load
        drawPieChart("All");
        drawTopProjectsAcrossAll(csvData2);
    
        $("#overview").click(function(){
          // draw the pie chart and table again when the "overview" button is clicked
          drawPieChart("All");
          drawTopProjectsAcrossAll(csvData2);
          // Show the pie chart and the year dropdown and draw button
            $("#piechart").show();
            $("#year").show();
            $("#draw-chart").show();

          $("#acceptance-piechart").hide();
          $("#funding-linechart").hide();
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
    

        // Show the university specific charts
        $("#acceptance-piechart").show();
        $("#funding-linechart").show();


        $("#piechart").hide();
        $("#year").hide();
        $("#draw-chart").hide();
        });

    

    ///////////////////// LEGEND ////////////////////////////
    // Make Legend

});
