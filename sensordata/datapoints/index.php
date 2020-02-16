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
		<h4>CREATED BY:</h4>
		<span>Mark Anthony Ivan S. Mejico</span>
	</div>
	<div class="main-content">
		<div class="graph-group1">
			<div id="ESN001"class="panel">
				<div class="panel-header"><h3>Environment Sensor Node</h3></div>
				<div class="panel-body">
					<div class="numeric-group">
						<div>
							<i>Wind Speed</i>
							<span class="numeric-wind_speed">0m/s</span>
						</div>
						<div>
							<i>Solar Irradiance</i>
							<span class="numeric-solar_irradiance">0W/m²</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer1" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>

			<div class="panel relay-status">
				<div class="panel-header"><h3>Relay Status</h3></div>
				<div class="panel-body">
					<div class="leds">
						<div>
							<span>Environment Sensor</span>
							<div id="led-r1" class="led led-red"></div>
						</div>
						<div>
							<span>Electric Sensor Node (AC Load)</span>
							<div id="led-r2" class="led led-yellow"></div>
						</div>
						<div>
							<span>Electric Sensor Node (Wind)</span>
							<div id="led-r3" class="led led-green"></div>
						</div>
						<div>
							<span> Electric Sensor Node (Solar)</span>
							<div id="led-r4" class="led led-blue"></div>
						</div>
						<div>
							<span>Electric Sensor Node (Battery)</span>
							<div id="led-r5" class="led led-violet"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="graph-group2">
			<div id="PSN001" class="panel">
				<div class="panel-header"><h3>Electric Sensor Node (AC Load)</h3></div>
				<div class="panel-body">
					<div class="numeric-group">
						<div>
							<i>Power</i>
							<span class="numeric-power">0W</span>
						</div>
						<div>
							<i>Voltage</i>
							<span class="numeric-voltage">0V</span>
						</div>
						<div>
							<i>Current</i>
							<span class="numeric-current">0A</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer2" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
			<div id="PSN002" class="panel">
				<div class="panel-header"><h3>Electric Sensor Node (Wind)</h3></div>
				<div class="panel-body">
					<div class="numeric-group">
						<div>
							<i>Power</i>
							<span class="numeric-power">0W</span>
						</div>
						<div>
							<i>Voltage</i>
							<span class="numeric-voltage">0V</span>
						</div>
						<div>
							<i>Current</i>
							<span class="numeric-current">0A</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer3" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
			<div id="PSN003" class="panel">
				<div class="panel-header"><h3>Electric Sensor Node (Solar)</h3></div>
				<div class="panel-body">
					<div class="numeric-group">
						<div>
							<i>Power</i>
							<span class="numeric-power">0W</span>
						</div>
						<div>
							<i>Voltage</i>
							<span class="numeric-voltage">0V</span>
						</div>
						<div>
							<i>Current</i>
							<span class="numeric-current">0A</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer4" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
			<div id="PSN004" class="panel">
				<div class="panel-header"><h3>Electric Sensor Node (Wind)</h3></div>
				<div class="panel-body">
					<div class="numeric-group">
						<div>
							<i>Power</i>
							<span class="numeric-power">0W</span>
						</div>
						<div>
							<i>Voltage</i>
							<span class="numeric-voltage">0V</span>
						</div>
						<div>
							<i>Current</i>
							<span class="numeric-current">0A</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer5" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
			<!-- <div id="PSN004" class="panel">
				<div class="panel-header"><h3>Electric Sensor Node (Battery)</h3></div>
				<div class="panel-body">
					<div class="numeric-group">
						<div>
							<i>Power</i>
							<span class="numeric-power">0W</span>
						</div>
						<div>
							<i>Voltage</i>
							<span class="numeric-voltage">0V</span>
						</div>
						<div>
							<i>Current</i>
							<span class="numeric-current">0A</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer5" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div> -->
		</div>
	</div>
		
	<div class="manual-control">
		<h1>Relay Manual Control</h1>
		<div class="relaystatus">
			<div class="status1">
				<h4>Environment Sensor Node</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay1" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Electric Sensor Node (AC Load)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay2" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Electric Sensor Node (Wind)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay3" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Electric Sensor Node (Solar)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay4" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Electric Sensor Node (Battery)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay5" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
		</div>
	</div>
	<script src="colorsets.js"></script>
	<script src="resources/canvasjs.min.js"></script>
	<script src="render_chart.js"></script>
	<script src="toggle.js"></script>
	<script src="script.js"></script>

	<script src="update_numeric_display.js"></script> <!-- TEMPORARY -->

	</body>
</html>
