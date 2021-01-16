<?php

class EnvironmentFeed extends Feed {
    public $node_id, $wind_speed, $solar_insolation, $timestamp;

    public function __construct() {
        $table = 'environment_reading';
        parent::__construct($table);
    }

    public function afterSave($op) {
        $data = H::getObjectProperties($this);
        unset($data['id']);
        $this->emitSocketEvent('new_feed', $data);
	echo "Data successfully saved.";
    } 
}
