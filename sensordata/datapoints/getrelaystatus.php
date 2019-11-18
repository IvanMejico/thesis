<?php

/**
 * 1) Connect to the database
 * 2) get the relay status
 * 3) set relay status
 * 4) when the relay is manually set, it will override changes made by the sensor node
 */

include('config.php');

$conn = mysqli_connect($host, $dbId, $dbPw, $dbName);

if(isset($_GET['getid'])) {
    // get the status
    $relayId = $_GET['getid'];
    $query = "SELECT status FROM `relay_control` WHERE id = $relayId;";

    if($result = mysqli_query($conn, $query)) {
        $row = $result->fetch_array();
        echo json_encode($row);
    } else {
        echo 'ERROR: '. mysqli_error($conn);
    }
}

if(isset($_GET['setid']) && isset($_GET['setvalue'])) {
    // set the status to TR or FL
    $relayId = $_GET['setid'];
    $value = $_GET['setvalue'];
    $query = "UPDATE `relay_control` SET `status` = '$value' WHERE id = $relayId;";
    echo $query;
    if(mysqli_query($conn, $query)) {
        echo 'successfully updated';
    } else {
        echo 'ERROR: ', mysqli_error($conn);
    }
}

?>
