<?php


include("vendor/autoload.php");
include('./includes/config.php');
include('./includes/DB.php');
include('./includes/Model.php');
include('./includes/Config.php');
include('./includes/Input.php');
include('./includes/FH.php');
include('./includes/H.php'); 
include('./includes/Battery.php');

$b = new Battery();
$request = new Input();

if($request->isGet()) { 
    echo json_encode($b->getLevel());
}

if($request->isPost()) {
    $b->assign($request->get());
    $b->save(); 
}
