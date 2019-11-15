<?php

/**
 * 1) Connect to the database
 * 2) get the last 20 data
 * 3) translate to line graph
 */

$host = "localhost";
$dbId = "root";
$dbPw = "";
$dbName = "sensor_record";

$dataPoints = [];

$conn = mysqli_connect($host, $dbId, $dbPw, $dbName);

if(isset($_GET['datalength'])) {
    $dataLength = $_GET['datalength'];
    $query = "SELECT * FROM `sensor_values` ORDER BY `id` DESC LIMIT $dataLength;";
} else {
    $query = "SELECT * FROM `sensor_values` ORDER BY `id` DESC LIMIT 50;";
}


if($result = mysqli_query($conn, $query))
    while($row = $result->fetch_array())
        array_push($dataPoints, ["x" => (float)$row[0], "y"=>(float)$row[1]]);
else
    echo 'ERROR: '. mysqli_error($conn);

sort($dataPoints);

echo json_encode($dataPoints);
?>
