// TODO: reuse assignChangeEventHandler (Make it more flexible)
// TODO: Change dataset.sensorid to dataset.key

function assignChangeEventHandler(tabs) {
    for(var i=0; i<tabs.length; i++) {
        
        tabs[i].addEventListener('change', function() {              
            var prevTimeCtrl = null;
            var prevValCtrl = null;
            
            // Default/temporary values
            var reading;
            var chartType = 'line';
            var opacity = 0.2; 
            var chartIntervalType = "second"; 
            var chartInterval = 1;
            var xValueFormat = 'h:mm TT';
            var dateString = '';

            // Get the sensor id    
            key = this.parentElement.parentElement.parentElement.parentElement.dataset.key;

            clearInterval(window.interval[key]); // Clear interval for chart updates

            if(this.dataset.ctrl == "time") {
                // Updates the selected tab
                if(this !== prevTimeCtrl) {
                    prevTimeCtrl = this;
                }    

                // Get selected time control
                var timeControl = this.value;

                // Get the value control
                var grpValueCtrl = this.parentElement.nextElementSibling;
                if(grpValueCtrl) {
                    var tabs = grpValueCtrl.querySelectorAll("input");
                    var valueControl = getSelectedValue(tabs);
                } else {
                    valueControl = '';
                }
                
                trigger = this.parentElement.parentElement.nextElementSibling.children[1];
                if(this.value == 'live') {
                    /**
                     * Live data parameters
                     */
                    chartIntervalType = key=='overview' ? "hour" : "minute";
                    chartInterval = 1;
                    opacity = 0.2;
                    chartType = 'area';
                    trigger.disabled = true;

                } else {
                    /**
                     * Summarized data parameters
                     */
                    switch(this.value) {
                        case 'day':
                            chartIntervalType = "hour";
                            chartInterval = 1;
                            xValueFormat = "h:mm TT";
                            buildDayDatePicker(key)
                            dateString =  getDate(picker[key]);
                            chartType = 'area';
                            break;
                        case 'week':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildWeekDatePicker(key);
                            dateString = document.getElementById('datepicker-'+key).value;
                            dateString = parseWeek(dateString);
                            chartType = 'area';
                            break;
                        case 'month':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildDayDatePicker(key)
                            dateString =  getDate(picker[key]);
                            chartType = 'area';
                            break;
                        case 'year':
                            chartIntervalType = "month";
                            chartInterval = 1;
                            xValueFormat = "MMMM";
                            buildDayDatePicker(key)
                            dateString =  getDate(picker[key]);
                            chartType = 'area';
                            break;
                    }
                    
                    opacity = 0.2;
                    trigger.disabled = false;                   
                }

            } else if (this.dataset.ctrl == "value") {
                if(this !== prevValCtrl) {
                    prevValCtrl = this;
                }

                // Get selected time control
                grpTimeControl = this.parentElement.previousElementSibling;
                tabs = grpTimeControl.querySelectorAll("input");
                timeControl = getSelectedValue(tabs);

                // Get the selected value control
                valueControl = this.value;
                
                if(timeControl == 'live') {
                    /**
                     * Live data parameters
                     */
                    chartIntervalType = "minute";
                    chartInterval = 1;
                    opacity = 0.2;
                    chartType = 'area';
                } else {
                    /**
                     * Summarized data parameters
                     */
                    switch(timeControl) {
                        case 'day':
                            chartIntervalType = "hour";
                            chartInterval = 1;
                            xValueFormat = "h:mm:ss TT";
                            buildDayDatePicker(key)
                            dateString =  getDate(picker[key]);
                            chartType = 'area';
                            break;
                        case 'week':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildWeekDatePicker(key);
                            dateString = document.getElementById('datepicker-'+key).value;
                            dateString = parseWeek(dateString);
                            chartType = 'area';
                            break;
                        case 'month':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildDayDatePicker(key)
                            dateString =  getDate(picker[key]);
                            chartType = 'area';
                            break;
                        case 'year':
                            chartIntervalType = "month";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildDayDatePicker(key)
                            dateString =  getDate(picker[key]);
                            chartType = 'area';
                            break;
                    }
                    opacity = 0.2;
                }
            }

            // Render chart
            if(valueControl) {
                reading = new SensorReading(
                    key, 
                    valueControl,
                    timeControl, 
                    dateString
                );
                renderTrends(
                    reading, 
                    chartType, 
                    opacity, 
                    chartIntervalType, 
                    chartInterval,
                    xValueFormat
                );
            } else {
                reading = new OverviewReading(
                    key,
                    timeControl,
                    dateString
                );
                renderOverview(
                    reading,
                    chartType,
                    opacity,
                    chartIntervalType,
                    chartInterval,
                    xValueFormat
                );
            }


            // If time control is 'live',reassign interval to chart update
            if(timeControl == 'live') {
                if(key=='overview') {
                    interval[key] = setInterval(function(){
                        updateOverview(reading)
                    }, 1000);
                } else {
                    interval[key] = setInterval(function(){
                        updateTrends(reading)
                    }, updateInterval);
                }
            }
        });
    }
}


// TODO: THESE CODES BELOW CAN BE REFACTORED

// ENVIRONMENT READING CHART
assignChangeEventHandler(document.getElementsByName("time-ctrl-environment"));
assignChangeEventHandler(document.getElementsByName("value-ctrl-environment"));

// LOAD READING CHART
assignChangeEventHandler(document.getElementsByName("time-ctrl-ac_electrical"));
assignChangeEventHandler(document.getElementsByName("value-ctrl-ac_electrical"));

// TURBINE READING CHART
assignChangeEventHandler(document.getElementsByName("time-ctrl-turbine_electrical"));
assignChangeEventHandler(document.getElementsByName("value-ctrl-turbine_electrical"));

// PANEL READING CHART
assignChangeEventHandler(document.getElementsByName("time-ctrl-solar_electrical"));
assignChangeEventHandler(document.getElementsByName("value-ctrl-solar_electrical"));

// OVERVIEW CHART
assignChangeEventHandler(document.getElementsByName("time-ctrl-overview"));