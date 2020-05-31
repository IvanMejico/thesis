const INTERVAL = 3000;

const uiAssign = [{
        sensorId: '00000000',
        panelId: 'overview'
    },
    {
        sensorId: 'ESN001',
        panelId: 'env_readings'
    },
    {
        sensorId: 'PSN001',
        panelId: 'wind_readings'
    },
    {
        sensorId: 'PSN002',
        panelId: 'solar_readings'
    },
    {
        sensorId: 'PSN003',
        panelId: 'load_readings'
    },
];

const suffix = {
    voltage: 'V',
    current: 'A',
    power: 'W',
    wind_speed: 'm/s<sup>2</sup>',
    solar_insolation: 'W/m<sup>2</sup>',
    panel_power: 'W',
    turbine_power: 'W',
    load_power: 'W'

};

const chartParams = {
    live: {
        chartInterval: 1,
        chartIntervalType: "minute",
        chartType: "area",
        xValueFormat: "h:mm TT"
    },
    day: {
        chartInterval: 1,
        chartIntervalType: "hour",
        chartType: "area",
        xValueFormat: "h:mm TT"
    },
    week: {
        chartInterval: 1,
        chartIntervalType: "day",
        chartType: "area",
        xValueFormat: "DD MMMM YYYY"
    },
    month: {
        chartIntervalType: "day",
        chartInterval: 1,
        chartType: "area",
        xValueFormat: "DD"
    },
    year: {
        chartIntervalType: "month",
        chartInterval: 1,
        chartType: "area",
        xValueFormat: "MMMM"
    }
};

/**
 * DECLARE READING OBJECTS
 */

// Helper functions
function PanelSelector(id) {
    this.panel = document.getElementById(id);

    /**
     * Panel
     */
    this.getPanel = function () {
        return this.panel;
    };

    /**
     * Navigation
     */

    this.getNavigationContainer = function () {
        return this.panel.querySelector('.navigation-control');
    };

    /**
     * Tabs
     */

    this.getTimeControlTabs = function () {
        return this.panel.querySelectorAll('.time-control > input');
    };
    this.getValueControlTabs = function () {
        return this.panel.querySelectorAll('.value-control > input');
    };
    this.getSelectedTimeControl = function () {
        var tabs = this.getTimeControlTabs();
        if (tabs.length == 0) return false;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].checked) {
                return tabs[i].value;
            }
        }
    };
    this.getSelectedValueControl = function () {
        var tabs = this.getValueControlTabs();
        if (tabs.length == 0) return false;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].checked) {
                return tabs[i].value;
            }
        }
    };


    /**
     * Chart Container
     */

    this.getChartContainer = function () {
        return this.panel.querySelector('.chart > div');
    };
    this.getNumericDisplay = function (unit) {
        return this.panel.querySelector(`.numeric-group span.numeric-${unit}`).parentElement;
    };


    /**
     * Numeric Displays
     */

    this.showNumericDisplay = function (unit) {
        this.panel.querySelector(`.numeric-group span.numeric-${unit}`).parentElement.style.display = "block";
    };
    this.hideNumericDisplay = function (unit) {
        this.panel.querySelector(`.numeric-group span.numeric-${unit}`).parentElement.style.display = "none";
    };
    this.hideAllNumericDisplays = function () {
        var div = this.panel.querySelectorAll('.numeric-group div');
        div.forEach(function (item) {
            item.style.display = 'none';
        });
    };
    this.updateNumericDisplay = function (unit, value) {
        this.panel.querySelector(`.numeric-group span.numeric-${unit}`).innerHTML = value + suffix[unit];
    };
    this.clearAllToZero = function () {
        var span = this.panel.querySelectorAll('.numeric-group span');
        span.forEach(function (item) {
            item.innerHTML = "0.00";
        });
    };
}


function getDateTimeDifference(earlier, later) {
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


/**
 * This class may be used to dynamically generate panels
 * for for the dashboard UI
 */
class DashboardUI {
    constructor() {

    }
}


class SensorReading {
    constructor(sensorId = '', panelId = '') {
        this.sensorId = sensorId;
        this.panelId = panelId;
        this.datapoints = {
            voltage: [],
            current: [],
            power: [],
            wind_speed: [],
            solar_insolation: [],
            load_power: [],
            turbine_power: [],
            panel_power: []
        };
        this.dataLength = 200;
        this.timeControl = 'live';
        this.valueControl = 'all';
        this.dateString = moment().format('YYYY-MM-DD');
        this.chartContainer = new PanelSelector(panelId).getChartContainer();
    }

    reformatWeekString(weekString) {
        var [str1, str2] = weekString.split('_');
        var date1 = moment(str1).format('ll');
        var date2 = moment(str2).format('ll');
        return ([date1, date2].join(' - '));
    }

    generateWeekStringFromDate(dateObj) {
        var day = dateObj.getDay();
        var d1 = 0 - day;
        var sundayDate = new Date(dateObj.getTime() + (d1 * 24 * 60 * 60 * 1000));
        var d2 = 6 - day;
        var saturdayDate = new Date(dateObj.getTime() + (d2 * 24 * 60 * 60 * 1000));
        var weekString = `${moment(sundayDate).format('YYYY-MM-DD')}_${moment(saturdayDate).format('YYYY-MM-DD')}`;
        return weekString;
    }

    clearAllDatapoints() {
        for (var datapoint in this.datapoints) {
            this.datapoints[datapoint] = [];
        }
    }

    pushValue(reading, unit, timestamp) {
        if (reading[unit]) {
            this.datapoints[unit].push({
                x: new Date(timestamp),
                y: parseFloat(reading[unit].toFixed(2))
            });
        }
    }

    pushDatapoints(datapoints) {
        var readingData = datapoints;
        if (!this.previousDateTime)
            this.previousDateTime = new Date(2012, 0, 1, 0, 0);


        for (let i = 0; i < readingData.length; i++) {
            let currentItem = readingData[i];
            let currentDateTime = new Date(currentItem.timestamp);

            // Skip to next iteration if the gap between the current timestamp and next timestamp is more than allowed time
            if (readingData.length > 1 && this.timeControl === 'live') {
                let thirtySeconds = 30 * 1000; // Maximum time gap allowed to be displayed
                if (i < (readingData.length - 1)) {
                    let nextDateTime = new Date(readingData[i + 1].timestamp);
                    let diffInSeconds = getDateTimeDifference(nextDateTime, currentDateTime)[1];
                    if (diffInSeconds > thirtySeconds) continue;
                }
            }

            if (currentDateTime.getTime() !== this.previousDateTime.getTime()) {
                let bufferName = '';

                /**
                 * I guess there are still coupling issues here because it forces the name of the spans
                 * to be same as the name of the units as assigned in the databse. But this will do for now.
                 * I guess it will suffice when the UI is actually generated dynamically using javascript.
                 */

                let panel = new PanelSelector(this.panelId);
                panel.hideAllNumericDisplays();
                panel.clearAllToZero();

                // console.log(currentItem.readings);

                for (let unit in currentItem.readings) {
                    this.pushValue(currentItem.readings, unit, currentDateTime);
                    this.setNumericDisplay(unit, currentItem.readings[unit].toFixed(2));
                    bufferName = unit;
                }

                this.previousDateTime = currentDateTime;

                if (this.datapoints[bufferName].length > this.dataLength) {
                    for (let unit in this.datapoints) {
                        this.datapoints[unit].shift();
                    }
                }
            }
        }
    }


    sendRequest(httpQuery) {
        // console.log(httpQuery);
        fetch(httpQuery)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    this.hideNoDataMsg();
                    this.pushDatapoints(data);
                    this.renderChart();
                } else if (this.timeControl != 'live') {
                    this.showNoDataMsg();
                }
            });
    }

    /**
     * May probably be implemented to dynamically render panels in the future. This code will assume that the panel
     * already exists for now. (Already rendered via HTML).
     */
    createWidgetContainer() {
        var callback = () => {
            // Create charts and fill it with with data
            this.createChart(chartParams[this.timeControl]).updateChart();
            // Continuously update charts if data is live only right after chart is created
            if (this.timeControl == 'live') this.repeatJob(INTERVAL);
        };

        var panel = new PanelSelector(this.panelId);

        // Assign event handlers to tabs
        var timeCtrlTabs = panel.getTimeControlTabs();
        var valueCtrlTabs = panel.getValueControlTabs();

        timeCtrlTabs.forEach((tab) => {
            tab.addEventListener('change', function (e) {
                this.timeControl = e.target.value;

                // Initialize date string to current date or current week
                if (this.timeControl == 'live' || this.timeControl == 'day') {
                    this.dateString = moment().format('YYYY-MM-DD');
                } else if (this.timeControl == 'week') {
                    this.dateString = this.generateWeekStringFromDate(new Date());
                }

                // Build date, week, month, year selectors
                var navContainer = panel.getNavigationContainer();
                navContainer.innerHTML = '';
                switch (this.timeControl) {
                    case 'live':
                        navContainer.appendChild(this.createDateTimeField(false));
                        break;
                    case 'day':
                    case 'week':
                        navContainer.appendChild(this.createDatePicker());
                        break;
                    case 'month':
                        break;
                    case 'year':
                        break;
                }

                callback();
            }.bind(this));
        }, this);

        valueCtrlTabs.forEach((tab) => {
            tab.addEventListener('change', function (e) {
                this.valueControl = e.target.value;
                callback();
            }.bind(this));
        }, this);

        // Create text field for datetime
        // var dtField = this.createDateTimeField(false);
        // var navContainer = panel.getNavigationContainer();
        // navContainer.innerHTML = '';
        // navContainer.appendChild(dtField);
    }

    createChart(parameters) {
        // Clear jobs before creating and rendering chart objects to avoid weird chart renders
        this.clearJob();
        this.clearAllDatapoints();

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
                shared: true
            },
            axisX: {
                // title: 'Time',
                gridThickness: 1,
                gridColor: "#424a44",
                interval: parameters.chartInterval,
                intervalType: parameters.chartIntervalType,
                valueFormatString: parameters.xValueFormat,
                labelAngle: 0,
                labelFontSize: 12,
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
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Power",
                    fillOpacity: 0.2,
                    color: "#05a4ee",
                    lineColor: "#05a4ee",
                    markerColor: "#05a4ee",
                    markerSize: 0,
                    dataPoints: this.datapoints.power
                },

                // VOLTAGE
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Voltage",
                    fillOpacity: 0.2,
                    color: "#ec0b0b",
                    lineColor: "#ec0b0b",
                    markerColor: "#ec0b0b",
                    markerSize: 0,
                    dataPoints: this.datapoints.voltage
                },

                // CURRENT
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Current",
                    fillOpacity: 0.2,
                    color: "#007c1f",
                    lineColor: "#007c1f",
                    markerColor: "#007c1f",
                    markerSize: 0,
                    dataPoints: this.datapoints.current
                },

                // WIND SPEED
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Wind Speed",
                    fillOpacity: 0.2,
                    color: "#a80cad",
                    lineColor: "#a80cad",
                    markerColor: "#a80cad",
                    markerSize: 0,
                    dataPoints: this.datapoints.wind_speed
                },

                // SOLAR INSOLATION
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Solar Insolation",
                    fillOpacity: 0.2,
                    color: "#c4a704",
                    lineColor: "#c4a704",
                    markerColor: "#c4a704",
                    markerSize: 0,
                    dataPoints: this.datapoints.solar_insolation
                },

                // Average Solar Power
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Solar Power",
                    fillOpacity: 0.2,
                    color: "#38ff00",
                    lineColor: "#38ff00",
                    markerColor: "#38ff00",
                    markerSize: 0,
                    dataPoints: this.datapoints.panel_power
                },

                // Average Wind Power
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Wind Power",
                    fillOpacity: 0.2,
                    color: "#e8073c",
                    lineColor: "#e8073c",
                    markerColor: "#e8073c",
                    markerSize: 0,
                    dataPoints: this.datapoints.turbine_power
                },

                // Average Load Consumption
                {
                    type: parameters.chartType,
                    lineThickness: 1,
                    nullDataLineDashType: "dot",
                    xValueType: "dateTime",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Load Consumption",
                    fillOpacity: 0.2,
                    color: "#0004ff",
                    lineColor: "#0004ff",
                    markerColor: "#0004ff",
                    markerSize: 0,
                    dataPoints: this.datapoints.load_power
                },
            ]
        });
        return this;
    }

    updateChart(count) {
        var length = count || this.dataLength;
        var queryString;
        if (this.sensorId == '00000000') {
            queryString = `getOverview.php?time_control=${this.timeControl}&date=${this.dateString}` +
                `&data_length=${length}`;
        } else {
            queryString = `getTrends.php?sensor_id=${this.sensorId}&data_length=${length}` +
                `&unit=${this.valueControl}&time_control=${this.timeControl}&date=${this.dateString}`;
        }
        this.sendRequest(queryString);
        return this;
    }

    renderChart() {
        this.chart.render();
        return this;
    }

    destroyChart() {
        if (this.chart) this.chart.destroy();
    }

    setNumericDisplay(unit = '', value = 0) {
        var panel = new PanelSelector(this.panelId);
        panel.showNumericDisplay(unit);
        panel.updateNumericDisplay(unit, value);
    }


    hideNoDataMsg() {
        if (this.chartContainer.querySelector('.no-data')) x.remove();
    }

    showNoDataMsg() {
        var div = document.createElement('div');
        div.classList.add('no-data');
        var icon = document.createElement('span');
        icon.classList.add('no-data-icon');
        icon.classList.add('flaticon-report');
        var text = document.createElement('span');
        text.classList.add('no-data-text');
        text.innerText = 'No data found!';
        div.appendChild(icon);
        div.appendChild(text);
        this.chartContainer.appendChild(div);
    }

    repeatJob(interval) {
        if (interval)
            this.job = setInterval(() => {
                this.updateChart(1);
            }, interval);
    }

    clearJob() {
        clearInterval(this.job);
    }

    createMonthPicker() {
        var monthArray = new Array(
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        );
        
    }
    destroyMonthPicker() {}

    createYearPicker() {}
    destroyYearPicker() {}

    createDateTimeField(isEditable = false) {
        var field = document.createElement('input');
        field.type = 'text';
        field.id = `dtField-${this.panelId}`;
        field.readOnly = !isEditable;
        field.value = moment(this.dateString).format('ll');
        return field;
    }


    /**
     * Datepicker
     */

    createDatePicker() {
        var self = this;

        function createField(isEditable = false) {
            var field = document.createElement('input');
            field.type = 'text';
            field.id = `datepicker-${self.panelId}`;
            field.readOnly = !isEditable;
            if (self.timeControl == 'week')
                field.value = self.reformatWeekString(self.dateString);
            else
                field.value = moment(self.dateString).format('ll');
            return field;
        }

        function createTrigger() {
            var trigger = document.createElement('button');
            trigger.className = 'flaticon-calendar';
            trigger.id = `datepicker-button-${self.panelId}`;
            return trigger;
        }


        var datePicker = document.createElement('div');
        var field = createField(false);
        var trigger = createTrigger();
        datePicker.appendChild(field);
        datePicker.appendChild(trigger);
        datePicker.style.display = 'grid';
        datePicker.style.gridTemplateColumns = '8fr 1fr';

        self.picker = new Pikaday({
            field: field,
            trigger: trigger,
            theme: 'dark-theme',
            position: 'bottom-right',
            showWeekNumber: true,
            firstDay: 1,
            pickWholeWeek: self.timeControl === 'week' ? true : false,
            onSelect: function (date) {
                self.clearJob();
                // Set datestring
                if (self.timeControl == 'week') {
                    self.dateString = self.generateWeekStringFromDate(date);
                    field.value = self.reformatWeekString(self.dateString);
                } else {
                    self.dateString = moment(date).format('YYYY-MM-DD');
                    field.value = moment(self.dateString).format('ll');
                }
                // Generate Chart
                self.createChart(chartParams[self.timeControl]).updateChart();
            }
        });
        return datePicker;
    }
}

uiAssign.forEach(function ({
    sensorId,
    panelId
}) {
    var timeControl = new PanelSelector(panelId).getSelectedTimeControl();
    window[panelId] = new SensorReading(sensorId, panelId);
    window[panelId].createWidgetContainer();
    window[panelId].createChart(chartParams[timeControl]).updateChart().repeatJob(INTERVAL);
});