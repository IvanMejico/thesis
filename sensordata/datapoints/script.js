var updateInterval = 5000;

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
envi = setInterval(function(){updateChart("ESN001")}, updateInterval);
renderChart('chartContainer2', 'PSN001');
acLoad = setInterval(function(){updateChart("PSN001")}, updateInterval);
renderChart('chartContainer3', 'PSN002');
turbine = setInterval(function(){updateChart("PSN002")}, updateInterval);
renderChart('chartContainer4', 'PSN003');
panel = setInterval(function(){updateChart("PSN003")}, updateInterval);


// UPDATE TOGGLE BUTTONS
setInterval(function(){updateToggle("PSN001")}, updateInterval);
setInterval(function(){updateToggle("PSN002")}, updateInterval);
setInterval(function(){updateToggle("PSN003")}, updateInterval);