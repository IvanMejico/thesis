import { ajax } from 'rxjs/ajax';
import { fromEvent, throwError } from 'rxjs';
import { pluck,filter,switchMap,map } from 'rxjs/operators';
import ioClient from 'socket.io-client';

(function (root, factory) {
	'use strict';

	root.Panel = factory();
})(window, function () {
	'use strict';

	const access_token = "5zdZNDGxtkbn5eS";
			
	var document = window.document,

	sto = window.setTimeout,

	hasClass = function (el, cn) {
		return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
	},

	last = function (arr) {
		if (arr instanceof Array && arr.length>0)
			return arr[arr.length - 1];
	},

	generateRandomId = function (length) {
		return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
	},

	extend = function(to, from, overwrite) {
		var prop, hasProp;
		for (prop in from) {
			hasProp = to[prop] !== undefined;
			if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
				if (isDate(from[prop])) {
					if (overwrite) {
							to[prop] = new Date(from[prop].getTime());
					}
				}
				else if (isArray(from[prop])) {
					if (overwrite) {
							to[prop] = from[prop].slice(0);
					}
				} else {
					to[prop] = extend({}, from[prop], overwrite);
				}
			} else if (overwrite || !hasProp) {
				to[prop] = from[prop];
			}
		}
		return to;
	},

	renderField = function(isEditable=true) {
		var field = document.createElement('input');
		field.type = 'text';
		field.id = `datepicker-${generateRandomId(6)}`;
		field.readOnly = !isEditable;

		return field;
	},

	renderTrigger = function() {
		var trigger = document.createElement('button');
		trigger.className = 'flaticon-calendar';
		trigger.id = `datepicker-button-${generateRandomId(6)}`;

		return trigger;
	},
	
	suffix = {
		voltage: 'V',
		current: 'A',
		power: 'W',
		wind_speed: 'm/s<sup>2</sup>',
		solar_insolation: 'W/m<sup>2</sup>',
		solar_power: 'W',
		turbine_power: 'W',
		load_power: 'W'
	
	},
	
	defaults = {
		data_length: 100   
	},

	chartParams = {
		day: {
			chartInterval: 1,
			chartIntervalType: "hour",
			chartType: "area",
			xValueFormat: "HH:mm"
		},
		week: {
			chartInterval: 1,
			chartIntervalType: "day",
			chartType: "area",
			xValueFormat: "DDDD"
		},
		month: {
			chartInterval: 1,
			chartIntervalType: "day",
			chartType: "area",
			xValueFormat: "DD"
		},
		year: {
			chartInterval: 1,
			chartIntervalType: "month",
			chartType: "area",
			xValueFormat: "MMMM"
		}
	},


	ChartPanel = function(options) {
		var self = this,
			opts = self.config(options); 

		self.hasExceededScope = function(timestamp) {
			var res,
					selectedTs = self.state.reading_date,
					day = selectedTs.getDay();
			switch(self.state.reading_scope) {
				case 'day':
					res = timestamp.getDay() !== selectedTs.getDay();
					break;
				case 'week':
					var d1 = 0 - day, // offset from sunday
					sundayDate = new Date(selectedTs.getTime() + (d1 * 24 * 60 * 60 * 1000)),
					d2 = 6 - day, // offset from saturday
					saturdayDate = new Date(selectedTs.getTime() + (d2 * 24 * 60 * 60 * 1000));
					res = (timestamp < sundayDate || timestamp > saturdayDate);
					break; 
				case 'month':
					res = selectedTs.getMonth() !== timestamp.getMonth();
					break;
				case 'year':
					res = selectedTs.getFullYear() !== timestamp.getFullYear();
					break;
			}
			return res; 
		};

		self.refreshNumericalDisplays = function (dataArr) {
			self.hideAllNumericals();
			var d = last(dataArr);
			if (typeof d !== 'object') return;
			for (let key in d) {
				let value = d[key];
				self.writeNumerical(key, value);
			}
		};

		self.hideAllNumericals = function () {
			var numbers = opts.container.querySelectorAll('.numeric-group span');
			numbers.forEach(function (el) {
					el.parentElement.style.display = 'none';
			});
		};

		self.writeNumerical = function (key, value) {
			var el = opts.container.querySelector('span.numeric-' + key);
			if (!el) return;
			el.parentElement.style.display = 'block';
			el.innerHTML = value !== null ? value.toFixed(2) : '0.00';
			el.innerHTML += suffix[key];
		};

		self.getSelectedTimeCtrl = function() {
			let selected = null,
				tabs = opts.container.querySelectorAll('div.time-control > input');
			if (tabs.length === 0) return;
			tabs.forEach((tab) => {
				if(tab.checked) selected = tab.value;
			});

			return selected;
		};

		self.getSelectedValueCtrl = function() {
			let selected = null,
				tabs = opts.container.querySelectorAll('div.value-control > input');
			if (tabs.length === 0) return;
			tabs.forEach((tab) => {
				if(tab.checked) selected = tab.value;
			});

			return selected;
		};
	 
		self.createTabObservable = function (callback) {
			var observable$ = fromEvent(opts.container.querySelector('.tab-control'), 'change').pipe(
				map((e) => {
					var target = e.target || e.srcElement;
					if (!target) return;
					if (hasClass(target, 'time-ctrl')) {
							self.state.reading_scope = target.value;
					}
					if (hasClass(target, 'value-ctrl')) {
							self.state.reading_unit = target.value;
					}
					
					return target.value;
				}),
				filter(key => key !== ''),
				switchMap((key) => {
						if (key) return callback(key);
				})
			);

			return observable$;
		};

		self.isLive = function() {
			return self.state.timectrl == 'live';
		};

		self.getChartContainer = function () {
			return opts.container.querySelector('.chart-container');
		}; 

		self.buildFeedRequestURL = function() {
			var url = new URL("http://localhost/iotdashboard/requests/requests.php"),
					formatter = new DateStringFormatter(),
					format = "YYYY-MM-DD",
					isWeek = self.state.reading_scope === 'week',
					dateStr = isWeek ? formatter.getWeekString(this.state.reading_date, format, "_") : formatter.getDateString(this.state.reading_date, format); 
			url.searchParams.append('node_id', opts.node_id);
			url.searchParams.append('data_length', opts.data_length);
			url.searchParams.append('unit', self.state.reading_unit || 'all');
			url.searchParams.append('scope', self.state.reading_scope || 'day');
			url.searchParams.append('date', dateStr);
			url.searchParams.append('access_token', access_token);

			console.log(url.href);

			return url;
		};

		self.renderPicker = function (container) {
			container.innerHTML = "";
			if(!container || self.state.timectrl == "live") return;
			var trigger = renderTrigger(),
					field = renderField(false),
					picker = self.picker;
			if(picker instanceof Pikaday || picker instanceof Pikamonth || picker instanceof Pikayear)
						self.picker.destroy(); // TODO: This feature is not added to Pikamonth yet. Have to add it later.  
			container.style.display = "grid";
			container.style.gridTemplateColumns = "8fr 1fr";
			container.appendChild(field);
			container.appendChild(trigger);
			
			self.picker = self.buildPickerObject(field,trigger);
		};
		
		self.buildPickerObject = function(field, trigger) {
			switch(self.state.reading_scope) {
				case 'day':
						return self.buildDatePickerObject(field,trigger);
				case 'week':
						return self.buildDatePickerObject(field,trigger);
				case 'month':
						return self.buildMonthPickerObject(field,trigger);
				case 'year':
						return self.buildYearPickerObject(field,trigger); // TODO: This hasn't been created yet.
			}
		};

		self.buildDatePickerObject = function(field, trigger) {
			let isWeek = self.state.reading_scope == "week"; 
			return new Pikaday({
				field: field,
				trigger: trigger,
				theme: 'dark-theme',
				position: 'bottom-right',
				showWeekNumber: true,
				firstDay: 0,
				pickWholeWeek: isWeek,
				onSelect: function (date) {
					var f = new DateStringFormatter(),
							format = "ll";
					field.value = isWeek ? f.getWeekString(date, format, " - ") : f.getDateString(date, format);
					self.state.reading_date = date;
					var url = self.buildFeedRequestURL(),
							obs$ = ajax(url.href).pipe(map(resp => resp));
					obs$.subscribe((ajaxObservable) => {
						// console.log('AJAX response (picker):', ajaxObservable.response);
						self.visualization.drawChart(ajaxObservable.response);
						self.refreshNumericalDisplays(ajaxObservable.response);
					});
				}
			});
		};

		self.buildMonthPickerObject = function(field, trigger) {
			return new Pikamonth({
				field: field,
				trigger: trigger,
				position: 'bottom right',
				onSelect: function (obj) {
					var date = new Date(`${obj.year}-${obj.month+1}-01`);
					self.state.reading_date = date;
					var url = self.buildFeedRequestURL(),
						obs$ = ajax(url.href).pipe(map(resp => resp));
					obs$.subscribe((ajaxObservable) => {
						self.visualization.drawChart(ajaxObservable.response);
						self.refreshNumericalDisplays(ajaxObservable.response);
					});
				}
			});
		};

		self.buildYearPickerObject = function(field, trigger) {
			console.log('building year picker');
		};

		self.obs$ = self.createTabObservable((key) => {
			return ajax(self.buildFeedRequestURL().href)
				.pipe(map(resp => resp));
		});
		self.obs$.subscribe((ajaxObservable) => {
			let data = ajaxObservable.response ;
			console.log("response data", data);
			console.log('STATE: ',self.state);
			self.visualization.display = chartParams[self.state.reading_scope];
			self.visualization.drawChart(data);
			self.refreshNumericalDisplays(data);
			self.renderPicker(opts.container.querySelector('.navigation-control'));
		}); 

		// initialize state values
		self.state = {
			reading_date: new Date('2020-01-01'),
			reading_scope: self.getSelectedTimeCtrl(), 
			reading_unit: self.getSelectedValueCtrl(),
		};

		self.visualization = new Visualization({
			display: chartParams[self.state.reading_scope],
			dataLength: opts.data_length,
			chartContainer: self.getChartContainer(),
			readingType: opts.reading_type
		});

		var socket = io.connect('http://localhost:3000');
		socket.on("new_feed", function(data) { 
			console.log(data); 
			if (self.hasExceededScope(new Date(data.timestamp)) || data.node_id !== opts.node_id) return; 
			if (self.state.reading_unit != "all") { 
				for(const key of Object.keys(data)) {
					if(key !== "node_id" && key !== "timestamp" && key !== self.state.reading_unit)
							delete data[key]; 
				}
			} 

			/********************************
			 * TODO: build url
			 * TODO: render overview chart
			 * TODO: update overview chart
			 ********************************/
			var d = [];
			if (opts.reading_type === "overview") { 
				if (data.power) {
						// updateChart(data.power)
				} 
				if (data.solar_insolation) {
						// updateChart(data.solar_insolation)
				} 
				if (data.wind_speed) {
						// updateChart(data.wind_speed)
				}
			} else { 
					d = Array(data);
			} 
			if(self.visualization.datapoints.length === 0)
				// TODO: reading type check here to determine how to processs feedData
				self.visualization.drawChart(d);
			else
				// TODO: reading type check here to determine how to processs feedData
				self.visualization.updateChart(d);
			self.refreshNumericalDisplays(d);
		}); 

		self.renderPicker(opts.container.querySelector('.navigation-control'));
		
		// Initial feed request
		var url = self.buildFeedRequestURL(),
			xhr = new XMLHttpRequest();
		fetch(url.href,{
			method: 'GET',
			mode: 'same-origin',
			credentials: 'same-origin',
			headers: {
					'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then((feedData) => {
			// console.log(feedData);
			if (opts.reading_type === 'overview') {
				feedData.forEach(function(dataset) {
					self.visualization.pushToChartDatapoints(dataset, false); 
				});
				self.visualization.createChart().renderChart(); 
			} else {
				self.visualization.drawChart(feedData);
			}
			self.refreshNumericalDisplays(feedData);
		});
	};

	ChartPanel.prototype = {
		config: function(options)  {
			if(!this._o)
					this._o = extend({}, defaults, true);
			var opts = extend(this._o, options, true);

			return opts;
		}
	};

	return ChartPanel;
});

new Panel({
	node_id: 'all', 
	reading_type: 'overview',
	container: document.getElementById('cpanel1'),
	data_length: 300000
}); 

new Panel({
    node_id: 'esn001', 
    reading_type: 'environment',
    container: document.getElementById('cpanel2'),
    data_length: 300000
});

new Panel({
    node_id: 'psn001', 
    reading_type: 'load',
    container: document.getElementById('cpanel3'),
    data_length: 300000
});

new Panel({
    node_id: 'psn002', 
    reading_type: 'wind',
    container: document.getElementById('cpanel4'),
    data_length: 300000
});

new Panel({
    node_id: 'psn003', 
    reading_type: 'solar',
    container: document.getElementById('cpanel5'),
    data_length: 300000
});
