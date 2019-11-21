// select toggle buttons
var toggle1 = document.getElementById('relay1');
var toggle2 = document.getElementById('relay2');
var toggle3 = document.getElementById('relay3');
var toggle4 = document.getElementById('relay4');
var toggle5 = document.getElementById('relay5');

// add event listerner to toggle buttons
toggle1.onclick = function() {
    checked = toggle1.checked;
    saveToggle("ESN001",checked);
}
toggle2.onclick = function() {
    checked = toggle2.checked;
    saveToggle("PSN001", checked);
}
toggle3.onclick = function() {
    checked = toggle3.checked;
    saveToggle("PSN002", checked);
}
toggle4.onclick = function() {
    checked = toggle4.checked;
    saveToggle("PSN003", checked);
}
toggle5.onclick = function() {
    checked = toggle5.checked;
    saveToggle("PSN004", checked);
}


// TOGGLE
var updateToggle = function(sensor_id) {
    var relayId;
    switch (sensor_id) {
        case "ESN001":
            relayId = 1;
            break;
        case "PSN001":
            relayId = 2;
            break;
        case "PSN002":
            relayId = 3;
            break;
        case "PSN003":
            relayId = 4;
            break;
        case "PSN004":
            relayId = 5;
            break;
        default:
    }

    var toggle = document.getElementById('relay'+relayId); // TOGGLE BUTTON
    var led = document.getElementById('led-r'+relayId); // LED

    var xhr = new XMLHttpRequest();
    // console.log(sensor_id);
    xhr.open('GET', 'getrelaystatus.php?getid='+sensor_id,true);
    xhr.onload = function() {
        var response = JSON.parse(this.responseText);
        // console.log(response);
        if(response.status == "TR") {
            toggle.checked = true;
            
            led.style.backgroundColor = colorSets[relayId-1][1][0];
            led.style.boxShadow = colorSets[relayId-1][1][1];
            
        } else if (response.status == "FL") {
            toggle.checked = false;
            
            // UPDATE LED
            led.style.backgroundColor = colorSets[relayId-1][0][0];
            led.style.boxShadow = colorSets[relayId-1][0][1];
        }
    }
    xhr.send();
}

var saveToggle = function(sensor_id, checked) {
    status = checked?'TR':'FL';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'getrelaystatus.php?setid=' + sensor_id + '&setvalue='+status,true);
    xhr.onload = function() {
        // console.log('okay');
    }
    xhr.send();
}