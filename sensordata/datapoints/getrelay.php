<?php

/**
 * 1) Connect to the database
 * 2) get the relay status
 * 3) set relay status
 * 4) when the relay is manually set, it will override changes made by the sensor node
 */
error_reporting(E_ALL);
error_reporting(-1);
ini_set('display_errors', 1);

$host = "localhost";
$dbId = "pi";
$dbPw = "root";
$dbName = "sensor_record";

$conn = mysqli_connect($host, $dbId, $dbPw, $dbName);

if(isset($_GET['getid'])) {
    echo $_GET['getid'];)
}


?>
