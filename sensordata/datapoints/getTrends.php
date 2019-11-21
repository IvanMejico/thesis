<?php

/**
 * 1) Connect to the database
 * 2) get the last 20 data
 * 3) translate to line graph
 */

include('config.php');

$dataPoints = [];

$conn = mysqli_connect($servername, $username, $password, $db);
$sensor_id = $_GET['sensor_id'];
$unit = $_GET['unit'];
$table = $unit . '_reading';

if(isset($_GET['datalength'])) {
    $dataLength = $_GET['datalength'];
    $query = "SELECT * FROM `$table` WHERE `sensor_id` = '$sensor_id' ORDER BY `timestamp` DESC LIMIT $dataLength;";
} else {
    $query = "SELECT * FROM `sensor_values` ORDER BY `id` DESC LIMIT 50;";
}


if($result = mysqli_query($conn, $query)) {
    while($row = $result->fetch_assoc()) {
        array_push($dataPoints, 
            [
                "id" => (int)$row['id'], 
                "sensor_id" => $row['sensor_id'],
                "value" => (float) $row['value'],
                "timestamp" => $row['timestamp']
            ]
        );
    }
}
else
    echo 'ERROR: '. mysqli_error($conn);

sort($dataPoints);

echo json_encode($dataPoints);
?>
