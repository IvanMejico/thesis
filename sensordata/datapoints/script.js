var updateInterval = 2000;

// GONNA WORK ON THIS CODE LATER ON
// var sensorArray;
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'getSensorList.php', false)
// xhr.onload = function() {
//     sensorArray = JSON.parse(this.responseText);
//     sensorArray.forEach(function(item){
//         renderChart('chartContainer1', 'PSN001');
//         renderChart('chartContainer2', 'PSN003');
//     })
// }
// xhr.send();


// CHARTS RENDERING
renderChart('chartContainer1', 'ESN001');
enviChart = setInterval(function(){updateChart("ESN001")}, updateInterval);
renderChart('chartContainer2', 'PSN001');
acLoadChart = setInterval(function(){updateChart("PSN001")}, updateInterval);
renderChart('chartContainer3', 'PSN002');
turbineChart = setInterval(function(){updateChart("PSN002")}, updateInterval);
renderChart('chartContainer4', 'PSN003');
panelChart = setInterval(function(){updateChart("PSN003")}, updateInterval);


// UPDATE TOGGLE BUTTONS
setInterval(function(){updateToggle("PSN001-R0")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R1")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R2")}, updateInterval);
setInterval(function(){updateToggle("PSN001-R3")}, updateInterval);