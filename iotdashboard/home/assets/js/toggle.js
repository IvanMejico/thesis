// LOAD TOGGLE
var toggleLoad1 = document.getElementById('relay1');
var toggleLoad2 = document.getElementById('relay2');
var toggleLoad3 = document.getElementById('relay3');
var toggleLoad4 = document.getElementById('relay4');

// add event listerner to toggle buttons
// toggle1.onclick = function() {
//     checked = toggle1.checked;
//     saveToggle("ESN001",checked);
// }

toggleLoad1.onclick = function() {
    checked = toggleLoad1.checked;
    saveToggle("PSN001-R0", checked);
}

toggleLoad2.onclick = function() {
    checked = toggleLoad2.checked;
    saveToggle("PSN001-R1", checked);
}

toggleLoad3.onclick = function() {
    checked = toggleLoad3.checked;
    saveToggle("PSN001-R2", checked);
}

toggleLoad4.onclick = function() {
    checked = toggleLoad4.checked;
    saveToggle("PSN001-R3", checked);
}




// TOGGLE
var updateToggle = function(relay_id) {
    var relayId;
    switch (relay_id) {
        case "PSN001-R0":
            relayId = 1;
            break;
        case "PSN001-R1":
            relayId = 2;
            break;
        case "PSN001-R2":
            relayId = 3;
            break;
        case "PSN001-R3":
            relayId = 4;
            break;
        default:
            break;
    }

    var toggle = document.getElementById('relay'+relayId); // TOGGLE BUTTON
    var led = document.getElementById('led-r'+relayId); // LED

    var xhr = new XMLHttpRequest();
    // console.log(relay_id);
    xhr.open('GET', 'getrelaystatus.php?getid='+relay_id,true);
    xhr.onload = function() {
        var response = JSON.parse(this.responseText);
        // console.log('getrelaystatus.php?getid='+relay_id, response);
        // console.log(relay_id,'-',response);
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

var saveToggle = function(relay_id, checked) {
    status = checked?'TR':'FL';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'getrelaystatus.php?setid=' + relay_id + '&setvalue='+status,true);
    xhr.onload = function() {
        // console.log(this.responseText);
    }
    xhr.send();
}