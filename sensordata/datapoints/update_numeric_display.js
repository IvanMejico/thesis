function updateNumeric(sensorid, unit, value) {
    n = document.querySelector("#"+sensorid+" .numeric-"+unit+"");
    switch(unit) {
        case 'voltage':
            u = 'V';
            break;
        case 'current':
            u = 'A';
            break;
        case 'power':
            u = 'W';
            break;
        case 'wind_speed':
            u = 'm/s';
            break;
        case 'solar_irradiance':
            u = 'W/m²';
            break;
        default:
            break;
    }
    n.innerText = value.toFixed(2)+u;
}