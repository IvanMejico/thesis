function assignChangeEventHandler(tabs) {
    var chartType = 'column';
    var opacity = .4;
    for(var i=0; i<tabs.length; i++) {
        var prevTimeCtrl = null;
        var prevValCtrl = null;
        
        tabs[i].addEventListener('change', function() {  
            // reading = [];
            interval = [];       
            // Get the sensor id    
            sensorId = this.parentElement.parentElement.dataset.sensorid;
            clearInterval(interval[sensorId]); // Clear interval interval defined earlier
            if(this.dataset.ctrl == "time") {
                if(this !== prevTimeCtrl) {
                    prevTimeCtrl = this;
                }    

                // Get selected time control
                timeControl = this.value;

                //  Get the selected value control
                x = this.parentElement.nextElementSibling;
                tabs = x.querySelectorAll("input");
                valueControl = getSelectedValue(tabs);
                // Render chart
                reading[sensorId] = new SensorReading(sensorId, valueControl, timeControl);
                renderChart(reading[sensorId], chartType, opacity);

            } else if (this.dataset.ctrl == "value") {
                if(this !== prevValCtrl) {
                    prevValCtrl = this;
                }

                // Get selected time control
                x = this.parentElement.previousElementSibling;
                tabs = x.querySelectorAll("input");
                timeControl = getSelectedValue(tabs);

                // Get the selected value control
                valueControl = this.value;

                // Render chart
                reading[sensorId] = new SensorReading(sensorId, valueControl, timeControl);
                renderChart(reading[sensorId], chartType, opacity);
                
            }
            
            // If time control is 'live',reassign interval to chart update
            if(timeControl == 'live') {
                interval[sensorId] = setInterval(function(){
                    updateChart(reading[sensorId])
                }, updateInterval);
            }
            // console.log(sensorId);
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