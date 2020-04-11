<?php

/**
 * BACKEND
 * 1. Get timestamp of very PSN001(load) reading. (descending order)
 *      QUERY: SELECT `timestamp` FROM energy_summary WHERE sensor_id='PSN001' ORDER BY `timestamp` DESC LIMIT 200 
 * 2. Get PSN002 and PSN003 reading using every
 *      timestamp gatthered from the previous query.
 * 3. If there's no retrieved data from a specific 
 *      sensor id for the specifict timestamp, assign null value.
 * 4. Push the da to reading array.
 * 5. Encode array to JSON format. Echo JSON data.
 * 
 * FRONTEND
 * 1. Retrieve and parse JSON data.
 * 4. push datapoints and render chart.
 */


include('config.php');
include('helpers.php');
$GLOBALS['connection'] = mysqli_connect($servername, $username, $password, $db);

/**
 * Function definitions
 */

function getLiveOverview() {
    $date = getCurrentDate();
    $dataPoints = [];
    $dataLength = getDataLength();
    
    $queryString = "SELECT `sensor_id`, `timestamp`, `voltage`, `current` FROM `energy_reading` WHERE `sensor_id` = 'PSN001' " 
        . "AND `timestamp` LIKE '$date%' ORDER BY `timestamp` DESC LIMIT $dataLength;";


    if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
        while($row = $result->fetch_assoc()) {
            // load power

            $loadReadings = $row;

            $timeStamp= $row['timestamp'];
            $strArr = explode(':',$timeStamp);
            $dtStr = $strArr[0].':'.$strArr[1];

            if($loadReadings != null) {
                $loadVoltage = (float)$loadReadings['voltage'];
                $loadCurrent = (float)$loadReadings['current'];
                $loadPower = $loadVoltage * $loadCurrent;
            } else {
                $loadPower = null;
            }

            // turbine power
            $turbineReadings = getFromTimeStamp('PSN002', $dtStr, true);
            if($turbineReadings != null) {
                $turbineVoltage = (float)$turbineReadings['voltage'];
                $turbineCurrent = (float)$turbineReadings['current'];
                $turbinePower = $turbineVoltage * $turbineCurrent;
            } else {
                $turbinePower = null;
            }

            // solar power
            $solarReadings = getFromTimeStamp('PSN003', $dtStr, true);
            if($solarReadings != null) {
                $solarVoltage = (float)$solarReadings['voltage'];
                $solarCurrent = (float)$solarReadings['current'];
                $solarPower = $solarVoltage * $solarCurrent;
            } else {
                $solarPower = null;
            }
            
            array_push($dataPoints, Array(
                'timestamp' => $timeStamp,
                'load' => $loadPower, 
                'turbine' => $turbinePower,
                'panel' => $solarPower
            ));
        }
    }   else {
        echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    }

    echo json_encode(array_reverse($dataPoints));
}

function getSummaryOverview($timeControl) {
    $dataPoints = [];

    $queryString = "";
    $date = getDateParams();
    switch($timeControl) {
        case 'day':
            $queryString = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `energy_summary` WHERE sensor_id='PSN001'"
                . "AND `timestamp` LIKE '$date%' ORDER BY `timestamp` DESC;";
            break;
        case 'week':
            $date1 = "";
            $date2 = "";
            if(strstr($date, "_")) {
                $dateArr = explode("_", $date);
                $date1 = $dateArr[0];
                $date2 = $dateArr[1];
            }

            $queryString = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `energy_summary` WHERE sensor_id='PSN001'"
                . "AND `timestamp` >= '$date1' AND `timestamp` <= '$date2' ORDER BY `timestamp` DESC;";
            break;
        case 'month':
            $month = "";
            if($date) {
                $dateArr = explode('-', $date);
                $month = $dateArr[1];
            }

            $queryString = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `energy_summary` WHERE sensor_id='PSN001'"
                . "AND `timestamp` LIKE '%-$month-%' ORDER BY `timestamp` DESC;";
            break;
        case 'year':
            $year = "";
            if($date) {
                $dateArr = explode('-', $date);
                $year = $dateArr[0];
            }

            $queryString = "SELECT `sensor_id`, `timestamp`, `average_voltage`, `average_current` FROM `energy_summary` WHERE sensor_id='PSN001'"
                . "AND `timestamp` LIKE '$year-%' ORDER BY `timestamp` DESC;";
            break;
        default:
            echo '<script>console.log("No time control matches the available options.")</script>';
    }

    // Get load reading data
    if($result = mysqli_query($GLOBALS['connection'], $queryString)) {
        // For every timestamp on results get PSN002(turbine) and PSN003(panel)
        while($row = $result->fetch_assoc()) {
            $timeStamp = $row['timestamp'];

            // load power
            $loadReadings = $row;
            if($loadReadings != null) {
                $loadVoltage = (float)$loadReadings['average_voltage'];
                $loadCurrent = (float)$loadReadings['average_current'];
                $loadPower = $loadVoltage * $loadCurrent;
            } else {
                $loadPower = null;
            }

            // turbine power
            $turbineReadings = getFromTimeStamp('PSN002', $timeStamp, false);
            if($turbineReadings != null) {
                $turbineVoltage = (float)$turbineReadings['average_voltage'];
                $turbineCurrent = (float)$turbineReadings['average_current'];
                $turbinePower = $turbineVoltage * $turbineCurrent;
            } else {
                $turbinePower = null;
            }

            // solar power
            $solarReadings = getFromTimeStamp('PSN003', $timeStamp, false);
            if($solarReadings != null) {
                $solarVoltage = (float)$solarReadings['average_voltage'];
                $solarCurrent = (float)$solarReadings['average_current'];
                $solarPower = $solarVoltage * $solarCurrent;
            } else {
                $turbinePower = null;
            }


            /**
             * JSON Format:
             * [{psn001 : power},
             * {psn002 : power},
             * {psn003 : power]]
             */

            array_push($dataPoints, Array(
                'timestamp' => $timeStamp,
                'load' => $loadPower, 
                'turbine' => $turbinePower,
                'panel' => $solarPower
            ));
        }
    } else {
        echo 'ERROR: '. mysqli_error($GLOBALS['connection']);
    }

    echo json_encode(array_reverse($dataPoints));
}

function main() {
    $timeControl = getTimeControl();
    if($timeControl == 'live')
        getLiveOverview();
    else
        getSummaryOverview($timeControl);
}


/**
 * Function calls
 */
main();
?>