<?php

/**
 * 1) Connect to the database
 * 2) Get data for specific sensor_id and/or unit(s)
 *  If there's no unit parameter given, just query all possible units on the database
 *  If there is a unit parameter given, return just the value that corresponds to that specific unit
 *  == QUERIES EX ==
 *      QUERY1(VOLTAGE): SELECT * FROM voltage_reading WHERE sensor_id = 'PSN001';
 *      QUERY2(CURRENT): SELECT * FROM current_reading WHERE sensor_id = 'PSN001';
 *      QUERY2(WIND_SPEED): SELECT * FROM environment_reading WHERE sensor_id = 'ESN001';
 * 3) Push and sort query result into respective arrays
 * 3) Combine the resulting arrays into a single array.
 * 4) Echo the result.
 * 
 * [{voltage_values},{current_values},{power_values},{wind_speed_values}]
 */

include('config.php');
include('helpers.php');
$GLOBALS['connection'] = mysqli_connect($servername, $username, $password, $db);

function getLiveTrends() {  
    $date = getCurrentDate();
    
    $tempDp = []; // Temporary data buffer
    $dataPoints = []; // Data to be returned
    
    $sensorId = getSensorId();
    $dataLength = getDataLength();
    $unit = getUnit();
     
    // If sensor type is electrical get the voltage_reading and current_reading tables
    // if sensor type is wind get the environment_reading table
    $sensorType = getSensorType($sensorId);
    $readings = [];
    if($sensorType == 'electrical') {
        // Get sensor readings from the current date
        $queryString = "SELECT * FROM `energy_reading` WHERE `sensor_id` = '$sensorId' " 
            . "AND `timestamp` LIKE '%$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";
    
        if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
            while($row = $result->fetch_assoc()) {
                switch($unit) {
                    case 'all':
                        $readings['voltage'] = (float)$row['voltage'];
                        $readings['current'] = (float)$row['current'];
                        $readings['power'] = (float)$row['voltage'] * (float)$row['current'];
                        break;
                    case 'voltage':
                        $readings['voltage'] = (float)$row['voltage'];
                        break;
                    case 'current':
                        $readings['current'] = (float)$row['current'];
                        break;
                    case 'power':
                        $readings['power'] = (float)$row['voltage'] * (float)$row['current'];
                        break;
                    default:
                        break;
                }
                array_push(
                    $tempDp, 
                    [
                        'id' => (int)$row['id'],
                        'sensor_id' => $row['sensor_id'],
                        'readings' => $readings,
                        'timestamp' => $row['timestamp']
                    ]
                );
            }
        } else
            echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    } else if($sensorType == 'environment') {
        // TODO: Code for solar irradiance must be added
        $queryString = "SELECT * FROM `environment_reading` WHERE `sensor_id` = '$sensorId' "
            . "AND `timestamp` LIKE '%$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";
        
        if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
            while($row = $result->fetch_assoc()) {
                switch($unit) {
                    case 'all':
                        $readings['windSpeed'] = (float)$row['wind_speed'];
                        $readings['solarInsolation'] = (float)$row['solar_irradiance'];
                        break;
                    case 'wind_speed':
                        $readings['windSpeed'] = (float)$row['wind_speed'];
                        break;
                    case 'solar_insolation':
                        $readings['solarInsolation'] = (float)$row['solar_irradiance'];
                        break;
                }
                array_push(
                    $tempDp, 
                    [
                        'id' => (int)$row['id'], 
                        'sensor_id' => $row['sensor_id'],
                        'readings' => $readings,
                        'timestamp' => $row['timestamp']
                    ]
                );
            }
        } else
            echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    } else {
        echo "Sensor type error!";
    }
    
    sort($tempDp); // sort sensor readings in ascending order per reading id
    
    $dataPoints = array_merge(
        Array("sensor_type"=>$sensorType),
        Array("sensor_data"=>$tempDp)
    );

    echo json_encode($dataPoints);
}

function getSummaryTrends($timeControl) {
    $readings = [];
    $tempDp = [];
    $dataPoints = []; // Data to be returned

    $sensorId = getSensorId();
    $sensorType = getSensorType($sensorId);    
    $unit = getUnit();

    $queryString = "";
    
    $tableName = $sensorType == 'electrical' ? 'energy_summary' : 'environment_summary';
    $date = getDateParams();
    switch($timeControl) {
        case 'day':
            $queryString = "SELECT * FROM `$tableName` WHERE `sensor_id` = '$sensorId' AND `timestamp` LIKE '$date%';";
            break;
        case 'week':
            $date1 = "";
            $date2 = "";
            if(strstr($date, "_")) {
                $dateArr = explode("_", $date);
                $date1 = $dateArr[0];
                $date2 = $dateArr[1];
            }
            
            $queryString = "SELECT * FROM `$tableName` WHERE `sensor_id` = '$sensorId'" 
                . " AND `timestamp` >= '$date1' AND `timestamp` <= '$date2';";
            break;
        case 'month':
            $month = "";
            if($date) {
                $dateArr = explode('-', $date);
                $month = $dateArr[1];
            }
            
            $queryString = "SELECT * FROM `$tableName` WHERE `sensor_id` = '$sensorId' AND `timestamp` LIKE '%-$month-%';";
            break;
        case 'year':
            $year = "";
            if($date) {
                $dateArr = explode('-', $date);
                $year = $dateArr[0];
            }
            $queryString = "SELECT * FROM `$tableName` WHERE `sensor_id` = '$sensorId' AND `timestamp` LIKE '$year-%';";
            break;
        default:
            break;
    }
    
    if($sensorType == 'electrical') {
        // Get sensor readings from the current date
        if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
            while($row = $result->fetch_assoc()) {
                switch($unit) {
                    case 'all':
                        $readings['voltage'] = (float)$row['average_voltage'];
                        $readings['current'] = (float)$row['average_current'];
                        $readings['power'] = (float)$row['average_voltage'] * (float)$row['average_current'];
                        break;
                    case 'voltage':
                        $readings['voltage'] = (float)$row['average_voltage'];
                        break;
                    case 'current':
                        $readings['current'] = (float)$row['average_current'];
                        break;
                    case 'power':
                        $readings['power'] = (float)$row['average_voltage'] * (float)$row['average_current'];
                        break;
                    default:
                        break;
                }
                array_push(
                    $tempDp, 
                    [
                        'id' => (int)$row['id'],
                        'sensor_id' => $row['sensor_id'],
                        'readings' => $readings,
                        'timestamp' => $row['timestamp']
                    ]
                );
            }
        } else
            echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    } else if($sensorType == 'environment') {
        if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
            while($row = $result->fetch_assoc()) {
                switch($unit) {
                    case 'all':
                        $readings['windSpeed'] = (float)$row['average_wind_speed'];
                        $readings['solarInsolation'] = (float)$row['average_solar_irradiance'];
                        break;
                    case 'wind_speed':
                        $readings['windSpeed'] = (float)$row['average_wind_speed'];
                        break;
                    case 'solar_insolation':
                        $readings['solarInsolation'] = (float)$row['average_solar_irradiance'];
                        break;
                }
                array_push(
                    $tempDp, 
                    [
                        'id' => (int)$row['id'], 
                        'sensor_id' => $row['sensor_id'],
                        'readings' => $readings,
                        'timestamp' => $row['timestamp']
                    ]
                );
            }
        } else
            echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    }

    $dataPoints = array_merge(
        Array("sensor_type"=>$sensorType),
        Array("sensor_data"=>$tempDp)
    );

    echo json_encode($dataPoints);
}

function main() {
    $timeControl = getTimeControl();
    if($timeControl == 'live')
        getLiveTrends();
    else
        getSummaryTrends($timeControl);
}

// *** FUNCTION CALLS ***
main();

?>