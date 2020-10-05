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

function getNode($params) { 
		try {
				$required = ['unit', 'scope', 'date', 'data_length', 'access_token'];

				if(substr($params['node_id'], 0, 3) == 'esn') {
						$feed = new EnvironmentFeed(); 
						$units = $params['unit'] == 'all' ? ['solar_insolation', 'wind_speed'] : [$params['unit']]; 
				} else if(substr($params['node_id'], 0, 3) == 'psn') { 
						$feed = new EnergyFeed();
						$units = $params['unit'] == 'all' ? ['voltage', 'current', 'power'] : [$params['unit']]; 
				} else { 
						throw new exception("Invalid node_id parameter was provided."); 
				}
				Validator::validateRequired($params, $required);
				Validator::confirmAccessToken($params['access_token']);
		} catch (Exception $e) { 
				die ('<strong>Error: </strong><em>'.$e->getMessage().'</em>');
		} 

		$res = $feed->findAllReadings($feed->prepareSearchConditions($params));
		return array_reverse($feed->filterOutput($units, $res));
}

function getMultipleNodes($params, $search) { 
		try {
				$required = ['scope', 'date', 'data_length', 'access_token'];
				Validator::validateRequired($params, $required);
				Validator::confirmAccessToken($params['access_token']); 
		} catch (Exception $e) { 
				die ('<strong>Error: </strong><em>'.$e->getMessage().'</em>');
		}
		$dataset = Array(); 
		foreach ($search as $item) {
				$code = substr($item['id'], 0, 3); 
				$params['node_id'] = $item['id'];
				if($code == "esn")
						$feed = new EnvironmentFeed();
				else if($code == "psn")
						$feed = new EnergyFeed(); 
				$res = $feed->findAllReadings($feed->prepareSearchConditions($params)); 
				array_push(
						$dataset, 
						array_reverse($feed->filterOutput($item['units'], $res))
				);
		} 
		return $dataset;
}

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
    if(substr($params['node_id'], 0, 3) == 'all') { 
				$get_list = Array(
						[ 'id' => 'esn001', 'units'=> ['solar_insolation', 'wind_speed']],
						[ 'id' => 'psn001', 'units'=> ['power']],
						[ 'id' => 'psn002', 'units'=> ['power']],
						[ 'id' => 'psn003', 'units'=> ['power']]
				); 
        echo json_encode(getMultipleNodes($params, $get_list)); 
    } else {
				echo json_encode(getNode($params)); 
    } 
}
