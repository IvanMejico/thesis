<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<script>
window.onload = function () {

	var dps = [];

	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		theme: "light1",
		title:{
			text: "Wind Power Chart"
		},
		axisY:{
			includeZero: false
		},
		data: [{        
			type: "line",
			markerSize: 5,
			dataPoints: dps
		}]
	});

	var xVal;
	var yVal;
	var updateInterval = 1000;
	var dataLength = 50;
	var prevXval = 0;

	var updateChart = function (count) {
		var response;
		
		count = count || 1;

		// Perform AJAX request here. Get the xVal and the yVal values
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'getData.php?datalength='+count, true);
		xhr.onload = function() {
			response = JSON.parse(this.responseText);

			// foreach element in the response array, push it to the dataPoints;
			response.forEach(function(item, index){
				// while there's element left, push data to dataPoints
				let xVal = item['x'];
				let yVal = item['y'];

				// if count == 1 check if the current id == previous id
				if(xVal != prevXval) {
					dps.push({
						x: xVal,
						y: yVal
					});
					prevXval = xVal;
				}
			});	
		}
		xhr.send();


		if (dps.length > dataLength) {
			dps.shift();
		}
		chart.render();
	};

	updateChart(dataLength);
	setInterval(function(){updateChart()}, updateInterval);

}
</script>
</head>
<body>
<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>
<script src="resources/canvasjs.min.js"></script>
</body>
</html>