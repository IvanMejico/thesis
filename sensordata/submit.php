<?php

include('datapoints/config.php');
$conn = mysqli_connect($servername, $username, $password,$db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sensor_id = $_REQUEST['sensor_id'];
$unit = $_REQUEST['unit'];
$value = $_REQUEST['value'];

$tableName = $unit . "_reading";

date_default_timezone_set("Asia/Manila");
$timestamp = date("Y-m-d H:i:s");

$sql="INSERT INTO `$tableName` (`sensor_id`,`value`, `timestamp`) VALUES ('$sensor_id', '$value', '$timestamp')";
mysqli_query($conn ,$sql);
 
?>