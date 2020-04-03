var updateInterval = 2000;

// GONNA WORK ON THIS CODE LATER ON
// var sensorArray;
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'getSensorList.php', false)
// xhr.onload = function() {
//      sensorArray = JSON.parse(this.responseText);
//     sensorArray.forEach(function(item){
//         renderChart('chartContainer1', 'PSN001');
//         renderChart('chartContainer2', 'PSN003');
//     })
// }
// xhr.send();

class SensorReading {
    constructor(sensorId, unit='all', timeControl='live', dateString='') {
        this.sensorId = sensorId;
        this.chartContainer = "chartContainer-"+sensorId;
        this.unit = unit;
        this.timeControl = timeControl;
        this.date = dateString;
    }
}


var interval = [];
var reading = [];


// GET ALL TIME AND VALUE(UNIT) CONTROL TAB VALUES THEN RENDER THE CHARTS ACCORDINGLY
tabControlGroups = document.getElementsByClassName('tab-control');

for(let group of tabControlGroups) {
    var xValueFormat;
    var dateString;
    var chartIntervalType ;
    var chartInterval;
    var chartType;
    var opacity;
    
    sensorId = group.dataset.sensorid
    
    field = document.getElementById('datepicker-'+sensorId);
    // field.value = picker[sensorId];

    tabSubGroups = group.getElementsByTagName("div");
    timeControl = tabSubGroups[0];
    valueControl = tabSubGroups[1];

    sensorId = group.dataset.sensorid;
    btnTCtrl = timeControl.getElementsByTagName('input');
    btnVCtrl = valueControl.getElementsByTagName('input');

    timeControl = getSelectedValue(btnTCtrl);
    valueControl = getSelectedValue(btnVCtrl);
    if(timeControl == 'live') {
        datePickerBtn = group.nextElementSibling.children[1]
        datePickerBtn.disabled = true;

        /**
         * Live data configurations
         */
        xValueFormat = "h:mm:ss TT";
        chartIntervalType = "minute";
        chartInterval = 1;
        chartType = 'area';
        dateString = '';
        opacity = 0.2;
    } else {
        datePickerBtn = group.nextElementSibling.children[1]
        datePickerBtn.disabled = false;

        /**
         * Historic data configurations
         */

        // ### These values are temporary
        switch(timeControl) {
            case 'day':
                chartIntervalType = "hour";
                chartInterval = 1;
                xValueFormat = "h:mm:ss TT";
                chartType = 'area';
                buildDayDatePicker(sensorId);
                dateString = document.getElementById('datepicker-'+sensorId).value;
                break;
            case 'week':
                chartIntervalType = "day";
                chartInterval = 1;
                xValueFormat = "DD MMMM YYYY";
                buildWeekDatePicker(sensorId);
                dateString = document.getElementById('datepicker-'+sensorId).value;
                dateString = parseWeek(dateString);
                chartType = 'area';
                break;
            case 'month':
                chartIntervalType = "day";
                chartInterval = 1;
                xValueFormat = "DD MMMM YYYY";
                chartType = 'area';
                buildDayDatePicker(sensorId);
                dateString = document.getElementById('datepicker-'+sensorId).value;
                break;
            case 'year':
                chartIntervalType = "month";
                chartInterval = 1;
                xValueFormat = "MMMM";
                chartType = 'area';
                buildDayDatePicker(sensorId);
                dateString = document.getElementById('datepicker-'+sensorId).value;
                break;
        }
        // ###
        opacity = 0.2;
    }

    // Render chart
    reading[sensorId] = new SensorReading(
        sensorId, 
        valueControl, 
        timeControl, 
        dateString
    );
    
    renderChart(
        reading[sensorId], 
        chartType, 
        opacity, 
        chartIntervalType, 
        chartInterval,
        xValueFormat
    );


    // If time control is 'live',reassign interval to chart update
    if(timeControl == 'live') setJob(sensorId);
    
}

function setJob(sensorId) {
    window.interval[sensorId] = setInterval(function(){
        updateChart(reading[sensorId]);
    }, updateInterval);
}
// UPDATE TOGGLE BUTTONS
setInterval(function(){updateToggle("PSN001-R0")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R1")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R2")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R3")}, updateInterval);