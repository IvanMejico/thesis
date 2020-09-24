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

class Loads extends Model {
    public $id, $relay_id, $load_name, $priority_level, $relay_status;

    public function __construct() {
        $table = 'loads';
        parent::__construct($table);
        $this->_softDelete = false;
    }

    public function validator() {}

    public function getAllLoads() {
        return $this->findFirst();
    }

    public function afterSave($op) {
        $result = $this->findByRelayId($this->relay_id);
        $client = new Client(new Version2X('http://localhost:3000'));
        $client->initialize();
        if($op == 'update') {
            $client->emit('loadlist_update', H::getObjectProperties($result));
        } else if($op == 'insert') {
            $client->emit('loadlist_insert', H::getObjectProperties($result));
        }
        $client->close();
    }

    public function afterDelete($id) {
        // TODO: query the new updated loadlist then emit the returned values

        $client = new Client(new Version2X('http://localhost:3000'));
        $client->initialize();
        $client->emit('loadlist_delete', Array('id'=>$id));
        $client->close();
    }

    public function findByRelayId($relay_id) {
        $conditions = [
            'conditions' => 'relay_id = ?',
            'bind' => [$relay_id]
        ];
        return $this->findFirst($conditions);
    }
}

$l = new Loads();
$request = new Input();
if($request->isPost()) {
    $l->assign($request->getPayload());
    $l->save();
}
if($request->isGet()) {
    if($request->get('relay_id')) {
        $res = $l->findByRelayId($request->get('relay_id'));
        echo '#'.$res->relay_status;
    } else {
        $res = $l->find(['order' => 'priority_level']);
        echo json_encode($res);
    }
}
if($request->isDelete()) {
    $l->delete($request->getPayload()['id']);
}

?>