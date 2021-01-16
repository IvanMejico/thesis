<?php


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
        $client = new Client(new Version2X('http://192.168.254.10:3000'));
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

        $client = new Client(new Version2X('http://192.168.254.10:3000'));
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


    public function getAll() {
        $conditions = [
            'order' => 'priority_level'
        ];

        return $this->find($conditions);
    }
} 
