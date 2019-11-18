<?php

include('datapoints/config.php');
$conn = mysqli_connect($servername, $username, $password,$db);

$sensor_node_id = $_REQUEST['sensor_id'];

$sql = "SELECT `status` FROM `relay_control` WHERE `sensor_id` = '$sensor_node_id'";
    
$qry = mysqli_query($conn ,$sql);
$res = mysqli_fetch_assoc($qry);
$value = $res['status'];
echo '#'.$value;

?>