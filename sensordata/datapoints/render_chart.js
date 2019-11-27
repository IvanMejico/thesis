// var windSpeedNumeric = document.getElementById('wind-speed');
var chart = [];
var dataLength = 1000;
var x = 0;

// Initialyze datapoints
var voltageDps = [];
var currentDps = [];
var powerDps = [];
var windSpeedDps = [];
var prevDateTime = [];

// var windData = {};

function renderChart(container,sensorId, count) {
    if(!voltageDps[sensorId])
        voltageDps[sensorId] = [];

    if(!currentDps[sensorId])
        currentDps[sensorId] = [];

    if(!powerDps[sensorId])
        powerDps[sensorId] = [];
        
    if(!windSpeedDps[sensorId])
        windSpeedDps[sensorId] = [];
        
    // prevDateTime[sensorId];


    chart[sensorId] = new CanvasJS.Chart(container, {
        zoomEnabled: true,
        fontColor: "#fff",
        zoomType: "xy",
        backgroundColor: "#1f1e1b",
        animationEnabled: true,
        theme: "light2",

        legend: {
            fontColor: "#fff",
        },

        toolTip: {
            shared: true
        },

        axisX:{
            // title: "time",
            gridThickness: 0,
            // interval:24, 
            // intervalType: "hour",        
            valueFormatString: "h:mm TT", 
            labelAngle: 0,
            labelFontSize: 13,
            labelFontColor: "#a5abb5"
        },

        axisY:{
            includeZero: false,
            labelFontColor: "#fff"
        },

        data: [
            
            {        
                type: "splineArea",
                showInLegend: true,
                name: "Power",
                fillOpacity: .2, 
                color: "#05a4ee",
                lineColor: "#05a4ee",
                markerColor: "#05a4ee",
                markerSize: 0,
                dataPoints: powerDps[sensorId]
            },

            
            {        
                type: "splineArea",
                showInLegend: true,
                name: "Current",
                fillOpacity: .4, 
                color: "#007c1f",
                lineColor: "#007c1f",
                markerColor: "#007c1f",
                markerSize: 0,
                dataPoints: currentDps[sensorId]
            },


            {        
                type: "splineArea",
                showInLegend: true,
                name: "Voltage",
                fillOpacity: .2, 
                color: "#ec0b0b",
                lineColor: "#ec0b0b",
                markerColor: "#ec0b0b",
                markerSize: 0,
                dataPoints: voltageDps[sensorId]
            },

            windData = {        
                type: "splineArea",
                showInLegend: true,
                name: "Wind Speed",
                fillOpacity: .2, 
                color: "#c4a704",
                lineColor: "#c4a704",
                markerColor: "#c4a704",
                markerSize: 0,
                dataPoints: windSpeedDps[sensorId]
            }

        ]  
    });



    updateChart(sensorId, count);
}

var updateChart = function (sensorId, count) {
    console.log('executed');
    count = count || 1; // If count is not passed, default the value to 1

    if(!prevDateTime[sensorId]) {
        prevDateTime[sensorId] = new Date( 2012, 0, 1, 0, 0 );
    }
    
    // Perform AJAX request here. Get the xVal and the yVal values
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "getTrends.php?sensor_id=" + sensorId + "&datalength=" + count, true);  

    xhr.onload = function() {
        var response = JSON.parse(this.responseText);
        var sensorType = response.sensor_type;
        var sensorData = response.sensor_data;    

        
        if(sensorType == 'electrical') {
            sensorData.forEach(function(item) {
                let timeStamp = item.timestamp;
                let dateTimeParts = timeStamp.split(/[- :]/);
                dateTimeParts[1]--;

                let dateTime = new Date(
                    dateTimeParts[0],
                    dateTimeParts[1],
                    dateTimeParts[2],
                    dateTimeParts[3],
                    dateTimeParts[4],
                    dateTimeParts[5]
                );

                let voltage = parseFloat(item.voltage);
                let current = parseFloat(item.current);
                let power = current * voltage;
                
                if(dateTime.getTime() !== prevDateTime[sensorId].getTime()) {
                    // console.log(prevDateTime[sensorId]);
                    voltageDps[sensorId].push({
                        x: dateTime,
                        y: voltage
                    });

                    currentDps[sensorId].push({
                        x: dateTime,
                        y: current
                    });

                    powerDps[sensorId].push({
                        x: dateTime,
                        y: power
                    });

                    prevDateTime[sensorId] = dateTime;

                    if (voltageDps.length > dataLength) {
                        voltageDps.shift();
                        currentDps.shift();
                        powerDps.shift();
                    }
                }    
            });
        } else if (sensorType == 'wind') {
            
            sensorData.forEach(function(item) {
                let timeStamp = item.timestamp;
                let dateTimeParts = timeStamp.split(/[- :]/);
                dateTimeParts[1]--;

                let dateTime = new Date(
                    dateTimeParts[0],
                    dateTimeParts[1],
                    dateTimeParts[2],
                    dateTimeParts[3],
                    dateTimeParts[4],
                    dateTimeParts[5]
                );

                let windSpeed = parseFloat(item.value);                
               
                if(dateTime.getTime() !== prevDateTime[sensorId].getTime()) {
                    
                    windSpeedDps[sensorId].push({
                        x: dateTime,
                        y: windSpeed
                    });

                    prevDateTime[sensorId] = dateTime;

                    if (windSpeedDps.length > dataLength) {
                        windSpeedDps.shift();
                    }

                }    

            });
        }
        chart[sensorId].render();
    }
    xhr.send();
};