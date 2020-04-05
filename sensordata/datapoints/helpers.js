/**
 * Helper functions
 */

 // #TABS
function getSelectedValue(tabs) {
    for(var i=0; i<tabs.length; i++) {
        if(tabs[i].checked) {
            return tabs[i].value;
        }
    }
}


 // #DATEPICKER
function parseDate(dateString) {
    dateArr = dateString.split('/');
    // console.log(dateString, dateArr);
    month = dateArr[0] > 9 ? dateArr[0] : '0'+dateArr[0];
    day = dateArr[1] > 9 ? dateArr[1] : '0'+dateArr[1];
    year = dateArr[2];
    dateString = year+"-"+month+"-"+day;
    return dateString;
}

function parseWeek(dateString) {
    dateString = dateString.split(' - ').join('_');
    return dateString;
}

function getSensorId(trigger) {
    sensorId = trigger.parentElement.parentElement.parentElement.dataset.sensorid;
    return sensorId;
}

function getTimeControl(trigger) {
    parent = trigger.parentElement;
    x = parent.previousElementSibling.children[0];
    tabs = x.getElementsByTagName('input');
    timeControl = getSelectedValue(tabs);
    return timeControl;
}

function getValueControl(trigger) {
    parent = trigger.parentElement;
    x = parent.previousElementSibling.children[1];
    tabs = x.getElementsByTagName('input');
    valueControl = getSelectedValue(tabs);
    return valueControl;
}

function getDate(obj) {
    dateString = obj.getMoment().format('YYYY-MM-DD');
    return dateString;
}