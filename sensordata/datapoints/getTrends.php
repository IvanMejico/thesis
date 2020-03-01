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
 * [{voltage_vaules},{current_values},{power_values},{wind_speed_values}]
 */

include('config.php');
$conn = mysqli_connect($servername, $username, $password, $db);

date_default_timezone_set("Asia/Manila");
$timestamp = date("Y-m-d H:i:s");
$arr = explode(" ", $timestamp);
$date = $arr[0];

$tempDp = [];
$dataPoints = []; // Data to be returned

$sensorId = $_GET['sensor_id'];
$dataLength = isset($_GET['datalength']) ? $_GET['datalength'] : 50;


// Query the sensor_type
$querySensorType = "SELECT `sensor_type` FROM `sensor` WHERE `id` = '$sensorId';";
if($result = mysqli_query($conn, $querySensorType)) {
    $row = $result->fetch_assoc();
    $sensorType = $row['sensor_type'];
} else
    echo 'ERROR: '. mysqli_error($conn);


// If sensor type is electrical get the voltage_reading and current_reading tables
// if sensor type is wind get the environment_reading table
if($sensorType == 'electrical') {
    $voltageQuery = "SELECT * FROM `energy_reading` WHERE `sensor_id` = '$sensorId' AND `timestamp` LIKE '%$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";

    if($result = mysqli_query($conn, $voltageQuery)) {
        while($row = $result->fetch_assoc()) {
            array_push(
                $tempDp, 
                [
                    "id" => (int)$row['id'],
                    "sensor_id" => $row['sensor_id'],
                    "voltage" => (float) $row['voltage'],
                    "current" => (float) $row['current'],
                    "timestamp" => $row['timestamp']
                ]
            );
        }
    } else
        echo 'ERROR: '. mysqli_error($conn);
}

if($sensorType == 'environment') {
    $windDp = [];
    $windQuery = "SELECT * FROM `environment_reading` WHERE `sensor_id` = '$sensorId' AND `timestamp` LIKE '%$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";
    
    if($result = mysqli_query($conn, $windQuery)) {
        while($row = $result->fetch_assoc()) {
            array_push(
                $tempDp, 
                [
                    "id" => (int)$row['id'], 
                    "sensor_id" => $row['sensor_id'],
                    "wind_speed" => (float) $row['wind_speed'],
                    "solar_irradiance" => (float) $row['solar_irradiance'],
                    "timestamp" => $row['timestamp']
                ]
            );
        }
    } else
        echo 'ERROR: '. mysqli_error($conn);
}

sort($tempDp); // sort sensor readings in accending order per reading id

$dataPoints = array_merge(
    Array("sensor_type"=>$sensorType),
    Array("sensor_data"=>$tempDp)
);

echo json_encode($dataPoints);
?>
