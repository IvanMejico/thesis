<?php include("getData.php") ?>
<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<script>
window.onload = function () {

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
		dataPoints: <?php echo json_encode($dataPoints)?>
	}]
});

chart.render();

}
</script>
</head>
<body>
<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>
<script src="resources/canvasjs.min.js"></script>
</body>
</html>