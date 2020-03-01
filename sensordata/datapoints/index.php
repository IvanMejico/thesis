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
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-environment" id="day-environment" value="day" checked>
						<label for="day-environment"><span>D</span></label>
						<input type="radio" name="filter-environment" id="week-environment" value="week">
						<label for="week-environment"><span>W</span></label>
						<input type="radio" name="filter-environment" id="month-environment" value="month">
						<label for="month-environment"><span>M</span></label>
						<input type="radio" name="filter-environment" id="year-environment" value="year">
						<label for="year-environment"><span>Y</span></label>
					</div>
					<div class="text-control">
						<em class="date">February 24, 2020</em>
						<em class="week-day">Monday</em>
					</div>
					<div class="navigation-control">
						<span><</span>
						<span>></span>
					</div>
				</div>
				<div class="panel-body">
		
					<div class="numeric-group">
						<div>
							<i>Wind Speed</i>
							<span class="numeric-wind_speed">0m/s</span>
						</div>
						<div>
							<i>Solar Insolation</i>
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
						<!-- <div>
							<span>Environment Sensor</span>
							<div id="led-r1" class="led led-red"></div>
						</div> -->
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
						<!-- <div>
							<span>Electric Sensor Node (Battery)</span>
							<div id="led-r5" class="led led-violet"></div>
						</div> -->
					</div>
				</div>
			</div>
		</div>
		<div class="graph-group2">
			<div id="PSN001" class="panel">
				<div class="panel-header"><h3>Electric Sensor Node (AC Load)</h3></div>
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-ac-electric" id="day-ac-electric" value="day" checked>
						<label for="day-ac-electric"><span>D</span></label>
						<input type="radio" name="filter-ac-electric" id="week-ac-electric" value="week">
						<label for="week-ac-electric"><span>W</span></label>
						<input type="radio" name="filter-ac-electric" id="month-ac-electric" value="month">
						<label for="month-ac-electric"><span>M</span></label>
						<input type="radio" name="filter-ac-electric" id="year-ac-electric" value="year">
						<label for="year-ac-electric"><span>Y</span></label>
					</div>
					<div class="text-control">
						<em class="date">February 24, 2020</em>
						<em class="week-day">Monday</em>
					</div>
					<div class="navigation-control">
						<span><</span>
						<span>></span>
					</div>
				</div>
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
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-wind-electric" id="day-wind-electric" value="day" checked>
						<label for="day-wind-electric"><span>D</span></label>
						<input type="radio" name="filter-wind-electric" id="week-wind-electric" value="week">
						<label for="week-wind-electric"><span>W</span></label>
						<input type="radio" name="filter-wind-electric" id="month-wind-electric" value="month">
						<label for="month-wind-electric"><span>M</span></label>
						<input type="radio" name="filter-wind-electric" id="year-wind-electric" value="year">
						<label for="year-wind-electric"><span>Y</span></label>
					</div>
					<div class="text-control">
						<em class="date">February 24, 2020</em>
						<em class="week-day">Monday</em>
					</div>
					<div class="navigation-control">
						<span><</span>
						<span>></span>
					</div>
				</div>
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
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-solar-electric" id="day-solar-electric" value="day" checked>
						<label for="day-solar-electric"><span>D</span></label>
						<input type="radio" name="filter-solar-electric" id="week-solar-electric" value="week">
						<label for="week-solar-electric"><span>W</span></label>
						<input type="radio" name="filter-solar-electric" id="month-solar-electric" value="month">
						<label for="month-solar-electric"><span>M</span></label>
						<input type="radio" name="filter-solar-electric" id="year-solar-electric" value="year">
						<label for="year-solar-electric"><span>Y</span></label>
					</div>
					<div class="text-control">
						<em class="date">February 24, 2020</em>
						<em class="week-day">Monday</em>
					</div>
					<div class="navigation-control">
						<span><</span>
						<span>></span>
					</div>
				</div>
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
			<!-- <div class="status1">
				<h4>Environment Sensor Node</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay1" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div> -->
	
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
	
			<!-- <div class="status1">
				<h4>Electric Sensor Node (Battery)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay5" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div> -->
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
