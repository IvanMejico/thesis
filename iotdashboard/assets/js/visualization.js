class Visualization {
	constructor(options) {
		this.dataLength = options.dataLength || 50;
		this.chartContainer = options.chartContainer || null;
		this.display = options.display;
		this.readingType = options.readingType;
		this.datapoints = {}; 
	}

	getDateTimeDifference(earlier, later) {
		var diff = later.getTime() - earlier.getTime();
		var msec = diff;
		var inSeconds = msec / 1000;
		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;
		return [{
			hh,
			mm,
			ss
		}, inSeconds];
	}

	_clearDatapoints() {
		for (var datapoint in this.datapoints)
			this.datapoints[datapoint] = [];
	} 

	_getDataLength(data) {
		var length = data.length; 
		if (this.readingType === 'overview' && Array.isArray(data[0])) {
			var lens = Array();
			data.forEach(function(i) {
				lens.push(i.length);
			});
			length = Math.max(...lens);
		}
		return length; 
	}

	drawChart(data) {
		if(this._getDataLength(data) > 0) {
			if (this.readingType === 'overview' && Array.isArray(data[0])) { 
				var isReset = true;
				data.forEach((d) => {
					this.pushToChartDatapoints(d, isReset);
					if (isReset) isReset = false;
				});
			} else { 
				this.pushToChartDatapoints(data, true);
			}
			this.createChart().renderChart();
		} else {
			this.showNoDataMessage();
		}
	}

	updateChart(data) {
		if(this._getDataLength(data) > 0) {
			this.pushToChartDatapoints(data, false);
			try {
				this.renderChart();
			} catch(err) {
				this.createChart();
			}
		} else {
			this.showNoDataMessage();
		}
	}

	destroyChart() {
		if(!this.chart) return; this.chart.destroy();
	}

	pushToChartDatapoints(datasetArr, isReset=false) {
		if (typeof(isReset) != 'boolean')
			throw new Error("isReset should be boolean");

		if (isReset) this._clearDatapoints(); 
		
		datasetArr.forEach((item) => {
			let timeStamp = new Date(item.timestamp); 
			delete item.timestamp;

			for (let [key,value] of Object.entries(item)) { 
				if (key == 'node_id') continue; 

				if (this.readingType == "overview" && key == 'power')
					key = node_config[item.node_id] + '_' + key; 

				if (!this.datapoints[key])
					this.datapoints[key] = Array(); 
				this.datapoints[key].push({
					x: new Date(timeStamp),
					y: value === null ? null : parseFloat(value)
				});
			}
			if (this.hasExeededMaxAllowedLength() && typeof x === "number")
				this.shiftDatapoints(x); 
		});
	}

	hasExeededMaxAllowedLength() {
		let lengthArr = [], currentMaxLen;
		for(let readingItem of Object.values(this.datapoints))
			lengthArr.push(readingItem .length);
		currentMaxLen = Math.max.apply(null, lengthArr);

		return currentMaxLen > this.dataLength ? currentMaxLen-this.dataLength : false; 
	}

	shiftDatapoints(n) {
		for (let unit in this.datapoints)
			this.datapoints[unit].splice(0, n);
	}

	createChart() {
		this.chart = new CanvasJS.Chart(this.chartContainer, {
			zoomEnabled: true,
			fontColor: "#fff",
			backgroundColor: "#1f1e1b",
			animationEnabled: true,
			theme: "light2",
			legend: {
					fontColor: "#fff",
			},
			toolTip: {
				shared: true,
				fontColor: 'white',
				borderColor: 'blue',
				backgroundColor: 'black',
				contentFormatter: function(e) {
					var arr = [];
					arr.push(moment(e.entries[0].dataPoint.x).format("llll")); 
					for (let key in e.entries)
						arr.push(e.entries[key].dataSeries.name + ": " + e.entries[key].dataPoint.y); 
					return arr.join("<br>"); 
				}
			},
			axisX: {
				// title: 'Time',
				gridThickness: 1,
				gridColor: "#424a44",
				interval: this.display.chartInterval,
				intervalType: this.display.chartIntervalType,
				valueFormatString: this.display.xValueFormat,
				labelAngle: 0,
				labelFontSize: 11,
				labelFontColor: "#a5abb5",
				crosshair: {
					enabled: true,
					color: "#15a380",
					labelFontColor: "#F8F8F8",
					snapToDataPoint: false
				}
			}, 
			axisY: {
				// title: 'PIV',
				includeZero: false,
				gridThickness: 1,
				gridColor: "#424a44",
				labelFontColor: "#fff",
				crosshair: {
					enabled: true,
					color: "#15a380",
					labelFontColor: "#F8F8F8",
					snapToDataPoint: false
				},
				logarithmic: true
			},

			data: [
				// POWER
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Power",
					fillOpacity: this.display.fillOpacity,
					color: "#05a4ee",
					lineColor: "#05a4ee",
					markerColor: "#05a4ee",
					markerSize: 0,
					dataPoints: this.datapoints.power
				}, 
				// VOLTAGE
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Voltage",
					fillOpacity: this.display.fillOpacity,
					color: "#ec0b0b",
					lineColor: "#ec0b0b",
					markerColor: "#ec0b0b",
					markerSize: 0,
					dataPoints: this.datapoints.voltage
				}, 
				// CURRENT
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Current",
					fillOpacity: this.display.fillOpacity,
					color: "#007c1f",
					lineColor: "#007c1f",
					markerColor: "#007c1f",
					markerSize: 0,
					dataPoints: this.datapoints.current
				}, 
				// WIND SPEED
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Wind Speed",
					fillOpacity: this.display.fillOpacity,
					color: "#a80cad",
					lineColor: "#a80cad",
					markerColor: "#a80cad",
					markerSize: 0,
					dataPoints: this.datapoints.wind_speed
				}, 
				// SOLAR INSOLATION
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Solar Insolation",
					fillOpacity: this.display.fillOpacity,
					color: "#c4a704",
					lineColor: "#c4a704",
					markerColor: "#c4a704",
					markerSize: 0,
					dataPoints: this.datapoints.solar_insolation
				}, 
				// Solar Power
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Solar Power",
					fillOpacity: this.display.fillOpacity,
					color: "#38ff00",
					lineColor: "#38ff00",
					markerColor: "#38ff00",
					markerSize: 0,
					dataPoints: this.datapoints.solar_power
				}, 
				// Wind Power
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Wind Power",
					fillOpacity: this.display.fillOpacity,
					color: "#e8073c",
					lineColor: "#e8073c",
					markerColor: "#e8073c",
					markerSize: 0,
					dataPoints: this.datapoints.wind_power
				}, 
				// Load Consumption
				{
					type: this.display.chartType,
					lineThickness: 1,
					nullDataLineDashType: "dot",
					xValueType: "dateTime",
					xValueFormatString: "hh:mm:ss TT",
					showInLegend: true,
					name: "Load Consumption",
					fillOpacity: this.display.fillOpacity,
					color: "#0004ff",
					lineColor: "#0004ff",
					markerColor: "#0004ff",
					markerSize: 0,
					dataPoints: this.datapoints.load_power
				}
			]
		});
		return this; 
	}

	renderChart() {
		this.chart.render();
		return this;
	}

	showNoDataMessage() {
		this.destroyChart();
		if(this.chartContainer.querySelector(".no-data")) return;
		var div = document.createElement('div'),
				icon = document.createElement('span'),
				text = document.createElement('span');
		div.classList.add('no-data');
		icon.classList.add('no-data-icon', 'flaticon-report');
		text.classList.add('no-data-text');
		text.innerText = 'No data found!';
		div.appendChild(icon);
		div.appendChild(text);
		this.chartContainer.appendChild(div);
	}
}
