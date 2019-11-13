//[relayid][on-off][bg-bgshadwo]
var colorSets = [
    [//relay1 (red)
        [ // OFF
            ["#993d00"],
            ["#000 0 -1px 7px 1px, inset rgb(73, 21, 21) 0 -1px 9px, rgb(180, 147, 147) 0 2px 25px"]
        ],
        [ // ON
            ["#ff1010"],
            ["#000 0 -1px 7px 1px, inset rgb(158, 12, 12) 0 -1px 9px, rgb(235, 12, 12) 0 2px 25px"],
        ]
    ],
    [//relay2 (yellow)
        [ // OFF
            ["#ac9c10"],
            ["#000 0 -1px 7px 1px, inset rgb(73, 21, 21) 0 -1px 9px, rgb(180, 147, 147) 0 2px 25px"]
        ],
        [ // ON
            ["#f7de05"],
            ["rgb(168, 162, 162) 0 -1px 7px 1px, inset rgb(167, 167, 12) 0 -1px 9px, rgb(221, 221, 19) 0 2px 25px"]
        ]
    ],
    [//relay3 (green)
        [ // OFF
            ["#517509"],
            ["#000 0 -1px 7px 1px, inset rgb(73, 21, 21) 0 -1px 9px, rgb(180, 147, 147) 0 2px 25px"]
        ],
        [ // ON
            ["#98de0d"],
            ["#000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 25px"]
        ]
    ],
    [//relay4 (blue)
        [ // OFF
            ["#105d6b"],
            ["#000 0 -1px 7px 1px, inset rgb(73, 21, 21) 0 -1px 9px, rgb(180, 147, 147) 0 2px 25px"]
        ],
        [ // ON
            ["#09bdde"],
            ["rgb(0, 13, 187) 0 -1px 7px 1px, inset #006 0 -1px 9px, #06F 0 2px 25px"]
        ]
    ],
    [//relay5 (violet)
        [ // OFF
            ["#430457"],
            ["#000 0 -1px 7px 1px, inset rgb(73, 21, 21) 0 -1px 9px, rgb(180, 147, 147) 0 2px 25px"]
        ],
        [ // ON
            ["#c200ff"],
            ["rgb(47, 3, 56) 0 -1px 7px 1px, inset rgb(82, 13, 173) 0 -1px 9px, rgb(140, 0, 255) 0 2px 25px"]
        ]
    ]
];


window.onload = function () {

    // select toggle buttons
    var toggle1 = document.getElementById('relay1');
    var toggle2 = document.getElementById('relay2');
    var toggle3 = document.getElementById('relay3');
    var toggle4 = document.getElementById('relay4');
    var toggle5 = document.getElementById('relay5');

    // add event listerner to toggle buttons
    toggle1.onclick = function() {
        checked = toggle1.checked;
        saveToggle(1,checked);
    }
    toggle2.onclick = function() {
        checked = toggle2.checked;
        saveToggle(2, checked);
    }
    toggle3.onclick = function() {
        checked = toggle3.checked;
        saveToggle(3, checked);
    }
    toggle4.onclick = function() {
        checked = toggle4.checked;
        saveToggle(4, checked);
    }
    toggle5.onclick = function() {
        checked = toggle5.checked;
        saveToggle(5, checked);
    }
    
	
	var numericDisplay = document.getElementById('wind-numeric');
    
	var dps = [];

	var chart = new CanvasJS.Chart("chartContainer", {
		zoomEnabled: true,
		zoomType: "xy",
		backgroundColor: "#FFF",
		// width: 320,
		animationEnabled: true,
		theme: "light1",
		title:{
			text: "Wind Power Chart"
		},
		axisY:{
			includeZero: false
		},
		data: [{        
			type: "line",
			lineColor: "red",
			markerColor: "red",
			markerSize: 6,
			dataPoints: dps
		}]
	});

	var xVal;
	var yVal;
	var updateInterval = 1000;
	var dataLength = 50;
	var prevXval = 0;

	var updateChart = function (count) {
		var response;
		
		count = count || 1;

		// Perform AJAX request here. Get the xVal and the yVal values
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'getTrends.php?datalength='+count, true);
		xhr.onload = function() {
			response = JSON.parse(this.responseText);
			
			// foreach element in the response array, push it to the dataPoints;
			response.forEach(function(item, index){
				// while there's element left, push data to dataPoints
				let xVal = item['x'];
				let yVal = item['y'];

				// if count == 1 check if the current id == previous id
				if(xVal != prevXval) {
					dps.push({
						x: xVal,
						y: yVal
					});
					prevXval = xVal;
				}
				numericDisplay.innerText = item['y']; // update numeric display
			});	
		}
		xhr.send();


		if (dps.length > dataLength) {
			dps.shift();
		}
		chart.render();
	};

    // update toggle
    var updateToggle = function(relayId) {
        relayId;
        var toggle = document.getElementById('relay'+relayId)
        var led = document.getElementById("led-r"+relayId);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'getrelaystatus.php?getid='+relayId,true);
        xhr.onload = function() {
            var response = JSON.parse(this.responseText);
            // console.log(response.status)
            if(response.status == "TR") {
                toggle.checked = true;
                
                led.style.backgroundColor = colorSets[relayId-1][1][0];
                led.style.boxShadow = colorSets[relayId-1][1][1];
                
            } else if (response.status == "FL") {
                toggle.checked = false;
                
                led.style.backgroundColor = colorSets[relayId-1][0][0];
                led.style.boxShadow = colorSets[relayId-1][0][1];
            }

        }
        xhr.send();
    }

    var saveToggle = function(toggleId, checked) {
        status = checked?'TR':'FL';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'getrelaystatus.php?setid='+ toggleId +'&setvalue='+status,true);
        xhr.onload = function() {
            // console.log('okay');
        }
        xhr.send();
	}
    
	updateChart(dataLength);
	setInterval(function(){updateChart()}, updateInterval);
    setInterval(function(){updateToggle(1)}, updateInterval);
    setInterval(function(){updateToggle(2)}, updateInterval);
    setInterval(function(){updateToggle(3)}, updateInterval);
    setInterval(function(){updateToggle(4)}, updateInterval);
    setInterval(function(){updateToggle(5)}, updateInterval);
}