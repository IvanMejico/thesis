<?php

    $servername = "localhost";
    $username = "pi";
    $password = "root";
    $db="sensor_record";
    
    $conn = mysqli_connect($servername, $username, $password,$db);
    
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    //$sql="insert into `sensor_values` (`values`) values ('".$_REQUEST['value']."')";
    $sql = "SELECT status FROM `relay_control` WHERE id = 1";
       
    $qry = mysqli_query($conn ,$sql);
    $res = mysqli_fetch_assoc($qry);
    $value = $res['status'];
    echo '#'.$value;
?>
