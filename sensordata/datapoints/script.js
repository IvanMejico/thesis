var updateInterval = 5000;
var dataLength = 20;


// GONNA WORK ON THIS CODE LATER ON
// var sensorArray;
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'getSensorList.php', false)
// xhr.onload = function() {
//     sensorArray = JSON.parse(this.responseText);
//     sensorArray.forEach(function(item){
//         renderChart('chartContainer1', 'PSN001', dataLength);
//         renderChart('chartContainer2', 'PSN003', dataLength);
//     })
// }
// xhr.send();


// CHARTS RENDERING
renderChart('chartContainer1', 'ESN001', dataLength);
setInterval(function(){updateChart("ESN001")}, updateInterval);
renderChart('chartContainer2', 'PSN001', dataLength);
setInterval(function(){updateChart("PSN001")}, updateInterval);
renderChart('chartContainer3', 'PSN002', dataLength);
setInterval(function(){updateChart("PSN002")}, updateInterval);
renderChart('chartContainer4', 'PSN003', dataLength);
setInterval(function(){updateChart("PSN003")}, updateInterval);
renderChart('chartContainer5', 'PSN004', dataLength);
setInterval(function(){updateChart("PSN004")}, updateInterval);



// UPDATE TOGGLE BUTTONS
// setInterval(function(){updateToggle("ESN001")}, updateInterval);
setInterval(function(){updateToggle("PSN001")}, updateInterval);
setInterval(function(){updateToggle("PSN002")}, updateInterval);
setInterval(function(){updateToggle("PSN003")}, updateInterval);
setInterval(function(){updateToggle("PSN004")}, updateInterval);