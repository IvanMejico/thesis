<?php
session_start();
$msg = "";
if(!isset($_SESSION['logged_in_user'])) {
	header('Location: ../');
}
?>
<!DOCTYPE HTML>
<html>
<head>  
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Wind-Solar Hybrid Monitoring System Dashboard</title>
<link rel="shortcut icon" type="image/x-icon" href="../assets/images/logo.png">
<link rel="stylesheet" type="text/css" href="../assets/css/dashboard.css">
<link rel="stylesheet" type="text/css" href="../assets/resources/flaticon/font/flaticon.css">

<link rel="stylesheet" type="text/css" href="../assets/css/loader.css">

<link rel="stylesheet" type="text/css" href="../assets/resources/pikaday/css/theme.css">
<link rel="stylesheet" type="text/css" href="../assets/resources/pikaday/css/triangle.css">
<link rel="stylesheet" type="text/css" href="../assets/resources/pikaday/css/pikaday.css">
<link rel="stylesheet" type="text/css" href="../assets/resources/pikamonth/css/pikamonth.css">

<!-- for prioritization table -->
<link rel="stylesheet" type="text/css" href="../assets/resources/priotable/assets/css/components.css">
<link rel="stylesheet" type="text/css" href="../assets/resources/priotable/assets/css/table.css">

<!-- for led indicators -->
<link rel="stylesheet" type="text/css" href="../assets/resources/ledpanel/assets/css/ledpanel.css">

<!-- for battery panel -->
<link rel="stylesheet" type="text/css" href="../assets/resources/batterypanel/assets/css/battery.css">

<style>
	div#radio-auto {
		color: white;
		display: block;
		float: right;
		margin-bottom: 10px;
		padding-right: 10px;
		font-weight: 300;
	}

	div#radio-auto input {
		display: inline-block;
		margin-right: 15px;
	}

    #scrollBtn {
		display: none;
		position: fixed;
		bottom: 20px;
		right: 30px;
		z-index: 99;
		font-size: 18px;
		border: none;
		outline: none;
		background-color: red;
		color: white;
		cursor: pointer;
		padding: 15px;
		border-radius: 5px;
		border-radius: 50%;
		width: 50px;
		height: 50px;
    }

    #scrollBtn:before {
		margin: 0;
		padding: 0;
		font-weight: 700;
		line-height: 0.2em;
    }

    #scrollBtn:hover {
		background-color: #555;
}

    html {
		scroll-behavior: smooth;
    }
</style>
</head>
<body>

	<div id="loader">
		<div class="battery-loader">
			<span class="battery-loader_item"></span>
			<span class="battery-loader_item"></span>
			<span class="battery-loader_item"></span>
		</div>
	</div>


	<button onclick="topFunction()" id="scrollBtn" class="flaticon-up-arrow" title="Go to top"></button>

	<div class="header">
		<div class="credits">
			<h1>Monitoring for Off-grid Solar-Wind Hybrid Energy With Controlling of Direct Current Loads Using Arduino</h1>
			<h2>Proponents</h2>
			<div class="proponents">
				<span>Majorine P. Larracas</span>
				<span>Mark Anthony Ivan S. Mejico</span>
				<span>Catherine A. Matining</span>
			</div>
		</div>
	</div>

	<div class="app-bar">
			<h1>RaspberryPi <span>IoT Dashboard</span></h1>
			<a href="logout.php" class="flaticon-logout btn-logout">log out</a>
		</div>

	<div class="main-content">
		
		<div class="panel-group1">
			<div id="cpanel1">
				<div id="overview" class="panel overview" data-key="overview">
					<div class="panel-header"><h3>Readings Overview</h3></div>
					<div class="panel-control">
						<div class="tab-control">
							<div class="time-control">
								<input type="radio" class="time-ctrl" name="time-ctrl-overview" id="day-overview" checked value="day">
								<label for="day-overview"><span>Day</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-overview" id="week-overview" value="week">
								<label for="week-overview"><span>Week</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-overview" id="month-overview" value="month">
								<label for="month-overview"><span>Month</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-overview" id="year-overview" value="year">
								<label for="year-overview"><span>Year</span></label>
							</div>
						</div>
						<div class="navigation-control">
						</div>
					</div>
					<div class="panel-body"> 
						<div class="numeric-group"> 
						</div>
						<div class="chart">
							<div class="chart-container" style="height: 370px; margin: 0px auto;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="panel-group2">
			<div id="cpanel2">
				<div id="env_readings" class="panel trends" data-key="ESN001">
					<div class="panel-header"><h3>Environment Sensor Node</h3></div>
					<div class="panel-control">
						<div class="tab-control">
							<div class="time-control">
								<input type="radio" class="time-ctrl" name="time-ctrl-environment" id="day-environment" checked value="day" >
								<label for="day-environment"><span>Day</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-environment" id="week-environment" value="week">
								<label for="week-environment"><span>Week</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-environment" id="month-environment" value="month">
								<label for="month-environment"><span>Month</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-environment" id="year-environment" value="year">
								<label for="year-environment"><span>Year</span></label>
							</div>
							<div class="value-control">
								<input type="radio" class="value-ctrl" name="value-ctrl-environment" id="all-environment" value="all" checked>
								<label for="all-environment" class="tooltip"><span class="tooltiptext">all units</span><span class="flaticon-asterisk-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-environment" id="insolation-environment" value="solar_insolation">
								<label for="insolation-environment" class="tooltip"><span class="tooltiptext">solar insolation</span><span class="flaticon-sun-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-environment" id="windspeed-environment" value="wind_speed">
								<label for="windspeed-environment" class="tooltip"><span class="tooltiptext">wind speed</span><span class="flaticon-wind-1"></span></label>
							</div>
						</div>
						<div class="navigation-control">
							
						</div>
					</div>
					<div class="panel-body">
			
						<div class="numeric-group">
						</div>
						<div class="chart">
							<div class="chart-container" style="height: 370px; margin: 0px auto;"></div>
						</div>
					</div>
				</div>
			</div>
			<div id="cpanel3">
				<div id="load_readings" class="panel trends" data-key="PSN001">
					<div class="panel-header"><h3>Electrical Sensor Node (Load Consumption)</h3></div>
					<div class="panel-control">
						<div class="tab-control">
							<div class="time-control">
								<input type="radio" class="time-ctrl" name="time-ctrl-ac_electrical" id="day-ac_electrical" checked value="day">
								<label for="day-ac_electrical"><span>Day</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-ac_electrical" id="week-ac_electrical" value="week">
								<label for="week-ac_electrical"><span>Week</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-ac_electrical" id="month-ac_electrical" value="month">
								<label for="month-ac_electrical"><span>Month</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-ac_electrical" id="year-ac_electrical" value="year">
								<label for="year-ac_electrical"><span>Year</span></label>
							</div>

							<div class="value-control">
								<input type="radio" class="value-ctrl" name="value-ctrl-ac_electrical" id="all-ac_electrical" value="all" checked>
								<label for="all-ac_electrical" class="tooltip"><span class="tooltiptext">all units</span><span class="flaticon-asterisk-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-ac_electrical" id="voltage-ac_electrical" value="voltage">
								<label for="voltage-ac_electrical" class="tooltip" ><span class="tooltiptext">voltage</span><span class="flaticon-high-voltage-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-ac_electrical" id="current-ac_electrical" value="current">
								<label for="current-ac_electrical" class="tooltip"><span class="tooltiptext">current</span><span class="flaticon-letter-a"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-ac_electrical" id="power-ac_electrical" value="power">
								<label for="power-ac_electrical" class="tooltip"><span class="tooltiptext">power</span><span class="flaticon-no-plug"></span></label>
							</div>
						</div>
						<div class="navigation-control">
						</div>
					</div>
					<div class="panel-body">
						<div class="numeric-group">
						</div>
						<div class="chart">
							<div class="chart-container" style="height: 370px; margin: 0px auto;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="panel-group3">
			<div id="cpanel4">
				<div id="wind_readings" class="panel trends" data-key="PSN002">
					<div class="panel-header"><h3>Electrical Sensor Node (Wind Turbine Power Generation)</h3></div>
					<div class="panel-control">
						<div class="tab-control">
							<div class="time-control">
								<input type="radio" class="time-ctrl" name="time-ctrl-turbine_electrical" id="day-turbine_electrical" checked value="day">
								<label for="day-turbine_electrical"><span>Day</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-turbine_electrical" id="week-turbine_electrical" value="week">
								<label for="week-turbine_electrical"><span>Week</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-turbine_electrical" id="month-turbine_electrical" value="month">
								<label for="month-turbine_electrical"><span>Month</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-turbine_electrical" id="year-turbine_electrical" value="year">
								<label for="year-turbine_electrical"><span>Year</span></label>	
							</div>
							<div class="value-control">
								<input type="radio" class="value-ctrl" name="value-ctrl-turbine_electrical" id="all-turbine_electrical" value="all" checked>
								<label for="all-turbine_electrical" class="tooltip"><span class="tooltiptext">all units</span><span class="flaticon-asterisk-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-turbine_electrical" id="voltage-turbine_electrical" value="voltage">
								<label for="voltage-turbine_electrical" class="tooltip"><span class="tooltiptext">voltage</span><span class="flaticon-high-voltage-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-turbine_electrical" id="current-turbine_electrical" value="current">
								<label for="current-turbine_electrical" class="tooltip"><span class="tooltiptext">current</span><span class="flaticon-letter-a"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-turbine_electrical" id="power-turbine_electrical" value="power">
								<label for="power-turbine_electrical" class="tooltip"><span class="tooltiptext">power</span><span class="flaticon-no-plug"></span></label>
							</div>
						</div>
						<div class="navigation-control">
						</div>
					</div>
					<div class="panel-body">
						<div class="numeric-group">
						</div>
						<div class="chart">
							<div class="chart-container" style="height: 370px; margin: 0px auto;"></div>
						</div>
					</div>
				</div>
			</div>
			<div id="cpanel5">
				<div id="solar_readings" class="panel trends" data-key="PSN003">
					<div class="panel-header"><h3>Electrical Sensor Node (Solar Panel Power Generation)</h3></div>
					<div class="panel-control">
						<div class="tab-control">
							<div class="time-control">
								<input type="radio" class="time-ctrl" name="time-ctrl-solar_electrical" id="day-solar_electrical" checked value="day">
								<label for="day-solar_electrical"><span>Day</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-solar_electrical" id="week-solar_electrical" value="week">
								<label for="week-solar_electrical"><span>Week</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-solar_electrical" id="month-solar_electrical" value="month">
								<label for="month-solar_electrical"><span>Month</span></label>
								<input type="radio" class="time-ctrl" name="time-ctrl-solar_electrical" id="year-solar_electrical" value="year">
								<label for="year-solar_electrical"><span>Year</span></label>
							</div>
							<div class="value-control">
								<input type="radio" class="value-ctrl" name="value-ctrl-solar_electrical" id="all-solar_electrical" value="all" checked>
								<label for="all-solar_electrical" class="tooltip"><span class="tooltiptext">all units</span><span class="flaticon-asterisk-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-solar_electrical" id="voltage-solar_electrical" value="voltage">
								<label for="voltage-solar_electrical" class="tooltip"><span class="tooltiptext">voltage</span><span class="flaticon-high-voltage-1"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-solar_electrical" id="current-solar_electrical" value="current">
								<label for="current-solar_electrical" class="tooltip"><span class="tooltiptext">current</span><span class="flaticon-letter-a"></span></label>
								<input type="radio" class="value-ctrl" name="value-ctrl-solar_electrical" id="power-solar_electrical" value="power">
								<label for="power-solar_electrical" class="tooltip"><span class="tooltiptext">power</span><span class="flaticon-no-plug"></span></label>
							</div>
						</div>
						<div class="navigation-control">
						</div>
					</div>
					<div class="panel-body">
						<div class="numeric-group">
						</div>
						<div class="chart">
							<div class="chart-container" style="height: 370px; margin: 0px auto;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="panel-group4">
			<div id = "battery-status" class="panel battery-status">
				<div class="panel-header"><h3>Battery Charge Status</h3></div>
				<div class="panel-body">
					<div class="battery-panel" id="bat-container"></div>
				</div>
			</div>
			<div id = "load-prioritization" class="panel">
				<div class="panel-header"><h3>Load Prioritization</h2></div>
				<div class="panel-body">
					<!-- TODO: add AJAX request for radio button change event -->
					<!-- TODO: generated these with javascript -->
					<div id="radio-auto">
						<label for="setmanual">Manual</label>
						<input type="radio" class="prio-radio" name="priomode" id="setmanual" value="manual" checked>
						<label for="setauto">Automatic</label>
						<input type="radio" class="prio-radio" name="priomode" id="setauto" value="auto">
					</div>

					<div class="battery-panel">
						<div style="padding: 10px;" id="asf23fsd"></div>
					</div>
				</div>
			</div>
			<div id = "relay-status" class="panel relay-status">
				<div class="panel-header"><h3>Relay Status</h3></div>
				<div class="panel-body">
					<div id="indicators-panel"></div>
				</div>
			</div>
		</div>

		</div>
		<div class="footer">
		</div>
		<script src="http://192.168.254.10:3000/socket.io/socket.io.js"></script>
		<script src="../assets/js/dateformatter.js"></script>
		<script src="../assets/js/visualization.js"></script>
		<script src="../assets/js/pikayear.js"></script>
		<script src="../assets/resources/pikaday/js/moment.min.js"></script>
		<script src="../assets/resources/canvasjs/canvasjs.min.js"></script>
		<script src="../assets/resources/pikaday/js/pikaday.js"></script>
		<script src="../assets/resources/pikamonth/js/pikamonth.js"></script>
		<script src="../assets/resources/priotable/assets/js/priotable.js"></script>
		<script src="../assets/resources/ledpanel/assets/js/ledpanel.js"></script>
		<script src="../assets/resources/batterypanel/assets/js/batterypanel.js"></script>
		<script src="../assets/js/core/dist/bundle.js"></script>
	
		<script>
			var node_config = {
				'esn001': 'environment',
				'psn001': 'load',
				'psn002': 'wind',
				'psn003': 'solar',
			};

			window.onload = function() {
				setTimeout(function() {
					document.getElementsByTagName('body')[0].className= 'loaded';	
				}, 2000);
			} 

			var mybutton = document.getElementById("scrollBtn");
			window.onscroll = function() {scrollFunction()};
			function scrollFunction() {
				if (document.body.scrollTop > 1500 || document.documentElement.scrollTop > 1500) {
					mybutton.style.display = "block";
				} else {
					mybutton.style.display = "none";
				}
			}

			function topFunction() {
				document.body.scrollTop = 0;
				document.documentElement.scrollTop = 0;
			}

			var ledpanel = new LedPanel({
				container: document.getElementById('indicators-panel')
			});

			var ptable = new Priotable({
				container: document.getElementById('asf23fsd')
			});

			var batpanel = new BatteryPanel({
				container: document.getElementById('bat-container')
			})
		</script>
	</body>
</html>
