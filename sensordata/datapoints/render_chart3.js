// CHART
var dps3 = [];
    
// CHART 1
var chart3 = new CanvasJS.Chart("chartContainer3", {
    zoomEnabled: true,
    zoomType: "xy",
    backgroundColor: "#1f1e1b",
    // width: 320,
    animationEnabled: true,
    theme: "light2",
    axisX:{
        title: "time",
        gridThickness: 0,
        // interval:5, "PSN001"
        // intervalType: "minute",        
        valueFormatString: "h:mm TT", 
        labelAngle: 0
    },
    axisY:{
        includeZero: false
    },
    data: [{        
        type: "splineArea",
        color: "#007c1f",
        fillOpacity: .5, 
        lineColor: "#007c1f",
        markerColor: "#007c1f",
        markerSize: 0,
        dataPoints: dps3
    }]
});


// CHARTS UPDATE
var xVal3;
var yVal3;
var dataLength = 1000;
var prevXval3 = new Date( 2012, 0, 1, 0, 0 );
var x = 0;

var updateChart3 = function (sensor_id, unit, count) {
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

            xVal3 = new Date(dateTimeParts[0], dateTimeParts[1], dateTimeParts[2],dateTimeParts[3],dateTimeParts[4], dateTimeParts[5])
            yVal3 = parseFloat(item.value);

            if(xVal3.getTime() !== prevXval3.getTime()) {
                dps3.push({
                    x: xVal3,
                    y: yVal3
                });

                prevXval3 = xVal3;
            }
            // windSpeedNumeric.innerText = item.value + "m/s"; // update numeric display
        });
        if (dps3.length > dataLength) {
            dps3.shift();
        }
        chart3.render();
    }
    xhr.send();


    
}; // END CHART