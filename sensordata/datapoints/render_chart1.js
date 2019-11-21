var windSpeedNumeric = document.getElementById('wind-speed');

// CHART
var dps1 = [];
    
// CHART 1
var chart1 = new CanvasJS.Chart("chartContainer1", {
    zoomEnabled: true,
    zoomType: "xy",
    backgroundColor: "#1f1e1b",
    // width: 320,
    animationEnabled: true,
    theme: "light2",
    axisX:{
        title: "time",
        gridThickness: 0,
        // interval:5, 
        // intervalType: "minute",        
        valueFormatString: "h:mm TT", 
        labelAngle: 0
    },
    axisY:{
        includeZero: false
    },
    data: [{        
        type: "splineArea",
        color: "#c4a704",
        fillOpacity: .5, 
        lineColor: "#c4a704",
        markerColor: "#c4a704",
        markerSize: 0,
        dataPoints: dps1
    }]
});


// CHARTS UPDATE
var xVal1;
var yVal1;
var dataLength = 1000;
var prevXval1 = new Date( 2012, 0, 1, 0, 0 );
var x = 0;

var updateChart1 = function (sensor_id, unit, count) {
    var response;
    
    count = count || 1;

    // Perform AJAX request here. Get the xVal and the yVal values
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "getTrends.php?sensor_id=" + sensor_id + "&unit="+ unit + "&datalength=" + count, true);
    xhr.onload = function() {
        response = JSON.parse(this.responseText);   // console.log(response[0].timestamp);

        // foreach element in the response array, push it to the dataPoints;
        response.forEach(function(item, index){
            // while there's element left, push data to dataPoints
            
            let dateTime = item.timestamp;
            let dateTimeParts = dateTime.split(/[- :]/);
            dateTimeParts[1]--;

            xVal1 = new Date(dateTimeParts[0], dateTimeParts[1], dateTimeParts[2],dateTimeParts[3],dateTimeParts[4], dateTimeParts[5])
            yVal1 = parseFloat(item.value);

            if(xVal1.getTime() !== prevXval1.getTime()) {
                dps1.push({
                    x: xVal1,
                    y: yVal1
                });

                prevXval1 = xVal1;
            }
            windSpeedNumeric.innerText = item.value + "m/s"; // update numeric display
        });
        
        if (dps1.length > dataLength) {
            dps1.shift();
        }
        
        chart1.render();
    }
    xhr.send();


    
}; // END CHART