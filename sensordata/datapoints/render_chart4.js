var windSpeedNumeric = document.getElementById('wind-speed');

// CHART
var dps4 = [];
    
// CHART 1
var chart4 = new CanvasJS.Chart("chartContainer4", {
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
        color: "#05a4ee",
        fillOpacity: .5, 
        lineColor: "#05a4ee",
        markerColor: "#05a4ee",
        markerSize: 0,
        dataPoints: dps4
    }]
});


// CHARTS UPDATE
var xVal4;
var yVal4;
var dataLength = 1000;
var prevXval4 = new Date( 2012, 0, 1, 0, 0 );
var x = 0;

var updateChart4 = function (sensor_id, unit, count) {
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

            xVal4 = new Date(dateTimeParts[0], dateTimeParts[1], dateTimeParts[2],dateTimeParts[3],dateTimeParts[4], dateTimeParts[5])
            yVal4 = parseFloat(item.value);

            if(xVal4.getTime() !== prevXval4.getTime()) {
                dps4.push({
                    x: xVal4,
                    y: yVal4
                });

                prevXval4 = xVal4;
            }
            // windSpeedNumeric.innerText = item.value + "m/s"; // update numeric display
        });
        if (dps4.length > dataLength) {
            dps4.shift();
        }
        
        chart4.render();
    }
    xhr.send();


    
}; // END CHART