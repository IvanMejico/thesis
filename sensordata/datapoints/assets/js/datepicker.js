// These helper functions will be utilized if destryong the pikaday object holds up
function createWeekDatePicker() {}
function createDayDatePicker() {}

var picker = [];

// But for the mean time, building date picker elements from scratch will do
function buildDayDatePicker(key) {
    let field = document.getElementById('datepicker-'+key);
    let trigger = document.getElementById('datepicker-button-'+key);
    let parent = field.parentElement;
    field.remove();
    trigger.remove();

    field = document.createElement('input');
    field.type = 'text';    
    field.id = 'datepicker-'+key;
    field.readOnly = true;

    trigger = document.createElement('button');
    trigger.classList.add('flaticon-calendar');
    trigger.id = 'datepicker-button-'+key;

    parent.appendChild(field);
    parent.appendChild(trigger);

    // CREATE DATEPICKER OBJECT
    picker[key] = new Pikaday({
        field: field,
        trigger: trigger,
        theme: 'dark-theme',
        position: 'bottom right',
        showWeekNumber: true,
        firstDay: 1,
        pickWholeWeek: false,
        onSelect: function () {
            var key = getSensorId(trigger);
            var xValueFormat;
            var dateString;
            var chartIntervalType ;
            var chartInterval;
            var chartType;
            var opacity;

            valueControl = key!='overview' ? getValueControl(trigger) : null;
            timeControl = getTimeControl(trigger);

            if(timeControl == 'live') {
                /**
                 * Live data configurations
                 */
                xValueFormat = "h:mm TT";
                chartIntervalType = "minute";
                chartInterval = 1;
                chartType = 'area';
                dateString = '';
                opacity = 0.2;
            } else {
                /**
                 * Summarized data configurations
                 */

                switch(timeControl) {
                    case 'day':
                        chartIntervalType = "hour";
                        chartInterval = 1;
                        xValueFormat = "h:mm TT";
                        chartType = 'area';
                        break;
                    case 'month':
                        chartIntervalType = "day";
                        chartInterval = 1;
                        xValueFormat = "DD MMMM YYYY";
                        chartType = 'area';
                        break;
                    case 'year':
                        chartIntervalType = "month";
                        chartInterval = 1;
                        xValueFormat = "MMMM";
                        chartType = 'area';
                        break;
                }
                opacity = 0.2;
            }
            
            field.value = this.getMoment().format('YYYY-MM-DD');
            dateString = field.value;
            clearInterval(window.interval[key]);

            if(key=='overview') {
                readingObj = new OverviewReading(key, timeControl, dateString);
                renderOverview(readingObj, chartType, opacity, chartIntervalType, chartInterval, xValueFormat);
            } else {
                readingObj = new SensorReading(key, valueControl, timeControl, dateString);
                renderTrends(readingObj, chartType, opacity, chartIntervalType, chartInterval, xValueFormat);
            }
        }
    });

    field.value = picker[key].getMoment().format('YYYY-MM-DD');
}   

function buildWeekDatePicker(key) {
    // BUILD THE ELEMENTS
    let field = document.getElementById('datepicker-'+key);
    let trigger = document.getElementById('datepicker-button-'+key);
    let parent = field.parentElement;
    let xValueFormat = "DD MMMM YYYY";
    field.remove();
    trigger.remove();

    field = document.createElement('input');
    field.type = 'text';
    field.id = 'datepicker-'+key;
    field.readOnly = true;

    trigger = document.createElement('button');
    trigger.classList.add('flaticon-calendar');
    trigger.id = 'datepicker-button-'+key;

    parent.appendChild(field);
    parent.appendChild(trigger);

    // ASSIGN DATEPICKER TO ELEMENTS
    picker[key] = new Pikaday({
        field: field,
        trigger: trigger,
        theme: 'dark-theme',
        position: 'bottom right',
        showWeekNumber: true,
        // firstDay: 1,
        pickWholeWeek: true,
        onSelect: function (date) {
            chartIntervalType = "day";
            chartInterval = 1;
            chartType = "area"
            opacity = 0.2;
            
            valueControl = key!='overview' ? getValueControl(trigger) : null;
            timeControl = getTimeControl(trigger);

            var day = date.getDay();
            var days = 0-day;
            var sundayDate = new Date(date.getTime()+(days*24*60*60*1000));
            var days = 6-day
            var saturdayDate = new Date(date.getTime()+(days*24*60*60*1000));
            field.value = parseDate(sundayDate.toLocaleDateString()) + ' - ' + parseDate(saturdayDate.toLocaleDateString());
            dateString = parseWeek(field.value);

            clearInterval(window.interval[key]);
            if(key=='overview') {
                readingObj = new OverviewReading(key, timeControl, dateString);
                renderOverview(readingObj, chartType, opacity, chartIntervalType, chartInterval, xValueFormat);
            } else {
                readingObj = new SensorReading(key, valueControl, timeControl, dateString);
                renderTrends(readingObj, chartType, opacity, chartIntervalType, chartInterval, xValueFormat);
            }
        }
    });

    // SHOW CURRENT WEEK TO THE FIELD
    var date = picker[key].getMoment()._d;
    var day = date.getDay();
    var days = 0-day;
    var sundayDate = new Date(date.getTime()+(days*24*60*60*1000));
    var days = 6-day
    var saturdayDate = new Date(date.getTime()+(days*24*60*60*1000));
    field.value = parseDate(sundayDate.toLocaleDateString()) + ' - ' + parseDate(saturdayDate.toLocaleDateString());
}


// This code is outdated but may be useful in the future.
function assignDatePicker() {
    pickerFields = document.querySelectorAll('input[id*="datepicker-"]');
    for(var i=0; i<pickerFields.length; i++) {
        key = pickerFields[i].parentElement.dataset.key;
        field = pickerFields[i];
        trigger = field.nextElementSibling;
        
        picker[key] = new Pikaday({
            field: field,
            trigger: trigger,
            theme: 'dark-theme',
            position: 'bottom right',
            showWeekNumber: true,
            // firstDay: 1,
            onSelect: function() {
                chartIntervalType = "hour";
                chartInterval = 1;
                chartType = "column"
                
                valueControl = key!='overview' ? getValueControl(trigger) : null;
                timeControl = getTimeControl(trigger);
                dateString = getDate(this);
                readingObj = new SensorReading(key, valueControl, timeControl, dateString);
                clearInterval(window.interval[key]);
                renderTrends(readingObj, chartType, 0.6, chartIntervalType, chartInterval);
            }
        })
        field.value = picker[key].getMoment().format('YYYY-MM-DD');
    }
}


/**
 * Function Calls
 */
// assignDatePicker();