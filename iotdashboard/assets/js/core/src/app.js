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

	isObjectLiteral = function(object) {

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
				else if (Array.isArray(from[prop])) {
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
		wind_power: 'W',
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
			xValueFormat: "HH:mm",
			fillOpacity: 0.1
		},
		week: {
			chartInterval: 1,
			chartIntervalType: "day",
			chartType: "area",
			xValueFormat: "DDDD",
			fillOpacity: 0.1
		},
		month: {
			chartInterval: 1,
			chartIntervalType: "day",
			chartType: "area",
			xValueFormat: "DD",
			fillOpacity: 0.1
		},
		year: {
			chartInterval: 1,
			chartIntervalType: "month",
			chartType: "area",
			xValueFormat: "MMMM",
			fillOpacity: 0.1
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

		self.clearAllNumericals = function () {
			var el = opts.container.querySelector('.numeric-group');
			el.innerHTML = '';
		};

		self.drawNumericalDisplays = function (dataArr) {
			if(dataArr.length === 0) return;
			var container = opts.container.querySelector('.numeric-group'); 

			if (Array.isArray(dataArr[0])) { 
				dataArr.forEach(function(i) {
					self.renderNumbers(container, i);
				});
			} else if(dataArr[0].constructor === Object) { 
				self.renderNumbers(container, dataArr);
			} 
		};

		self.renderNumbers = function (container, array) {
			var d = last(array);
			if (typeof d !== 'object') return; 

			for (let [key, value] of Object.entries(d)) {
				if (key == 'node_id') continue; 
				if (opts.reading_type == 'overview' && key == 'power')
					key = node_config[d.node_id] + '_' + key; 

				var existing = opts.container.querySelector('.numeric-'+key);
				if (existing) {
					existing.innerHTML = value !== null ? value.toFixed(2) : '0.00';
					existing.innerHTML += suffix[key]; 
				} else { 
					var div = document.createElement('div'),
							i = document.createElement('i'),
							span = document.createElement('span');
					
					i.innerText = key.replace('_', ' ');
					span.className = "numeric-" + key;
					span.innerHTML = value !== null ? value.toFixed(2) : '0.00';
					span.innerHTML += suffix[key];
					div.append(i);
					div.append(span); 
					container.append(div); 
				}
			}
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
						self.drawNumericalDisplays(ajaxObservable.response);
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
						self.drawNumericalDisplays(ajaxObservable.response);
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

			var display = Object.create(chartParams[self.state.reading_scope]); 
			if (opts.reading_type === 'overview') {
				display.chartType = 'line'; 
				display.fillOpacity = 1;
			} 
			self.visualization.display = display;
			self.visualization.drawChart(data);
			self.clearAllNumericals();
			self.drawNumericalDisplays(data);
			self.renderPicker(opts.container.querySelector('.navigation-control'));
		}); 

		// initialize state values
		self.state = {
			reading_date: new Date('2020-01-01'),
			reading_scope: self.getSelectedTimeCtrl(), 
			reading_unit: self.getSelectedValueCtrl(),
		}; 

		var display = Object.create(chartParams[self.state.reading_scope]); 
		if (opts.reading_type === 'overview') {
			display.chartType = 'line'; 
			display.fillOpacity = 1;
		} 
		self.visualization = new Visualization({
			display: display,
			dataLength: opts.data_length,
			chartContainer: self.getChartContainer(),
			readingType: opts.reading_type
		}); 

		var socket = io.connect('http://localhost:3000');
		socket.on("new_feed", function(data) { 
			if (self.hasExceededScope(new Date(data.timestamp))) return; 
			if (opts.reading_type !== "overview" && data.node_id !== opts.node_id) return;

			if (opts.reading_type !== 'overview' && self.state.reading_unit != "all") { 
				for(const key of Object.keys(data)) {
					if(key !== "node_id" && key !== "timestamp" && key !== self.state.reading_unit)
							delete data[key]; 
				}
			} 

			if (opts.reading_type === "overview" && data.power) { 
				var d = {},
						type = node_config[data.node_id] + '_power'; 
				d.node_id = data.node_id;
				d.timestamp = data.timestamp;
				d[type] = data.power;
				data = d; 
			} 

			data = [data];

			if(self.visualization.datapoints.length === 0)
				self.visualization.drawChart(data);
			else
				self.visualization.updateChart(data); 
			self.drawNumericalDisplays(data);
		}); 

		self.renderPicker(opts.container.querySelector('.navigation-control'));
		
		// Initial feed request
		var url = self.buildFeedRequestURL(),
				xhr = new XMLHttpRequest();
		fetch(url.href, {
			method: 'GET',
			mode: 'same-origin',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then((feedData) => {
			self.visualization.drawChart(feedData); 
			self.drawNumericalDisplays(feedData);
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

// THESE CAN BE ITERATED
self.overviewPanel = new Panel({
	node_id: 'all', 
	reading_type: 'overview',
	container: document.getElementById('cpanel1'),
	data_length: 300000
}); 

self.envPanel = new Panel({
    node_id: 'esn001', 
    reading_type: 'environment',
    container: document.getElementById('cpanel2'),
    data_length: 300000
});

self.loadPanel = new Panel({
    node_id: 'psn001', 
    reading_type: 'load',
    container: document.getElementById('cpanel3'),
    data_length: 300000
});

self.windPanel = new Panel({
    node_id: 'psn002', 
    reading_type: 'wind',
    container: document.getElementById('cpanel4'),
    data_length: 300000
});

self.solarPanel = new Panel({
    node_id: 'psn003', 
    reading_type: 'solar',
    container: document.getElementById('cpanel5'),
    data_length: 300000
});
