enviField = document.getElementById('datepicker-envi');
loadField = document.getElementById('datepicker-load');
turbineField = document.getElementById('datepicker-turbine');
panelField = document.getElementById('datepicker-panel')

var pickerEnvi = new Pikaday({
    field: enviField,
    trigger: document.getElementById('datepicker-button-envi'),
    theme: 'dark-theme',
    position: 'bottom right',
    showWeekNumber: true,
    firstDay: 1,
    onSelect: function() {
        console.log(this.getMoment().format('YYYY-MM-DD'));
    }
});

var pickerLoad = new Pikaday({
    field: loadField,
    trigger: document.getElementById('datepicker-button-load'),
    theme: 'dark-theme',
    position: 'bottom right',
    showWeekNumber: true,
    firstDay: 1,
    onSelect: function() {
        console.log(this.getMoment().format('YYYY-MM-DD'));
    }
});

var pickerTurbine = new Pikaday({
    field: turbineField,
    trigger: document.getElementById('datepicker-button-turbine'),
    theme: 'dark-theme',
    position: 'bottom right',
    showWeekNumber: true,
    firstDay: 1,
    onSelect: function() {
        console.log(this.getMoment().format('YYYY-MM-DD'));
    }
});

var pickerPanel = new Pikaday({
    field: panelField,
    trigger: document.getElementById('datepicker-button-panel'),
    theme: 'dark-theme',
    position: 'bottom right',
    showWeekNumber: true,
    firstDay: 1,
    onSelect: function() {
        console.log(this.getMoment().format('YYYY-MM-DD'));
    }
});

enviField.value = pickerEnvi.getMoment().format('YYYY-MM-DD');
loadField.value = pickerLoad.getMoment().format('YYYY-MM-DD');
turbineField.value = pickerTurbine.getMoment().format('YYYY-MM-DD');
panelField.value = pickerPanel.getMoment().format('YYYY-MM-DD');