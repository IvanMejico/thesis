<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="styles.css"></style>
<script>
window.onload = function () {
    toggle = document.getElementById('relay1');
    toggle.onclick = function() {
        saveToggle();
    }
    
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
		xhr.open('GET', 'getTrends.php?datalength='+count, true);
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

    // update toggle
    var updateToggle = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'getrelaystatus.php?getid=1',true);
        xhr.onload = function() {
            var response = JSON.parse(this.responseText);
            if(response.status == "TR")
                toggle.checked = true;
            else if (response.status == "FL")
                toggle.checked = false;
        }
        xhr.send();
    }

    var saveToggle = function() {
        status = toggle.checked?'TR':'FL';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'getrelaystatus.php?setid=1&setvalue='+status,true);
        xhr.onload = function() {
            console.log('okay');
        }
        xhr.send();
    }
    
	updateChart(dataLength);
	setInterval(function(){updateChart()}, updateInterval);
    setInterval(function(){updateToggle()}, updateInterval);
}
</script>
</head>
<body>
<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>
<div class="relay-status">
     <div class="status1">
       <h4>Relay 1:</h4>
       <label class="switch">
     <input type="checkbox" id="relay1" checked>
         <span class="slider round"></span>
       </label>
     </div>
</div>
<script src="resources/canvasjs.min.js"></script>
</body>
</html>
