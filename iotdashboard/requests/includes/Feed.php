<?php 

// == SERVER:
// retrieval
// filtering
// parsing
// returning
// == CLIENT 
// parsing
// pushing
// rendering


require("vendor/autoload.php");
use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

class Feed extends Model { 
    public function __construct($table) {
        parent::__construct($table);
        $this->_softDelete = false;
    }

    public function findAllReadings($params = []) {
        $params = $this->_softDeleteParams($params);
        $resultsQuery = $this->_db->find($this->_table, $params);
	return $resultsQuery ? $resultsQuery : [];
    }
    
    public function emitSocketEvent($eventName, $data) {
        try {
            $client = new Client(new Version2X('http://localhost:3000'));
            $client->initialize();
            $client->emit($eventName, $data);
            $client->close();
        } catch(Exception $e) {
            echo '<strong>ElephantIO Error Message: </strong><em>' .$e->getMessage().'</em>';
        }
    }

    public function findByNodeId($node_id) {
        $conditions = [
            'conditions' => 'node_id = ?',
            'bind' => [$node_id]
        ];
        return $this->find($conditions);
    }
    
    public function prepareSearchConditions($params) { 
        $bind = [];
        $cstring = 'node_id = ?';
        array_push($bind, $params['node_id']); 
        switch(trim($params['scope'], ' ')) {
            case 'day':
                $cstring .= ' and timestamp LIKE ?';
                array_push($bind, '%'.$params['date'].'%');
                break;
            case 'week': 
		if(!strstr($params['date'], "_"))
		    throw new exception('Invalid datestring for week.');
                $cstring .= ' and timestamp >= ?';
                $cstring .= ' and timestamp <= ?';
                $datearr = explode("_", $params['date']);
                array_push($bind, "$datearr[0] 00:00:00");
                array_push($bind, "$datearr[1] 23:59:59");
                break;
            case 'month':
                $cstring .= ' and timestamp LIKE ?';
                $datearr = explode('-', $params['date']);
                array_push($bind, "$datearr[0]-$datearr[1]%");
                break;
            case 'year':
                $cstring .= ' and timestamp LIKE ?';
                $datearr = explode('-', $params['date']);
                array_push($bind, "$datearr[0]-%");
                break;
            default:
                H::dnd('nothing matches with scope.');
        }
        $cstring .= ' ORDER BY timestamp DESC LIMIT ?';
        array_push($bind, $params['data_length']); 
        return [
            'conditions' => $cstring,
            'bind' => $bind
        ]; 
    }

    public function filterOutput($units, $output) { 
        foreach($output as $o) {
            foreach($o as $key => $value) {
                if($key !== 'node_id' && $key !== 'timestamp' && !in_array($key, $units))
                    unset($o->{$key});
            }
            if(count(get_object_vars($o)) <= 1)
                throw new exception("Output object property 
                    count is insufficient. Something went wrong.");
        } 
        return $output;
    } 
}
