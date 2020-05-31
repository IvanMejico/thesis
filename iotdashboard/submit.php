<?php

include('home/config.php');
$conn = mysqli_connect($servername, $username, $password,$db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

date_default_timezone_set("Asia/Manila");
$timestamp = date("Y-m-d H:i:s");
$sensor_id = isset($_REQUEST['sensor_id']) ? $_REQUEST['sensor_id'] : '';
$sql = '';

if(isset($_REQUEST['voltage']) && isset($_REQUEST['current'])) {
    $tableName = "energy_reading"; echo '<br>';
    $voltage = $_REQUEST['voltage']; echo '<br>';
    $current = $_REQUEST['current'];
    $sql = "INSERT INTO `$tableName` (`sensor_id`, `voltage`, `current`, `timestamp`) 
            VALUES ('$sensor_id', '$voltage', '$current', '$timestamp')";
} else if(isset($_REQUEST['wind_speed']) && isset($_REQUEST['solar_irradiance'])) {
    $tableName = "environment_reading";
    $windSpeed = $_REQUEST['wind_speed'];
    $solarIrradiance = $_REQUEST['solar_irradiance'];
    $sql="INSERT INTO `$tableName` (`sensor_id`,`wind_speed`, `solar_irradiance`, `timestamp`) VALUES ('$sensor_id', '$windSpeed', '$solarIrradiance', '$timestamp')";
} else if(isset($_REQUEST['level'])) {
    $tableName = "battery_level";
    $level = $_REQUEST['level'];
    $sql="UPDATE `$tableName` SET `level` = '$level' WHERE `id`=1";
}

mysqli_query($conn ,$sql);
 
?>