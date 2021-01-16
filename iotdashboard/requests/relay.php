<?php 


include('./includes/config.php');
include('./includes/DB.php');
include('./includes/Model.php');
include('./includes/Input.php');
require('./includes/Config.php');
include('./includes/FH.php');
include('./includes/H.php');
require('./includes/Loads.php');

$l = new Loads();
$conf = new Config();
$request = new Input();

if($request->isPost()) {
    $l->assign($request->get());
    $l->save();
}

if($request->isPut()) { 
	$conf->assign($request->get());
	$conf->save(); 
}

if($request->isGet()) { 
	$type = $request->get('type');
    if($type == "node-hash") { 
		$res = $l->find(['order' => 'relay_id']);
		$count = 1;
		$output = "";

		// Loads are assigned to relays in alphabetical order based in relay_id value.
		// Ooutput format: r1:1##r2:1##r3:1##r4:0
		foreach($res as $val) {
			$output .= "r{$count}:{$val->relay_status}#";
			$count++;
		}
		echo $output;
	} else if($type == "node-json") { 
		$res = $l->find(['order' => 'relay_id']); 
		$output = [];
		foreach($res as $val) {
			array_push($output, [$val->relay_id => $val->relay_status]);
		}
		echo json_encode($output);
	} else if($type == "client"){
		$res = $l->find(['order' => 'priority_level']);
		echo json_encode($res);
	} else {
		die("Invalid type parameter!");
	}
}

if($request->isDelete()) {
    $l->delete($request->get('id'));
}
