var updateInterval = 4000;

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

function getSelectedValue(tabs) {
    for(var i=0; i<tabs.length; i++) {
        if(tabs[i].checked) {
            return tabs[i].value;
        }
    }
}

class SensorReading {
    constructor(sensorId, unit='all', timeControl='live') {
        this.sensorId = sensorId;
        this.chartContainer = "chartContainer-"+sensorId;
        this.unit = unit;
        this.timeControl = timeControl;
    }
}

interval = [];
reading = [];


// GET ALL TIME AND VALUE(UNIT) CONTROL TAB VALUES THEN RENDER THE CHARTS ACCORDINGLY
tabControlGroups = document.getElementsByClassName('tab-control');

for(let group of tabControlGroups) {
    sensorId = group.dataset.sensorid

    tabSubGroups = group.getElementsByTagName("div");
    timeControl = tabSubGroups[0];
    valueControl = tabSubGroups[1];

    sensorId = group.dataset.sensorid;
    btnTCtrl = timeControl.getElementsByTagName('input');
    btnVCtrl = valueControl.getElementsByTagName('input');

    timeControl = getSelectedValue(btnTCtrl);
    valueControl = getSelectedValue(btnVCtrl);

    reading[sensorId] = new SensorReading(sensorId, valueControl, timeControl);
    renderChart(reading[sensorId]);
    interval[sensorId] = setInterval(function(){
        updateChart(reading[sensorId])
    }, updateInterval);
}


// UPDATE TOGGLE BUTTONS
setInterval(function(){updateToggle("PSN001-R0")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R1")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R2")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R3")}, updateInterval);