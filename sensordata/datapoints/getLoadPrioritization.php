<?php

include('config.php');

$conn = mysqli_connect($servername, $username, $password, $db);

if(isset($_GET['label']) && isset($_GET['loadname'])) {

    // UPDATE 'load_name' ON THE DATABASE
    $label = $_GET['label'];
    $loadName = $_GET['loadname'];
    $query = "UPDATE `relay_control` SET load_name = '$loadName' WHERE `label` = '$label';";
    echo $query;
    mysqli_query($conn, $query);

} else if (isset($_GET['label']) && isset($_GET['increaseprio'])) {
    // Priority from level 1 to 4 being 1 the highest and 4 the lowest
    // So we increase priority level by subtracting from the current value
    // then decreasing the value of the load that has the 'priority_level' value of the difference.
    
    // GET CURRENT LEVEL OF THE SELECTED LOAD FROM THE DATABASE USING 'label' VALUE
    // newLevel = currentLevel - 1;
    // UPDATE `relay_control` SET `level` = '$currentLevel'  WHERE priority_level = 'newLevel'
    // UPDATE `relay_control` SET `level` = '$newLevel' WHERE `label` = $label;
    // This, in effect swaps the priority level between the selected load and the load that has the priority level about it


    // GET 'level' VALUE OF DEFINED 'label' VALUE FROM THE DATABASE
    $label = $_GET['label'];
    $query1 = "SELECT `priority_level` FROM `relay_control` WHERE `label` = '$label'";
    if($result=mysqli_query($conn, $query1)) {
        $row = $result->fetch_assoc();
        $currentLevel =  $row['priority_level'];

        if($_GET['increaseprio'] == 'true') {
            $newLevel = $currentLevel - 1;
            $limit = 1;
        } else {
            $newLevel = $currentLevel + 1;
            $limit = 4;
        }

        if($currentLevel != $limit) {
            // UPDATE PRIORITY LEVEL OF A LOAD THAT CURRENTLY HAVE PRIORITY LEVEL of $newLevel 
            //  VALUE INTO THE PRIORITY LEVEL VALUE OF THE SELECTED LOAD.
            $query2 = "UPDATE  `relay_control` SET `priority_level` = '$currentLevel' WHERE `priority_level` = '$newLevel';";
            if($result=mysqli_query($conn, $query2)) {
                echo $query2 . "<br>";
                echo "Priority level of higher prio load successfully updated!<br>";
            } else {
                echo 'ERROR: '. mysqli_error($conn);
            }
            
            // UPDATE 'priority_level' OF SELECTED LOAD to $newLevel
            $query3 = "UPDATE `relay_control` SET `priority_level` = '$newLevel' WHERE `label` = '$label';";
            if($result=mysqli_query($conn, $query3)) {
                // echo $query3 . "<br>";
                echo "Priority level of selected load successfully updated!";
            } else {
                echo 'ERROR: '. mysqli_error($conn);
            }

        }   
    } else {
        echo 'ERROR: '. mysqli_error($conn);
    }
} else {

    $query = "SELECT `label`, `load_name`, `priority_level` FROM relay_control ORDER BY `priority_level`";
    $resultArr = [];
    if($result = mysqli_query($conn, $query)) {
        while($row = $result->fetch_assoc()) {
            array_push($resultArr, $row);
        }
        echo json_encode($resultArr);
    } else {
        echo 'ERROR: '. mysqli_error($conn);
    }

}
?>