<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Wind-Solar Hybrid Monitoring System Dashboard</title>
<link rel="shortcut icon" type="image/x-icon" href="assets/logo.png">
<link rel="stylesheet" type="text/css" href="styles.css">
<link rel="stylesheet" type="text/css" href="ledstyles.css">
<link rel="stylesheet" type="text/css" href="assets/flaticon/font/flaticon.css"></link>

<link rel="stylesheet" type="text/css" href="assets/pikaday/css/pikaday.css"></link>
<link rel="stylesheet" type="text/css" href="assets/pikaday/css/theme.css">
<link rel="stylesheet" type="text/css" href="assets/pikaday/css/triangle.css">

<style>
	.header {
		padding: 0;
	}
	.header h1 {
		padding: 10px 0;
		font-size: 1em;
		color: #3dc9ff;
	}
	.header h1 span {
		color: rgb(135, 231, 115);
		display: inline;
	}
	.header .credits {
		padding: 4px 0;
		background-color: rgb(228, 35, 10);
	}
	.credits .proponents{
		display: flex;
		margin: 2px 22%;
	}
	.credits h2 {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 1em;
		color: #fff;
		text-align: center;
		margin: 0;
		padding: 0;
	}
	.proponents span {
		font-size: .9em;
		display: inline-block;
		margin: 0 20px;
		width: 33.33%;

	}
	.proponents span:first-child {
		margin-left: 0;
	}
	.proponents span:last-child {
		margin-right: 0;
	}
	.date {
		margin: 0;
	}

	.chart > div {
		background-color: #1f1e1b;
	}
	
</style>
</head>
<body>
	<div class="header">
		<h1>RaspberryPi <span>IoT Dashboard</span></h1>
		<div class="credits">
			<h2>Proponents</h2>
			<div class="proponents">
				<span>Majorine P. Larracas</span>
				<span>Mark Anthony Ivan S. Mejico</span>
				<span>Catherine A. Matining</span>
			</div>
		</div>
	</div>
	<div class="main-content">
		<div class="graph-group2">
			<div id="ESN001"class="panel">
				<div class="panel-header"><h3>Environment Sensor Node</h3></div>
				<div class="panel-control">
					<div class="tab-control" data-sensorid="ESN001">
						<div class="time-control">
							<input type="radio" data-ctrl="time" name="time-ctrl-environment" id="live-environment" value="live" checked>
							<label for="live-environment"><span>Live</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-environment" id="day-environment" value="day" >
							<label for="day-environment"><span>Day</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-environment" id="week-environment" value="week">
							<label for="week-environment"><span>Week</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-environment" id="month-environment" value="month">
							<label for="month-environment"><span>Month</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-environment" id="year-environment" value="year">
							<label for="year-environment"><span>Year</span></label>
						</div>
						<div class="value-control">
							<input type="radio" data-ctrl="value" name="value-ctrl-environment" id="all-environment" value="all" checked>
							<label for="all-environment" class="tooltip"><span class="tooltiptext">all units</span><span class="flaticon-asterisk-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-environment" id="insolation-environment" value="solar_insolation">
							<label for="insolation-environment" class="tooltip"><span class="tooltiptext">solar insolation</span><span class="flaticon-sun-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-environment" id="windspeed-environment" value="wind_speed">
							<label for="windspeed-environment" class="tooltip"><span class="tooltiptext">wind speed</span><span class="flaticon-wind-1"></span></label>
						</div>
					</div>
					<div class="navigation-control">
						<input type="text" id="datepicker-envi" readonly/>
						<button class="flaticon-calendar" id="datepicker-button-envi"></button>
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
							<span class="numeric-solar_insolation">0W/m²</span>
						</div>
					</div>
					<div class="chart">
						<div id="chartContainer-ESN001" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
			<div id="PSN001" class="panel">
				<div class="panel-header"><h3>Electrical Sensor Node (AC Load Consumption)</h3></div>
				<div class="panel-control">
					<div class="tab-control" data-sensorid="PSN001">
						<div class="time-control">
							<input type="radio" data-ctrl="time" name="time-ctrl-ac_electrical" id="live-ac_electrical" value="live" checked>
							<label for="live-ac_electrical"><span>Live</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-ac_electrical" id="day-ac_electrical" value="day">
							<label for="day-ac_electrical"><span>Day</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-ac_electrical" id="week-ac_electrical" value="week">
							<label for="week-ac_electrical"><span>Week</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-ac_electrical" id="month-ac_electrical" value="month">
							<label for="month-ac_electrical"><span>Month</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-ac_electrical" id="year-ac_electrical" value="year">
							<label for="year-ac_electrical"><span>Year</span></label>
						</div>

						<div class="value-control">
							<input type="radio" data-ctrl="value" name="value-ctrl-ac_electrical" id="all-ac_electrical" value="all" checked>
							<label for="all-ac_electrical" class="tooltip"><span class="tooltiptext">all units</span><span class="flaticon-asterisk-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-ac_electrical" id="voltage-ac_electrical" value="voltage">
							<label for="voltage-ac_electrical" class="tooltip" ><span class="tooltiptext">voltage</span><span class="flaticon-high-voltage-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-ac_electrical" id="current-ac_electrical" value="current">
							<label for="current-ac_electrical" class="tooltip"><span class="tooltiptext">current</span><span class="flaticon-letter-a"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-ac_electrical" id="power-ac_electrical" value="power">
							<label for="power-ac_electrical" class="tooltip"><span class="tooltiptext">power</span><span class="flaticon-no-plug"></span></label>
						</div>
					</div>
					<div class="navigation-control">
						<input type="text" id="datepicker-load" readonly/>
						<button class="flaticon-calendar" id="datepicker-button-load"></button>
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
						<div id="chartContainer-PSN001" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="graph-group3">
			<div id="PSN002" class="panel">
				<div class="panel-header"><h3>Electrical Sensor Node (Wind Turbine Power Generation)</h3></div>
				<div class="panel-control">
					<div class="tab-control" data-sensorid="PSN002">
						<div class="time-control">
							<input type="radio" data-ctrl="time" name="time-ctrl-turbine_electrical" id="live-turbine_electrical" value="live" checked>
							<label for="live-turbine_electrical"><span>Live</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-turbine_electrical" id="day-turbine_electrical" value="day">
							<label for="day-turbine_electrical"><span>Day</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-turbine_electrical" id="week-turbine_electrical" value="week">
							<label for="week-turbine_electrical"><span>Week</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-turbine_electrical" id="month-turbine_electrical" value="month">
							<label for="month-turbine_electrical"><span>Month</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-turbine_electrical" id="year-turbine_electrical" value="year">
							<label for="year-turbine_electrical"><span>Year</span></label>	
						</div>
						<div class="value-control">
							<input type="radio" data-ctrl="value" name="value-ctrl-turbine_electrical" id="all-turbine_electrical" value="all" checked>
							<label for="all-turbine_electrical"><span class="flaticon-asterisk-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-turbine_electrical" id="voltage-turbine_electrical" value="voltage">
							<label for="voltage-turbine_electrical"><span class="flaticon-high-voltage-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-turbine_electrical" id="current-turbine_electrical" value="current">
							<label for="current-turbine_electrical"><span class="flaticon-letter-a"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-turbine_electrical" id="power-turbine_electrical" value="power">
							<label for="power-turbine_electrical"><span class="flaticon-no-plug"></span></label>
						</div>
					</div>
					<div class="navigation-control">
						<input type="text" id="datepicker-turbine" readonly/>
						<button class="flaticon-calendar" id="datepicker-button-turbine"></button>
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
						<div id="chartContainer-PSN002" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
			<div id="PSN003" class="panel">
				<div class="panel-header"><h3>Electrical Sensor Node (Solar Panel Power Generation)</h3></div>
				<div class="panel-control">
					<div class="tab-control" data-sensorid="PSN003">
						<div class="time-control">
							<input type="radio" data-ctrl="time" name="time-ctrl-solar_electrical" id="live-solar_electrical" value="live" checked>
							<label for="live-solar_electrical"><span>Live</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-solar_electrical" id="day-solar_electrical" value="day">
							<label for="day-solar_electrical"><span>Day</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-solar_electrical" id="week-solar_electrical" value="week">
							<label for="week-solar_electrical"><span>Week</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-solar_electrical" id="month-solar_electrical" value="month">
							<label for="month-solar_electrical"><span>Month</span></label>
							<input type="radio" data-ctrl="time" name="time-ctrl-solar_electrical" id="year-solar_electrical" value="year">
							<label for="year-solar-electrical"><span>Year</span></label>
						</div>
						<div class="value-control">
							<input type="radio" data-ctrl="value" name="value-ctrl-solar_electrical" id="all-solar_electrical" value="all" checked>
							<label for="all-solar_electrical"><span class="flaticon-asterisk-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-solar_electrical" id="voltage-solar_electrical" value="voltage">
							<label for="voltage-solar_electrical"><span class="flaticon-high-voltage-1"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-solar_electrical" id="current-solar_electrical" value="current">
							<label for="current-solar_electrical"><span class="flaticon-letter-a"></span></label>
							<input type="radio" data-ctrl="value" name="value-ctrl-solar_electrical" id="power-solar_electrical" value="power">
							<label for="power-solar_electrical"><span class="flaticon-no-plug"></span></label>
						</div>
					</div>
					<div class="navigation-control">
						<input type="text" id="datepicker-panel" readonly/>
						<button class="flaticon-calendar" id="datepicker-button-panel"></button>
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
						<div id="chartContainer-PSN003" style="height: 370px; margin: 0px auto;"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="graph-group1">

			<div class="panel battery-status">
				<div class="panel-header"><h3>Battery Status</h3></div>
				<div class="panel-body">
					<div class="battery-panel">
						<div class="battery">
							<div id="battery-body">
							<div id="charge-status-0" class="charge">Priority 1</div>
							<div id="charge-status-1" class="charge">Priority 2</div>
							<div id="charge-status-2" class="charge">Priority 3</div> 
							<div id="charge-status-3" class="charge">Priority 4</div>
							</div>
							<div id="battery-tip"></div>
							<span id="battery-level">0%</span>
						</div>

						<div class="prioritization-form">
							<table id="battery-loads">
								<thead>
									<tr>
										<td colspan="4">Load Prioritization</td>
									</tr>
									<tr>
										<td></td>
										<td>Label</td>
										<td>Load Name</td>
										<td></td>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div class="panel relay-status">
				<div class="panel-header"><h3>Relay Status</h3></div>
				<div class="panel-body">
					<div class="leds">
						<div>
							<span>Load 1</span>
							<div id="led-r1" class="led led-red"></div>
						</div>
						<div>
							<span>Load 2</span>
							<div id="led-r2" class="led led-yellow"></div>
						</div>
						<div>
							<span>Load 3</span>
							<div id="led-r3" class="led led-green"></div>
						</div>
						<div>
							<span>Load 4</span>
							<div id="led-r4" class="led led-blue"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
		
	<div class="manual-control">
		<h1>Relay Manual Control</h1>
		<div class="relaystatus">
			<!-- LOADS -->
			<!-- <h3>Loads</h3> -->
			<div class="status1">
				<h4>Electrical Sensor Node (Load 1)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay1" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>

			<div class="status1">
				<h4>Electrical Sensor Node (Load 2)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay2" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>


			<div class="status1">
				<h4>Electrical Sensor Node (Load 3)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay3" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>


			<div class="status1">
				<h4>Electrical Sensor Node (Load 4)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay4" checked>
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
	<script src="tabs.js"></script>

	<script src="update_numeric_display.js"></script> <!-- TEMPORARY -->
	<script src="load_prioritization.js"></script>
	<script src="assets/pikaday/js/moment.min.js"></script>
	<script src="assets/pikaday/js/pikaday.js"></script>
	<script src="assets/js/datepicker.js"></script>
	</body>
</html>