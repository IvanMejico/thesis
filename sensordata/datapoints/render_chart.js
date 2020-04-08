var chart = [];
var dataLength = 200;

// Initialize datapoints
var prevDateTime = [];

var voltageDps = [];
var currentDps = [];
var powerDps = [];
var windSpeedDps = [];
var solarInsolationDps = [];



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


/**
 * TRENDS CHART
 */

function renderChart(readingObj, chartType="area", opacity=1, intervalType="second", interval=60, xValueFormat="h:mm:ss TT") {
    voltageDps[readingObj.sensorId] = [];
    currentDps[readingObj.sensorId] = [];
    powerDps[readingObj.sensorId] = [];
    windSpeedDps[readingObj.sensorId] = [];
    solarInsolationDps[readingObj.sensorId] = [];
    
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
            // POWER
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

            // CURRENT
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

            // VOLTAGE
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

            // WIND SPEED
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

            // SOLAR INSOLATION
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

var updateChart = function(readingObj, count=1) {
    if(!prevDateTime[readingObj.sensorId])
        prevDateTime[readingObj.sensorId] = new Date( 2012, 0, 1, 0, 0 );
    
    // Setup AJAX Request
    var qString = "getTrends.php?sensor_id=" + readingObj.sensorId 
        + "&data_length=" + count + "&unit=" + readingObj.unit + "&time_control=" 
        + readingObj.timeControl + "&date=" + readingObj.date;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', qString, true);
    

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
                    dataBuffer = '';

                    // voltage readings
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
                        let unit = 'voltage';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }


                    // current readings
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
                        let unit = 'current';
                        hideNumericDisplay(readingObj.sensorId, unit);
                    }

                    // power readings
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




/**
 * OVERVIEW CHART
 */

var loadPowerDps = [];
var windPowerDps = [];
var solarPowerDps = [];

function renderOverview(chartType="area", opacity=1, intervalType="second", interval=60, xValueFormat="hh:mm:ss TT") {

    // Re-initialize datapoints (This code produces invalid datetime error. I'm not sure why. Deleting it seems to be okay though. I'll probably get back to this later.)
    // var loadPowerDps = [];
    // var windPowerDps = [];
    // var solarPowerDps = [];

    chart['overview'] = new CanvasJS.Chart('chartContainer-overview', {
        zoomEnabled: true,
        fontColor: "#fff",
        backgroundColor: "#1f1e1b",
        animationEnabled: true,
        theme: "dark",

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
            // SOLAR GENERATION (POWER)
            {
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType: "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Solar Generation",
                fillOpacity: opacity, 
                color: "#38ff00",
                lineColor: "#38ff00",
                markerColor: "#38ff00",
                markerSize: 0,
                dataPoints: solarPowerDps
            },

            // WIND GENERATION (POWER)
            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType: "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Wind Generation",
                fillOpacity: opacity, 
                color: "#e8073c",
                lineColor: "#e8073c",
                markerColor: "#e8073c",
                markerSize: 0,
                dataPoints: windPowerDps
            },

            // POWER CONSUMPTION
            {        
                type: chartType,
                lineThickness: 1,
                nullDataLineDashType: "dot",
                xValueType: "dateTime",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Overall Load Consumption",
                fillOpacity: opacity, 
                color: "#0004ff",
                lineColor: "#0004ff",
                markerColor: "#0004ff",
                markerSize: 0,
                dataPoints: loadPowerDps
            }

        ]  
    });
    // Fill chart with data from the database
    updateOverview('live', dataLength);
}

var updateOverview = function(timeControl='live', count=1) {
    let arrIndex = 'overview';

    if(!prevDateTime[arrIndex])
        prevDateTime[arrIndex] = new Date( 2012, 0, 1, 0, 0 );
    
    // Setup AJAX Request
    var qString = "getOverview.php?timecontrol="+timeControl+"&data_length="+count;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', qString, true);
    xhr.onload = function() {
        // Do not continue if there's no value returned
        if(!this.responseText)
            return;

        var powerReadings = JSON.parse(this.responseText);
        powerReadings.forEach(function(item) {
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


            if(dateTime.getTime() !== prevDateTime[arrIndex].getTime()) {
                // Load power
                let loadPower = parseFloat(item.load);
                loadPowerDps.push({
                    x: dateTime,
                    y: loadPower
                });
                let n = document.querySelector(".numeric-consumption");
                n.innerText = loadPower.toFixed(2)+"W";

                // Wind power
                let windPower = parseFloat(item.turbine);
                windPowerDps.push({
                    x: dateTime,
                    y: windPower
                });
                n = document.querySelector(".numeric-windgeneration");
                n.innerText = windPower.toFixed(2)+"W";

                // Solar power
                let solarPower = parseFloat(item.panel);
                solarPowerDps.push({
                    x: dateTime,
                    y: solarPower
                });
                n = document.querySelector(".numeric-solargeneration");
                n.innerText = solarPower.toFixed(2)+"W";

                prevDateTime[arrIndex] = dateTime;

                if (loadPowerDps.length > dataLength) {
                    loadPowerDps.shift();
                    windPowerDps.shift();
                    solarPowerDps.shift();
                }
            }  
        });

        if(powerReadings.length >= 1 || timeControl=='live') {
            chart[arrIndex].render();
            containerId = 'chartContainer-overview';
            let chartContainer = document.getElementById(containerId);
            let x = chartContainer.querySelector('.no-data');
            if(x) x.remove();
        } else {
            chartContainer = document.getElementById(containerName);
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
}


renderOverview('area', 0.2, 'day', '1', 'DD MMMM YYYY');