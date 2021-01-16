<?php

require('./includes/Loads.php');


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
        $client = new Client(new Version2X('http://192.168.254.10:3000'));
        $client->initialize();
        if($op == 'update') {
            $client->emit('battery_update', H::getObjectProperties($result)); 

            $l = new Loads();
            $conf = new Config();

            $loads = array_reverse($l->getAll()); 
            $prio_conf = $conf->getConfig('automatic_prioritization');

            if($prio_conf == "auto") {
                $n = count($loads);
                $cpc = 100/$n; 
                foreach($loads as $key => $load) {
                    $leftCharge = 100-($cpc*($key+1));
                    $soc = $this->getLevel()->level;
                    if($soc > $leftCharge) {
                        $load->relay_status = 1;
                        $load->save();
                    } else { 
                        $load->relay_status = 0;
                        $load->save();
                    }
                }
            } else if ($prio_conf == "manual") {
                echo "Dude, it's manual!";
            }
        } 

        $client->close();
    }

    public function getLevel() { 
        return $this->findFirst();
    } 
} 
