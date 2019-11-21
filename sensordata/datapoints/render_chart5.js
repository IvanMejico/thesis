// var windSpeedNumeric = document.getElementById('wind-speed');

// CHART
var dps5 = [];
    
// CHART 1
var chart5 = new CanvasJS.Chart("chartContainer5", {
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
        color: "#8b34cf",
        fillOpacity: .5, 
        lineColor: "#8b34cf",
        markerColor: "#8b34cf",
        markerSize: 0,
        dataPoints: dps5
    }]
});


// CHARTS UPDATE
var xVal5;
var yVal5;
var dataLength = 1000;
var prevXval5 = new Date( 2012, 0, 1, 0, 0 );
var x = 0;

var updateChart5 = function (sensor_id, unit, count) {
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

            xVal5 = new Date(dateTimeParts[0], dateTimeParts[1], dateTimeParts[2],dateTimeParts[3],dateTimeParts[4], dateTimeParts[5])
            yVal5 = parseFloat(item.value);

            if(xVal5.getTime() !== prevXval5.getTime()) {
                dps5.push({
                    x: xVal5,
                    y: yVal5
                });

                prevXval5 = xVal5;
            }
            // windSpeedNumeric.innerText = item.value + "m/s"; // update numeric display
        });
        if (dps5.length > dataLength) {
            dps5.shift();
        }
        
        chart5.render();
    }
    xhr.send();


    
}; // END CHART