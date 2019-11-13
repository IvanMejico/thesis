<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="styles.css"></style>
<link rel="stylesheet" type="text/css" href="ledstyles.css"></style>
</head>
<body>
	<div class="header">
		<h1>IoT Dashboard</h1>
		<!-- <h4>CREATED BY:</h4>
		<span>Mark Anthony Ivan S. Mejico</span> -->
	</div>
	<div class="main-content">
		<div class="panel panel1">
			<div class="panel-header"><h3>Wind Sensor Data</h3></div>
			<div class="panel-body">
				<div class="chart">
					<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>
				</div>
			</div>
		</div>

		<div class="panel panel2">
			<div class="panel-header"><h3>Numeric Display</h3></div>
			<div class="panel-body">
				<div class="numeric">
					<span id="wind-numeric">0</span>
				</div>
			</div>
		</div>
		

		<div class="panel panel3">
			<div class="panel-header"><h3>Relay Status</h3></div>
			<div class="panel-body">
				<div class="leds">
					<div>
						<span>Relay #1</span>
						<div id="led-r1" class="led led-red"></div>
					</div>
					<div>
						<span>Relay #2</span>
						<div id="led-r2" class="led led-yellow"></div>
					</div>
					<div>
						<span>Relay #3</span>
						<div id="led-r3" class="led led-green"></div>
					</div>
					<div>
						<span>Relay #4</span>
						<div id="led-r4" class="led led-blue"></div>
					</div>
					<div>
						<span>Relay #5</span>
						<div id="led-r5" class="led led-violet"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="manualcontrol">
		<h1>Relay Manual Control</h1>
		<div class="relaystatus">
			<div class="status1">
				<h4>Relay (Sensor node #1)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay1" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Relay (Sensor node #2)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay2" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Relay (Sensor node #3)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay3" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Relay (Sensor node #4)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay4" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Relay (Sensor node #5)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay5" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
		</div>
	</div>
	<script src="script.js"></script>
	<script src="resources/canvasjs.min.js"></script>
	</body>
</html>
