<?php

include('datapoints/config.php');
$conn = mysqli_connect($servername, $username, $password,$db);

$relay_id = $_REQUEST['relay_id'];

$sql = "SELECT `status` FROM `relay_control` WHERE `relay_id` = '$relay_id'";
    
$qry = mysqli_query($conn ,$sql);
$res = mysqli_fetch_assoc($qry);
$value = $res['status'];
echo '#'.$value;

?>