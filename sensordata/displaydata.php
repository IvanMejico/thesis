<?php
error_reporting(1);
$servername = "localhost";
$username = "pi";
$password = "root";
$db="sensor_record";
$conn = mysqli_connect($servername, $username, $password,$db);
 
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
 
$sql="SELECT `values` FROM `sensor_values`;";
 
$result=mysqli_query($conn,$sql);
 
 
if($result>0) {
    while($row=mysqli_fetch_assoc($result)) {
	$savename= $row['values'];
	echo($savename);
	echo '<br>';
    }
}
?>
