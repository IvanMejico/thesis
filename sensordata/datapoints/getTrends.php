<?php

/**
 * 1) Connect to the database
 * 2) Get data for specific sensor_id and/or unit(s)
 *  If there's no unit parameter given, just query all possible units on the database
 *  If there is a unit parameter given, return just the value that corresponds to that specific unit
 *  == QUERIES EX ==
 *      QUERY1(VOLTAGE): SELECT * FROM voltage_reading WHERE sensor_id = 'PSN001';
 *      QUERY2(CURRENT): SELECT * FROM current_reading WHERE sensor_id = 'PSN001';
 *      QUERY2(WIND_SPEED): SELECT * FROM environment_reading WHERE sensor_id = 'ESN001';
 * 3) Push and sort query result into respective arrays
 * 3) Combine the resulting arrays into a single array.
 * 4) Echo the result.
 * 
 * [{voltage_values},{current_values},{power_values},{wind_speed_values}]
 */

include('config.php');
$GLOBALS['connection'] = mysqli_connect($servername, $username, $password, $db);


// ** [START] HELPER FUNCTIONS ***
// GETTERS
function getSensorType($sensorId) {
    $querySensorType = "SELECT `sensor_type` FROM `sensor` WHERE `id` = '$sensorId';";
    if($result = mysqli_query($GLOBALS['connection'], $querySensorType)) {
        $row = $result->fetch_assoc();
        $sensorType = $row['sensor_type'];
        return $sensorType;
    } else
        die('ERROR: '. mysqli_error($GLOBALS['connection']));
}

function getTimeControl() {
    $timeControl = isset($_GET['time_control']) ? $_GET['time_control'] : "live";
    return $timeControl;
}

function getUnit() {
    $unit = isset($_GET['unit']) ? $_GET['unit'] : 'all';
    return $unit;
}

function getSensorId() {
    return $_GET['sensor_id'];
}

function getDataLength() {
    $dataLength = isset($_GET['data_length']) ? $_GET['data_length'] : 50;
    return $dataLength;
}

function getCurrentDate() {
    date_default_timezone_set("Asia/Manila");
    $timestamp = date("Y-m-d H:i:s");
    $arr = explode(" ", $timestamp);
    $date = $arr[0];
    return $date;
}

// SETTERS
// ** [END] HELPER FUNCTIONS ***


// *** [START] MAIN FUNCTIONS ***

function getLiveTrends() {  
    $date = getCurrentDate();
    
    $tempDp = []; // Temporary data buffer
    $dataPoints = []; // Data to be returned
    
    $sensorId = getSensorId();
    $dataLength = getDataLength();
    $unit = getUnit();
    $timeControl = getTimeControl();
    
     
    // If sensor type is electrical get the voltage_reading and current_reading tables
    // if sensor type is wind get the environment_reading table
    $sensorType = getSensorType($sensorId);
    $readings = [];
    if($sensorType == 'electrical') {
        // Get sensor readings from the current date
        $queryString = "SELECT * FROM `energy_reading` WHERE `sensor_id` = '$sensorId' " 
            . "AND `timestamp` LIKE '%$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";
    
        if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
            while($row = $result->fetch_assoc()) {
                switch($unit) {
                    case 'all':
                        $readings['voltage'] = $row['voltage'];
                        $readings['current'] = $row['current'];
                        $readings['power'] = (float)$row['voltage'] * (float)$row['current'];
                        break;
                    case 'voltage':
                        $readings['voltage'] = (float)$row['voltage'];
                        break;
                    case 'current':
                        $readings['current'] = (float)$row['current'];
                        break;
                    case 'power':
                        $readings['power'] = (float)$row['voltage'] * (float)$row['current'];
                        break;
                    default:
                        break;
                }
                array_push(
                    $tempDp, 
                    [
                        'id' => (int)$row['id'],
                        'sensor_id' => $row['sensor_id'],
                        'readings' => $readings,
                        'timestamp' => $row['timestamp']
                    ]
                );
            }
        } else
            echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    } else if($sensorType == 'environment') {
        // TODO: Code for solar irradiance must be added
        $queryString = "SELECT * FROM `environment_reading` WHERE `sensor_id` = '$sensorId' "
            . "AND `timestamp` LIKE '%$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";
        
        if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
            while($row = $result->fetch_assoc()) {
                switch($unit) {
                    case 'all':
                        $readings['windSpeed'] = $row['wind_speed'];
                        $readings['solarInsolation'] = $row['solar_irradiance'];
                        break;
                    case 'wind_speed':
                        $readings['windSpeed'] = (float)$row['wind_speed'];
                        break;
                    case 'solar_insolation':
                        $readings['solarInsolation'] = (float)$row['solar_irradiance'];
                        break;
                }
                array_push(
                    $tempDp, 
                    [
                        'id' => (int)$row['id'], 
                        'sensor_id' => $row['sensor_id'],
                        'readings' => $readings,
                        'timestamp' => $row['timestamp']
                    ]
                );
            }
        } else
            echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    } else {
        echo "Sensor type error!";
    }
    
    sort($tempDp); // sort sensor readings in ascending order per reading id
    
    $dataPoints = array_merge(
        Array("sensor_type"=>$sensorType),
        Array("sensor_data"=>$tempDp)
    );

    echo json_encode($dataPoints);
}

function getSummaryTrends($timeControl) {
    
}

function main() {
    $timeControl = getTimeControl();
    if($timeControl == 'live')
        getLiveTrends();
    else
        getSummaryTrends($timeControl);
}

// *** [END] MAIN FUNCTIONS ***


// *** FUNCTION CALLS ***
main();

?>