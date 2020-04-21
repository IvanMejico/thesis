<?php

/**
 * 1) Connect to the database
 * 2) get the relay status
 * 3) set relay status
 * 4) when the relay is manually set, it will override changes made by the relay node
 */

include('config.php');

$conn = mysqli_connect($servername, $username, $password, $db);

if(isset($_GET['getid'])) {
    // get the status
    $relayId = $_GET['getid'];
    $query = "SELECT `status` FROM `relay_control` WHERE `relay_id` = '$relayId';";
    
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
    $status = $_GET['setvalue'];
    $query = "UPDATE `relay_control` SET `status` = '$status' WHERE relay_id = '$relayId';";
    if(mysqli_query($conn, $query)) {
        echo 'successfully updated';
    } else {
        echo 'ERROR: ', mysqli_error($conn);
    }
}

?>