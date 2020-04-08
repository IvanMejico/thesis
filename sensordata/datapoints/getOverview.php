<?php

/**
 * BACKEND
 * 1. Get timestamp of very PSN001(load) reading. (descending order)
 *      QUERY: SELECT `timestamp` FROM energy_summary WHERE sensor_id='PSN001' ORDER BY `timestamp` DESC LIMIT 200 
 * 2. Get PSN002 and PSN003 reading using every
 *      timestamp gatthered from the previous query.
 * 3. If there's no retrieved data from a specific 
 *      sensor id for the specifict timestamp, assign null value.
 * 4. Push the da to reading array.
 * 5. Encode array to JSON format. Echo JSON data.
 * 
 * FRONTEND
 * 1. Retrieve and parse JSON data.
 * 4. push datapoints and render chart.
 */


include('config.php');
$GLOBALS['connection'] = mysqli_connect($servername, $username, $password, $db);

/**
 * Function definitions
 */

function getValueControl() {
}

function getTimecontrol() {
}

function getDateString() {
}

function getDataLength() {
    $dataLength = isset($_GET['data_length']) ? $_GET['data_length'] : 50;
    return $dataLength;
}

function getFromTimeStamp($sensorId, $timeStamp) {
    $readings = null;
    $dataLength = getDataLength();
    $sql = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `energy_summary`"
        . "WHERE `sensor_id`='$sensorId' AND `timestamp`='$timeStamp' "
        . "ORDER BY `timestamp` DESC LIMIT $dataLength;";
    if($result = mysqli_query($GLOBALS['connection'], $sql))
        $readings = $result->fetch_assoc();
    else
        echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
 
    return $readings;
}


function getLiveOverview() {
}

function getSummaryOverview() {
    $readingBuffer = Array();
    $dataLength = getDataLength();

    // Get load reading data
    $sql = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `energy_summary` WHERE sensor_id='PSN001' ORDER BY `timestamp` DESC LIMIT $dataLength;";
    if($result = mysqli_query($GLOBALS['connection'], $sql)) {
        // For every timestamp on results get PSN002(turbine) and PSN003(panel)
        while($row = $result->fetch_assoc()) {
            $timeStamp = $row['timestamp'];

            // load power
            $loadReadings = $row;
            if($loadReadings != null) {
                $loadVoltage = (float)$loadReadings['average_voltage'];
                $loadCurrent = (float)$loadReadings['average_current'];
                $loadPower = $loadVoltage * $loadCurrent;
            } else {
                $loadPower = null;
            }

            // turbine power
            $turbineReadings = getFromTimeStamp('PSN002', $timeStamp);
            if($turbineReadings != null) {
                $turbineVoltage = (float)$turbineReadings['average_voltage'];
                $turbineCurrent = (float)$turbineReadings['average_current'];
                $turbinePower = $turbineVoltage * $turbineCurrent;
            } else {
                $turbinePower = null;
            }

            // solar power
            $solarReadings = getFromTimeStamp('PSN003', $timeStamp);
            if($solarReadings != null) {
                $solarVoltage = (float)$solarReadings['average_voltage'];
                $solarCurrent = (float)$solarReadings['average_current'];
                $solarPower = $solarVoltage * $solarCurrent;
            } else {
                $turbinePower = null;
            }


            /**
             * JSON Format:
             * [{psn001 : power},
             * {psn002 : power},
             * {psn003 : power]]
             */
            array_push($readingBuffer, Array(
                'timestamp' => $timeStamp,
                'load' => $loadPower, 
                'turbine' => $turbinePower,
                'panel' => $solarPower
            ));


            // FOR DEBUGGING
            // echo '<br>';
            // print_r($row);
            // echo '<br>';

            // print_r($turbineReadings);
            // echo '<br>';

            // print_r($solarReadings);
            // echo '<br>---------------<br>';
        }
    } else {
        echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    }

    echo json_encode(array_reverse($readingBuffer));
}



/**
 * Function calls
 */

 getSummaryOverview();
?>