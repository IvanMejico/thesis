<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="styles.css"></style>
<link rel="stylesheet" type="text/css" href="ledstyles.css"></style>
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
						<div>
							<span>Wind</span>
							<div id="led-r5" class="led led-violet"></div>
						</div>
						<div>
							<span>Solar</span>
							<div id="led-r6" class="led led-orange"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="graph-group2">
			<div id="PSN001" class="panel">
				<div class="panel-header"><h3>Electrical Sensor Node (AC Load)</h3></div>
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-ac-electrical" id="day-ac-electrical" value="day" checked>
						<label for="day-ac-electrical"><span>D</span></label>
						<input type="radio" name="filter-ac-electrical" id="week-ac-electrical" value="week">
						<label for="week-ac-electrical"><span>W</span></label>
						<input type="radio" name="filter-ac-electrical" id="month-ac-electrical" value="month">
						<label for="month-ac-electrical"><span>M</span></label>
						<input type="radio" name="filter-ac-electrical" id="year-ac-electrical" value="year">
						<label for="year-ac-electrical"><span>Y</span></label>
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
				<div class="panel-header"><h3>Electrical Sensor Node (Wind Turbine)</h3></div>
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-wind-electrical" id="day-wind-electrical" value="day" checked>
						<label for="day-wind-electrical"><span>D</span></label>
						<input type="radio" name="filter-wind-electrical" id="week-wind-electrical" value="week">
						<label for="week-wind-electrical"><span>W</span></label>
						<input type="radio" name="filter-wind-electrical" id="month-wind-electrical" value="month">
						<label for="month-wind-electrical"><span>M</span></label>
						<input type="radio" name="filter-wind-electrical" id="year-wind-electrical" value="year">
						<label for="year-wind-electrical"><span>Y</span></label>
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
				<div class="panel-header"><h3>Electrical Sensor Node (Solar Panel)</h3></div>
				<div class="panel-control">
					<div class="tab-control">
						<input type="radio" name="filter-solar-electrical" id="day-solar-electrical" value="day" checked>
						<label for="day-solar-electrical"><span>D</span></label>
						<input type="radio" name="filter-solar-electrical" id="week-solar-electrical" value="week">
						<label for="week-solar-electrical"><span>W</span></label>
						<input type="radio" name="filter-solar-electrical" id="month-solar-electrical" value="month">
						<label for="month-solar-electrical"><span>M</span></label>
						<input type="radio" name="filter-solar-electrical" id="year-solar-electrical" value="year">
						<label for="year-solar-electrical"><span>Y</span></label>
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



			<!-- GENERATORS -->
			<!-- <h3>Generators</h3> -->
			<div class="status1">
				<h4>Electrical Sensor Node (Wind)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay5" checked>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
	
			<div class="status1">
				<h4>Electrical Sensor Node (Solar)</h4>
				<div>
					<label class="switch">
						<input type="checkbox" id="relay6" checked>
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

	</body>
</html>
