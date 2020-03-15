<?php
    
include('config.php');
$conn = mysqli_connect($servername, $username, $password, $db);

if(isset($_REQUEST['level'])) {
    $level = $_REQUEST['level'];
    $query = "UPDATE `battery_level` SET `level` = $level WHERE `id` = 1";
    echo ($query);
    mysqli_query($conn, $query);
} else {
    $query = "SELECT * FROM `battery_level`";
    if($result = mysqli_query($conn, $query)) {
        $row = $result->fetch_assoc();
        $level = $row['level'];
        echo $level;
    } else
        echo 'ERROR: '. mysqli_error($conn);
}