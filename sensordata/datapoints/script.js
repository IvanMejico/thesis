var updateInterval = 3000;
var interval = [];
var reading = [];

// GONNA WORK ON THIS CODE LATER ON
// var sensorArray;
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'getSensorList.php', false)
// xhr.onload = function() {
//      sensorArray = JSON.parse(this.responseText);
//     sensorArray.forEach(function(item){
//         renderTrends('chartContainer1', 'PSN001');
//         renderTrends('chartContainer2', 'PSN003');
//     })
// }
// xhr.send();

/**
 * Reading Charts
 */

class SensorReading {
    constructor(sensorId, unit='all', timeControl='live', dateString='') {
        this.sensorId = sensorId;
        this.chartContainer = "chartContainer-"+sensorId;
        this.unit = unit;
        this.timeControl = timeControl;
        this.date = dateString;
    }
}

dataPanels = document.getElementsByClassName('panel trends');
for(let panel of dataPanels) {
    var xValueFormat;
    var dateString;
    var chartIntervalType ;
    var chartInterval;
    var chartType;
    var opacity;


    sensorId = panel.dataset.key;

    tabControls = panel.querySelector('.tab-control');
    navigationControls = panel.querySelector('.navigation-control');

    timeControlGroup = tabControls.children[0];
    valueControlGroup = tabControls.children[1];

    timeControlBtns = timeControlGroup.getElementsByTagName('input');
    timeControl = getSelectedValue(timeControlBtns);
    valueControlBtns = valueControlGroup.getElementsByTagName('input');
    valueControl = getSelectedValue(valueControlBtns);

    if(timeControl == 'live') {
        datePickerBtn = navigationControls.children[1];
        datePickerBtn.disabled = true;

        /**
         * Live data parameters
         */
        xValueFormat = "h:mm TT";
        chartIntervalType = "minute";
        chartInterval = 1;
        chartType = 'area';
        dateString = '';
        opacity = 0.2;
    } else {
        datePickerBtn = navigationControls.children[1]
        datePickerBtn.disabled = false;

        /**
         * Historic data parameters
         */

        // ### These values are temporary
        switch(timeControl) {
            case 'day':
                chartIntervalType = "hour";
                chartInterval = 1;
                xValueFormat = "h:mm TT";
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
    
    renderTrends(
        reading[sensorId], 
        chartType, 
        opacity, 
        chartIntervalType, 
        chartInterval,
        xValueFormat
    );

    if(timeControl == 'live') setJob(sensorId, updateInterval);
}



/**
 * OVERVIEW CHART
 */

class OverviewReading {
    constructor(name, timeControl='live', dateString='') {
        this.name = name;
        this.timeControl = timeControl;
        this.dateString = dateString;
        this.chartContainer = 'chartContainer-'+name;
    }
}

dataPanels = document.getElementsByClassName('panel overview');
for(let panel of dataPanels) {
    var xValueFormat;
    var dateString;
    var chartIntervalType ;
    var chartInterval;
    var chartType;
    var opacity;


    index = panel.dataset.key;

    tabControls = panel.querySelector('.tab-control');
    navigationControls = panel.querySelector('.navigation-control');

    timeControlGroup = tabControls.children[0];

    timeControlBtns = timeControlGroup.getElementsByTagName('input');
    timeControl = getSelectedValue(timeControlBtns);

    if(timeControl == 'live') {
        datePickerBtn = navigationControls.children[1];
        datePickerBtn.disabled = true;

        /**
         * Live chart parameters
         */
        xValueFormat = "h:mm TT";
        chartIntervalType = "minute";
        chartInterval = 1;
        chartType = 'area';
        dateString = '';
        opacity = 0.2;
    } else {
        datePickerBtn = navigationControls.children[1]
        datePickerBtn.disabled = false;

        /**
         * Setting up summary chart parameters
         */
        switch(timeControl) {
            case 'day':
                chartIntervalType = "hour";
                chartInterval = 1;
                xValueFormat = "h:mm TT";
                chartType = 'area';
                buildDayDatePicker(index);
                dateString = document.getElementById('datepicker-'+index).value;
                break;
            case 'week':
                chartIntervalType = "day";
                chartInterval = 1;
                xValueFormat = "DD MMMM YYYY";
                buildWeekDatePicker(index);
                dateString = document.getElementById('datepicker-'+index).value;
                dateString = parseWeek(dateString);
                chartType = 'area';
                break;
            case 'month':
                chartIntervalType = "day";
                chartInterval = 1;
                xValueFormat = "DD MMMM YYYY";
                chartType = 'area';
                buildDayDatePicker(index);
                dateString = document.getElementById('datepicker-'+index).value;
                break;
            case 'year':
                chartIntervalType = "month";
                chartInterval = 1;
                xValueFormat = "MMMM";
                chartType = 'area';
                buildDayDatePicker(index);
                dateString = document.getElementById('datepicker-'+index).value;
                break;
        }
        opacity = 0.2;
    }

    // Render chart
    reading[index] = new OverviewReading(
        index,
        timeControl, 
        dateString
    );

    renderOverview(
        reading[index],
        chartType, 
        opacity, 
        chartIntervalType, 
        chartInterval,
        xValueFormat
    );

    if(timeControl == 'live') setJob(reading[index].name, updateInterval);
}

function setJob(index, interval) {
    window.interval[index] = setInterval(function(){
        if(index=='overview')
            updateOverview(reading[index]);
        else
            updateTrends(reading[index]);
    }, interval);
}



// UPDATE TOGGLE BUTTONS
setInterval(function(){updateToggle("PSN001-R0")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R1")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R2")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R3")}, updateInterval);