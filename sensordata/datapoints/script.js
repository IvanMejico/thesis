window.onload = function () {
    var updateInterval = 5000;
    // UPDATE CHART1
    updateChart1("ESN001", "wind_speed", 1000);
    setInterval(function(){updateChart1("ESN001", "wind_speed")}, updateInterval);

    updateChart2("PSN001", "voltage", 1000);
    setInterval(function(){updateChart2("PSN001", "voltage")}, updateInterval);

    updateChart3("PSN002", "current", 1000);
    setInterval(function(){updateChart3("PSN002", "current")}, updateInterval);

    updateChart4("PSN003", "voltage", 1000);
    setInterval(function(){updateChart4("PSN003", "voltage")}, updateInterval);

    updateChart5("PSN004", "current", 1000);
    setInterval(function(){updateChart5("PSN004", "current")}, updateInterval);

    // UPDATE TOGGLE BUTTONS
    
    setInterval(function(){updateToggle("ESN001")}, updateInterval);
    setInterval(function(){updateToggle("PSN001")}, updateInterval);
    setInterval(function(){updateToggle("PSN002")}, updateInterval);
    setInterval(function(){updateToggle("PSN003")}, updateInterval);
    setInterval(function(){updateToggle("PSN004")}, updateInterval);
}