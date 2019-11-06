<?php
    $servername = "localhost";
    $username = "pi";
    $password = "root";
    $db="sensor_record";
    // echo "hello";
    $conn = mysqli_connect($servername, $username, $password,$db);
    
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    $sql="insert into `sensor_values` (`values`) values ('".$_REQUEST['value']."')";
    // echo $sql;   
    $qry = mysqli_query($conn ,$sql);

    echo "#1";
?
