<?php

include('config.php');
$conn = mysqli_connect($servername, $username, $password, $db);

$query = "SELECT id FROM sensor;";
$sensors = [];
if($result = mysqli_query($conn, $query)) {
    while($row = $result->fetch_assoc()) {
        array_push($sensors, $row);
    }
    echo json_encode($sensors);
}    
else
    echo 'ERROR: '. mysqli_error($conn);

?>