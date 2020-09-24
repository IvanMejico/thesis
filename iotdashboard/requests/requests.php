<?php
// These will be included/required here for now because I haven't set up namespaces yet.
require('./includes/config.php');
require('./includes/DB.php');
require('./includes/Model.php');
require('./includes/FH.php');
require('./includes/H.php'); 
require('./includes/Input.php');
require('./includes/Validator.php');
require('./includes/Feed.php');
require('./EnergyFeed.php');
require('./EnvironmentFeed.php'); 

$request = new Input();

if($request->isPost()) {
    $params = $request->get();
    $code = substr($params['node_id'], 0, 3); 
    try {
	if($code == 'esn') {
	    $required = [ 'wind_speed', 'solar_insolation', 'access_token' ]; 
	    $feed = new EnvironmentFeed();
	}
	else if ($code == 'psn') {
	    $required = [ 'voltage', 'current', 'access_token' ]; 
	    $feed = new EnergyFeed(); 
	} else { 
	    throw new exception('Invalid node_id parameter was provided.');
	}
	Validator::validateRequired($params, $required);
	Validator::confirmAccessToken($params['access_token']); 
    } catch (Exception $e) { 
	die ('<strong>Error: </strong><em>'.$e->getMessage().'</em>');
    } 
    if(!isset($params['timestamp']))
	$params['timestamp'] = date('Y-m-d H:i:s');
    foreach($params as $key => $value) {
	if($key != 'node_id' && $key != 'timestamp')
	    $params[$key] = floatval($value); 
    }
    $feed->assign($params); 
    $feed->save();
} 

if($request->isGet()) {
    $params = $request->get();
    $code = substr($params['node_id'], 0, 3); 
    if($code == 'all') { 
	try {
	    $required = ['scope', 'date', 'data_length', 'access_token'];
	    Validator::validateRequired($params, $required);
	    Validator::confirmAccessToken($params['access_token']); 
	} catch (Exception $e) { 
	    die ('<strong>Error: </strong><em>'.$e->getMessage().'</em>');
	}
	$dataset = Array();
	$nodeList = Array(
	    [ 'id' => 'esn001', 'units'=> ['solar_insolation', 'wind_speed']],
	    [ 'id' => 'psn001', 'units'=> ['power']],
	    [ 'id' => 'psn002', 'units'=> ['power']],
	    [ 'id' => 'psn003', 'units'=> ['power']]
	);
	foreach ($nodeList as $node) {
	    $code = substr($node['id'], 0, 3); 
	    $params['node_id'] = $node['id'];
	    if($code == "esn")
		$feed = new EnvironmentFeed();
	    else if($code == "psn")
		$feed = new EnergyFeed(); 
	    $res = $feed->findAllReadings($feed->prepareSearchConditions($params)); 
	    array_push(
		$dataset, 
		array_reverse($feed->filterOutput($node['units'], $res))
	    );
	} 
        echo json_encode($dataset); 
    } else {
	try {
	    $required = ['unit', 'scope', 'date', 'data_length', 'access_token'];
	    if($code == 'esn') {
		$feed = new EnvironmentFeed(); 
		$units = $params['unit'] == 'all' ? ['solar_insolation', 'wind_speed'] : [$params['unit']]; 
	    } else if($code == 'psn') { 
		$feed = new EnergyFeed();
		$units = $params['unit'] == 'all' ? ['voltage', 'current', 'power'] : [$params['unit']]; 
	    }
	    else
		throw new exception("Invalid node_id parameter was provided."); 
	    Validator::validateRequired($params, $required);
	    Validator::confirmAccessToken($params['access_token']);
	} catch (Exception $e) { 
	    die ('<strong>Error: </strong><em>'.$e->getMessage().'</em>');
	} 
	$res = $feed->findAllReadings($feed->prepareSearchConditions($params));
	$r = array_reverse($feed->filterOutput($units, $res));
	echo json_encode($r);
    } 
}
