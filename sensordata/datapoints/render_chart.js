var chart = [];
var dataLength = 200;

// Initialize datapoints
var voltageDps = [];
var currentDps = [];
var powerDps = [];
var windSpeedDps = [];
var solarInsolationDps = [];
var prevDateTime = [];

// *** [START] HELPER FUNCTIONS ***
function hideNumericDisplay(sensorId, unit) {
    n = document.querySelector("#"+sensorId+" .numeric-"+unit);
    n.parentElement.style.display = 'none';
}

function showNumericDisplay(sensorId, unit) {
    n = document.querySelector("#"+sensorId+" .numeric-"+unit);
    n.parentElement.style.display = 'block';
}
// *** [END] HELPER FUNCTIONS ***


function renderChart(readingObj, chartType="area", opacity=1, intervalType="second", interval=60, xValueFormat="h:mm:ss TT") {
    voltageDps[readingObj.sensorId] = [];
    currentDps[readingObj.sensorId] = [];
    powerDps[readingObj.sensorId] = [];
    windSpeedDps[readingObj.sensorId] = [];
    solarInsolationDps[readingObj.sensorId] = [];
    
    // TODO: date = readingObj.date;

    chart[readingObj.sensorId] = new CanvasJS.Chart(readingObj.chartContainer, {
        zoomEnabled: true,
        fontColor: "#fff",
        // zoomType: "xy",
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
            // title: 'Time',
            gridThickness: 1,
            gridColor: "#424a44",
            interval: interval, 
            intervalType: intervalType,        
            valueFormatString: xValueFormat, 
            labelAngle: 0,
            labelFontSize: 12,
            labelFontColor: "#a5abb5",
            crosshair: {
                enabled: true,
                color: "#15a380",
                labelFontColor: "#F8F8F8",
                snapToDataPoint: false
            }
        },

        axisY:{
            // title: 'PIV',
            includeZero: false,
            gridThickness: 1,
            gridColor: "#424a44",
            labelFontColor: "#fff",
            crosshair: {
                enabled: true,
                color: "#15a380",
                labelFontColor: "#F8F8F8",
                snapToDataPoint: false
            },
            logarithmic:  true
        },

        data: [
            
            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType:  "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Power",
                fillOpacity: opacity, 
                color: "#05a4ee",
                lineColor: "#05a4ee",
                markerColor: "#05a4ee",
                markerSize: 0,
                dataPoints: powerDps[readingObj.sensorId]
            },

            
            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType:  "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Current",
                fillOpacity: opacity, 
                color: "#007c1f",
                lineColor: "#007c1f",
                markerColor: "#007c1f",
                markerSize: 0,
                dataPoints: currentDps[readingObj.sensorId]
            },


            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType:  "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Voltage",
                fillOpacity: opacity, 
                color: "#ec0b0b",
                lineColor: "#ec0b0b",
                markerColor: "#ec0b0b",
                markerSize: 0,
                dataPoints: voltageDps[readingObj.sensorId]
            },

            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType:  "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Wind Speed",
                fillOpacity: opacity, 
                color: "#a80cad",
                lineColor: "#a80cad",
                markerColor: "#a80cad",
                markerSize: 0,
                dataPoints: windSpeedDps[readingObj.sensorId]
            },

            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType:  "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Solar Insolation",
                fillOpacity: opacity, 
                color: "#c4a704",
                lineColor: "#c4a704",
                markerColor: "#c4a704",
                markerSize: 0,
                dataPoints: solarInsolationDps[readingObj.sensorId]
            }

        ]  
    });
    // Fill chart with data from the database
    updateChart(readingObj, dataLength);
}

var updateChart = function (readingObj, count=1) {    
    if(!prevDateTime[readingObj.sensorId])
        prevDateTime[readingObj.sensorId] = new Date( 2012, 0, 1, 0, 0 );
    
    // Perform AJAX request here. Get the xVal and the yVal values
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "getTrends.php?sensor_id=" + readingObj.sensorId 
        + "&data_length=" + count + "&unit=" + readingObj.unit + "&time_control=" 
        + readingObj.timeControl + "&date=" + readingObj.date, true);
    
    // console.log("getTrends.php?sensor_id=" + readingObj.sensorId 
    //     + "&data_length=" + count + "&unit=" + readingObj.unit + "&time_control=" 
    //     + readingObj.timeControl + "&date=" + readingObj.date);
    xhr.onload = function() {
        // Do not continue if there's no value returned
        if(!this.responseText)
            return;

            
        var response = JSON.parse(this.responseText);
        var sensorType = response.sensor_type;
        var sensorData = response.sensor_data;

        // console.log(sensorData);
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
                
                if(dateTime.getTime() !== prevDateTime[readingObj.sensorId].getTime()) {
                    // console.log(prevDateTime[readingObj.sensorId]);
                    dataBuffer = '';
                    if(item.readings.voltage) {
                        let unit = 'voltage';
                        let voltageValue = parseFloat(item.readings.voltage);
                        voltageDps[readingObj.sensorId].push({
                            x: dateTime,
                            y: voltageValue
                        });
                        showNumericDisplay(readingObj.sensorId, unit);
                        updateNumeric(readingObj.sensorId, unit, voltageValue);
                        dataBuffer = 'voltageDps';
                    } else {
                        // Hide numeric display for voltage
                        let unit = 'voltage';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }

                    
                    if(item.readings.current) {
                        let unit = 'current';
                        let currentValue = parseFloat(item.readings.current);
                        currentDps[readingObj.sensorId].push({
                            x: dateTime,
                            y: currentValue
                        });
                        showNumericDisplay(readingObj.sensorId, unit);
                        updateNumeric(readingObj.sensorId, unit, currentValue);
                        dataBuffer = 'currentDps';
                    } else {
                        // Hide numeric display for current
                        let unit = 'current';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }

                    if(item.readings.power) {
                        let unit = 'power';
                        let powerValue = parseFloat(item.readings.power);
                        powerDps[readingObj.sensorId].push({
                            x: dateTime,
                            y: powerValue
                        });
                        showNumericDisplay(readingObj.sensorId, unit);
                        updateNumeric(readingObj.sensorId, unit, powerValue);
                        dataBuffer = 'powerDps';
                    } else {
                        // Hide numeric display for power
                        let unit = 'power';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }


                    prevDateTime[readingObj.sensorId] = dateTime;

                    if (window[dataBuffer][readingObj.sensorId].length > dataLength) {
                        voltageDps[readingObj.sensorId].shift();
                        currentDps[readingObj.sensorId].shift();
                        powerDps[readingObj.sensorId].shift();
                    }
                }    
            });
        } else if (sensorType == 'environment') {
            
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

               
                if(dateTime.getTime() !== prevDateTime[readingObj.sensorId].getTime()) {
                    var dataBuffer = '';
                    if(item.readings.windSpeed) {
                        let unit = 'wind_speed';
                        let windSpeedValue = parseFloat(item.readings.windSpeed);
                        windSpeedDps[readingObj.sensorId].push({
                            x: dateTime,
                            y: windSpeedValue
                        });
                        showNumericDisplay(readingObj.sensorId, unit);
                        updateNumeric(readingObj.sensorId, unit, windSpeedValue);
                        dataBuffer = 'windSpeedDps';
                    } else {
                        // Hide numeric display for wind speed
                        let unit = 'wind_speed';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }

                    if(item.readings.solarInsolation) {
                        let unit = 'solar_insolation';
                        let solarInsolationValue = parseFloat(item.readings.solarInsolation);
                        solarInsolationDps[readingObj.sensorId].push({
                            x: dateTime,
                            y: solarInsolationValue
                        });
                        showNumericDisplay(readingObj.sensorId, unit)
                        updateNumeric(readingObj.sensorId, 'solar_insolation', solarInsolationValue);
                        dataBuffer = 'solarInsolationDps';
                    } else {
                        // Hide numeric display for solar insolation
                        let unit = 'solar_insolation';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }     

                    prevDateTime[readingObj.sensorId] = dateTime;

                    if (window[dataBuffer][readingObj.sensorId].length > dataLength) {
                        windSpeedDps[readingObj.sensorId].shift();
                        solarInsolationDps[readingObj.sensorId].shift();
                    }
                }
            });
        }
        if(sensorData.length >= 1 || readingObj.timeControl=='live') {
            chart[readingObj.sensorId].render();

            let chartContainer = document.getElementById(readingObj.chartContainer);
            let x = chartContainer.querySelector('.no-data');
            if(x) x.remove();
        } else {
            chartContainer = document.getElementById(readingObj.chartContainer);
            div = document.createElement('div');
            div.classList.add('no-data');
            icon = document.createElement('span');
            icon.classList.add('no-data-icon');
            icon.classList.add('flaticon-report');
            text = document.createElement('span')
            text.classList.add('no-data-text');
            text.innerText = 'No data found!'
            div.appendChild(icon)
            div.appendChild(text);
            chartContainer.appendChild(div);
        }
    }
    xhr.send();
};