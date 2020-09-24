<?php

include('./includes/config.php');
include('./includes/DB.php');
include('./includes/Model.php');
include('./includes/Input.php');
include('./includes/FH.php');
include('./includes/H.php');

include("vendor/autoload.php");
use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

class Battery extends Model {
    public $id, $level;

    public function __construct() {
        $table = 'battery_level';
        parent::__construct($table);
        $this->_softDelete = false;
    }

    public function afterSave($op) {
        $result = $this->findById($this->id);
        $client = new Client(new Version2X('http://localhost:3000'));
        $client->initialize();
        if($op == 'update') {
            $client->emit('battery_update', H::getObjectProperties($result));
        }
        $client->close();
    }

    public function getLevel() {
        return $this->findFirst();
    }
}

$b = new Battery();
$request = new Input();

if($request->isGet()) {
    echo json_encode($b->getLevel());
}

if($request->isPost()) {
    $b->assign($request->get());
    $b->save();
}

?>