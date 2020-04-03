function assignChangeEventHandler(tabs) {
    for(var i=0; i<tabs.length; i++) {
        
        tabs[i].addEventListener('change', function() {              
            var prevTimeCtrl = null;
            var prevValCtrl = null;
            
            var reading;
            var chartType = 'bar';
            var opacity = 0.2; 
            var chartIntervalType = "second"; 
            var chartInterval = 1;
            var xValueFormat = 'h:mm:ss TT';
            var dateString = '';

            // Get the sensor id    
            sensorId = this.parentElement.parentElement.dataset.sensorid;

            clearInterval(window.interval[sensorId]); // Clear interval for chart updates

            if(this.dataset.ctrl == "time") {
                // Updates the selected tab
                if(this !== prevTimeCtrl) {
                    prevTimeCtrl = this;
                }    

                // Get selected time control
                timeControl = this.value;

                // Get the value control
                grpValueCtrl = this.parentElement.nextElementSibling;
                tabs = grpValueCtrl.querySelectorAll("input");
                valueControl = getSelectedValue(tabs);
                
                trigger = this.parentElement.parentElement.nextElementSibling.children[1];
                
                if(this.value == 'live') {
                    /**
                     * Live data configurations
                     */

                    // ### These values are temporary
                    chartIntervalType = "minute";
                    chartInterval = 1;
                    // ###
                    
                    opacity = 0.2;
                    chartType = 'area';
                    
                    trigger.disabled = true;

                } else {
                    /**
                     * Historic data configurations
                     */

                    // ### These values are temporary
                    switch(this.value) {
                        case 'day':
                            chartIntervalType = "hour";
                            chartInterval = 1;
                            xValueFormat = "h:mm:ss TT";
                            buildDayDatePicker(sensorId)
                            dateString =  getDate(picker[sensorId]);
                            chartType = 'area';
                            break;
                        case 'week':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildWeekDatePicker(sensorId);
                            dateString = document.getElementById('datepicker-'+sensorId).value;
                            dateString = parseWeek(dateString);
                            chartType = 'area';
                            break;
                        case 'month':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildDayDatePicker(sensorId)
                            dateString =  getDate(picker[sensorId]);
                            chartType = 'area';
                            break;
                        case 'year':
                            chartIntervalType = "month";
                            chartInterval = 1;
                            xValueFormat = "MMMM";
                            buildDayDatePicker(sensorId)
                            dateString =  getDate(picker[sensorId]);
                            chartType = 'area';
                            break;
                    }
                    // ###
                    
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
                     * Live data configurations
                     */

                    // ### These values are temporary
                    chartIntervalType = "minute";
                    chartInterval = 1;
                    // ###
                    
                    opacity = 0.2;
                    chartType = 'area';
                } else {
                    /**
                     * Historic data configurations
                     */

                    // ### These values are temporary
                    switch(timeControl) {
                        case 'day':
                            chartIntervalType = "hour";
                            chartInterval = 1;
                            xValueFormat = "h:mm:ss TT";
                            buildDayDatePicker(sensorId)
                            dateString =  getDate(picker[sensorId]);
                            chartType = 'area';
                            break;
                        case 'week':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildWeekDatePicker(sensorId);
                            dateString = document.getElementById('datepicker-'+sensorId).value;
                            dateString = parseWeek(dateString);
                            chartType = 'area';
                            break;
                        case 'month':
                            chartIntervalType = "day";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildDayDatePicker(sensorId)
                            dateString =  getDate(picker[sensorId]);
                            chartType = 'area';
                            break;
                        case 'year':
                            chartIntervalType = "month";
                            chartInterval = 1;
                            xValueFormat = "DD MMMM YYYY";
                            buildDayDatePicker(sensorId)
                            dateString =  getDate(picker[sensorId]);
                            chartType = 'area';
                            break;
                    }
                    // ###
                    
                    opacity = 0.2;
                }
            }


            // Render chart
            reading = new SensorReading(
                sensorId, 
                valueControl, 
                timeControl, 
                dateString
            );
            
            renderChart(
                reading, 
                chartType, 
                opacity, 
                chartIntervalType, 
                chartInterval,
                xValueFormat
            );


            // If time control is 'live',reassign interval to chart update
            if(timeControl == 'live') {
                interval[sensorId] = setInterval(function(){
                    updateChart(reading)
                }, updateInterval);
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