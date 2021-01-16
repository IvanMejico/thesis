<?php



class Config extends Model {
    public $id, $value;

    public function __construct() {
        $table = 'config';
        parent::__construct($table);
        $this->_softDelete = false;
    }

    public function getConfig($name) {
        $condition = [
            'conditions' => 'id = ?',
            'bind' => [$name]
        ];

        return $this->findFirst($condition)->value;
    } 
}
