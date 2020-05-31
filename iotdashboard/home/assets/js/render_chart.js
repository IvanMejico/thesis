var chart = [];
const dataLength = 200;

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

function renderTrends(readingObj, chartType="area", opacity=1, intervalType="second", interval=60, xValueFormat="h:mm:ss TT") {
    
}

var updateTrends= function(readingObj, count=1) {
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

        let len = sensorData.length;

        if(sensorType == 'electrical') {
            sensorData.forEach(function(item, index) {
                let timeStamp = item.timestamp;
                let dateTime = new Date(timeStamp);
                if(len > 1 && readingObj.timeControl == 'live') {
                    let tBracket = ((len - index) * 7) * 1000; //number of seconds that corresponds to the length of data retrieved.
                    let l = sensorData[index].timestamp;
                    let dtLowerLimit = new Date(l)
                    let u = sensorData[len-1].timestamp;
                    let dtUpperLimit = new Date(u)
                    let diff = dtUpperLimit.getTime() - dtLowerLimit.getTime();
    
                    // console.log(tBracket, len, diff, l, u);
    
                    if(diff > tBracket) {
                        // console.log('skipped', diff);
                        return;
                    }
                }
                
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

                    if (window[dataBuffer][readingObj.sensorId].length > count) {
                        voltageDps[readingObj.sensorId].shift();
                        currentDps[readingObj.sensorId].shift();
                        powerDps[readingObj.sensorId].shift();
                    }
                }    
            });
        } else if (sensorType == 'environment') {
            sensorData.forEach(function(item, index) {
                let timeStamp = item.timestamp;
                let dateTime = new Date(timeStamp);

                if(len > 1 && readingObj.timeControl == 'live') {
                    let tBracket = ((len - index) * 7) * 1000; //number of seconds that corresponds to the lenght of data retrieved.
                    let l = sensorData[index].timestamp;
                    let dtLowerLimit = new Date(l)
                    let u = sensorData[len-1].timestamp;
                    let dtUpperLimit = new Date(u)
                    let diff = dtUpperLimit.getTime() - dtLowerLimit.getTime();

                    // console.log(tBracket, len, diff, l, u);

                    if(diff > tBracket) {
                        // console.log('skipped', diff);
                        return;
                    }
                }

               
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

function renderOverview(readingObj, chartType="area", opacity=1, intervalType="second", interval=60, xValueFormat="hh:mm:ss TT") {
    loadPowerDps = [];
    windPowerDps = [];
    solarPowerDps = [];

    chart[readingObj.name] = new CanvasJS.Chart(readingObj.chartContainer, {
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
    updateOverview(readingObj, dataLength);
}

var updateOverview = function(readingObj, count=1) {
    if(!prevDateTime[readingObj.name])
        prevDateTime[readingObj.name] = new Date( 2012, 0, 1, 0, 0 );
    
    // Setup AJAX Request
    var qString = "getOverview.php?time_control="+readingObj.timeControl+"&date="+readingObj.dateString+"&data_length="+count;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', qString, true);
    xhr.onload = function() {
        // Do not continue if there's no value returned
        if(!this.responseText)
            return;

        var powerReadings = JSON.parse(this.responseText);
        let len = powerReadings.length;

        powerReadings.forEach(function(item, index) {
            let timeStamp = item.timestamp;
            let dateTime = new Date(timeStamp);

            // 1) Get the length of the dataset.
            // 2) Calculate the number of seconds that corresponds to the length of the retrieved data
            // 3) Compute the time interval between the current data on the loop and the last data on the dataset.
            // 4) If the interval is greater than the supposed time bracket, skip to the next data;
            if(len > 1 && readingObj.timeControl == 'live') {
                let tBracket = ((len - index) * 7)*1000; //number of seconds that corresponds to the lenght of data retrieved.
                
                // Get the timestamp of the latest reading on the database
                let l = powerReadings[index].timestamp;
                let dtLowerLimit = new Date(l)
                let u = powerReadings[len-1].timestamp;
                let dtUpperLimit = new Date(u)
                let diff = dtUpperLimit.getTime() - dtLowerLimit.getTime();

                // console.log(tBracket, len, diff, l, u);

                if(diff > tBracket) {
                    // console.log('skipped', diff);
                    return;
                }
            }
            
            if(dateTime.getTime() !== prevDateTime[readingObj.name].getTime()) {
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

                prevDateTime[readingObj.name] = dateTime;

                if (loadPowerDps.length > dataLength) {
                    loadPowerDps.shift();
                    windPowerDps.shift();
                    solarPowerDps.shift();
                }
            }  
        });
        if(powerReadings.length >= 1 || readingObj.timeControl=='live') {
            chart[readingObj.name].render();
            containerId = 'chartContainer-overview';
            let chartContainer = document.getElementById(containerId);
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
}


