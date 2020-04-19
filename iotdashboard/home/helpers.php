<?php

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
    $timestamp = date("Y-m-d");
    $arr = explode(" ", $timestamp);
    $date = $arr[0];
    return $date;
}

function getDateParams() {
    $date = isset($_GET['date']) ? $_GET['date'] : '';
    return $date;
}

function getFromTimeStamp($sensorId, $timeStamp, $mode) {
    //Results are returned from newest to oldest
    $readings = null;
    $dataLength = getDataLength();

    if($mode) {
        $tableName = 'energy_reading';
        $sql = "SELECT `sensor_id`, `timestamp`, `voltage`, `current` FROM `$tableName` "
        . "WHERE `sensor_id`='$sensorId' AND `timestamp` LIKE '$timeStamp%' "
        . "ORDER BY `timestamp` DESC LIMIT $dataLength;";
    } else {
        $tableName = 'energy_summary';
        $sql = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `$tableName`"
            . "WHERE `sensor_id`='$sensorId' AND `timestamp` LIKE '$timeStamp%' "
            . "ORDER BY `timestamp` DESC LIMIT $dataLength;";
    }
    // echo $sensorId.' ';
    // echo $sql;
    if($result = mysqli_query($GLOBALS['connection'], $sql))
        $readings = $result->fetch_assoc();
    else
        echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
 
    return $readings;
}

// SETTERS
// ** [END] HELPER FUNCTIONS ***

?>