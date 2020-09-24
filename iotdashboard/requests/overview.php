<?php

include('./includes/Validator.php');
include('./EnvironmentFeed.php');
include('./EnergyFeed.php');

//----------------------------------------------------------------------------------------
// Returned JSON value for AJAX request:
// [
//	[
//	    {load_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {load_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {load_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {load_power:2.33, timestamp:2020-07-21 00:00:00},
//	    ...
//	],
//	[
//	    {solar_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {solar_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {solar_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {solar_power:2.33, timestamp:2020-07-21 00:00:00},
//	    ...
//	],
//	[
//	    {wind_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {wind_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {wind_power:2.33, timestamp:2020-07-21 00:00:00},
//	    {wind_power:2.33, timestamp:2020-07-21 00:00:00},
//	    ...
//	],
//	[
//	    {solar_insolation:2.33, wind_speed:2.33, timestamp:2020-07-21 00:00:00},
//	    {solar_insolation:2.33, wind_speed:2.33, timestamp:2020-07-21 00:00:00},
//	    {solar_insolation:2.33, wind_speed:2.33, timestamp:2020-07-21 00:00:00},
//	    {solar_insolation:2.33, wind_speed:2.33, timestamp:2020-07-21 00:00:00},
//	    ...
//	]
// ] 
//---------------------------------------------------------------------------------------- 

/**
 * Params:
 *  - scope
 *  - date
 *  - data_length
 *  - access_token
 */

$request = new Input(); 
$nodeList = Array(
    ['id' => 'esn001', 'table' => 'environment_reading'],
    ['id' => 'psn001', 'table' => 'energy_reading'],
    ['id' => 'psn002', 'table' => 'energy_reading'],
    ['id' => 'psn003', 'table' => 'energy_reading']
); 

if($request->isGet()) {
    $dataset = [];
    $params = $request->get();
    try {
	$requiredParams = ['scope', 'date', 'data_length', 'access_token']; 
	Validator::validateRequired($params, $requiredParams);
	Validator::confirmAccessToken($params['access_token']); 
	foreach ($nodeList as $node) {
	    $params['node_id'] = $node['id'];
	    if($node['table'] == 'environment_reading')
		$feed = new EnvironmentFeed();
	    else if($listItem['table'] == 'energy_reading')
		$feed = new EnvironmentFeed(); 
	    $res = $feed->findAllReadings($feed->prepareSearchConditions($params));
	    array_push(
		$dataset, 
		array_reverse($feed->filterOutput($params['unit'], $res))
	    );
	} 
        echo json_encode($dataset);
    } catch (Exception $e) {
        die('<strong>Error Message: </strong><em>' .$e->getMessage().'</em>');
    } 
} 

?>
