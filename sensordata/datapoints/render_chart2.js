// CHART
var dps2 = [];
    
// CHART 1
var chart2 = new CanvasJS.Chart("chartContainer2", {
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
        color: "#ec0b0b",
        fillOpacity: .5, 
        lineColor: "#ec0b0b",
        markerColor: "#ec0b0b",
        markerSize: 0,
        dataPoints: dps2
    }]
});


// CHARTS UPDATE
var xVal2;
var yVal2;
var dataLength = 1000;
var prevXval2 = new Date( 2012, 0, 1, 0, 0 );
var x = 0;

var updateChart2 = function (sensor_id, unit, count) {
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

            xVal2 = new Date(dateTimeParts[0], dateTimeParts[1], dateTimeParts[2],dateTimeParts[3],dateTimeParts[4], dateTimeParts[5])
            yVal2 = parseFloat(item.value);

            if(xVal2.getTime() !== prevXval2.getTime()) {
                dps2.push({
                    x: xVal2,
                    y: yVal2
                });

                prevXval2 = xVal2;
            }
            // windSpeedNumeric.innerText = item.value + "m/s"; // update numeric display
        });
        if (dps2.length > dataLength) {
            dps2.shift();
        }
        // console.log(dps2);
        chart2.render();
    }
    xhr.send();


    
}; // END CHART