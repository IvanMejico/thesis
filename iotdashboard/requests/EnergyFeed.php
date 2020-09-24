<?php 

class EnergyFeed extends Feed {
    public $id, $node_id, $voltage, $current, $timestamp;

    public function __construct() {
        $table = 'energy_reading';
        parent::__construct($table);
    }

    public function afterSave($op) {
        $data = H::getObjectProperties($this);
        $data["power"] = round($data["voltage"] * $data["current"], 2); 
        unset($data['id']);
        $this->emitSocketEvent('new_feed', $data);
	echo "Data successfully saved.";
    }

    public function findAllReadings($params = []) {
        $params = $this->_softDeleteParams($params);
        $resultsQuery = $this->_db->find($this->_table, $params);
        if(!$resultsQuery) return [];
	foreach($resultsQuery as $r)
            $r->power = round($r->voltage * $r->current, 2); 
        return $resultsQuery; 
    }
}
