<?php

class Input {
    public function isPost() {
        return $this->getRequestMethod() === 'POST';
    }

    public function isPut() {
        return $this->getRequestMethod() === 'PUT';
    }

    public function isGet() {
        return $this->getRequestMethod() === 'GET';
    }

    public function isDelete() {
        return $this->getRequestMethod() === 'DELETE';
    }

    public function getRequestMethod() {
        return strtoupper($_SERVER['REQUEST_METHOD']);
    }

    public function get($input='') { 
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : ''; 
		$data = '';

		if ($input) { 
			if ($contentType == "application/json") {
				$content = trim(file_get_contents("php://input"));
				$dataArr = json_decode($content, true);
				$data = FH::sanitize($dataArr[$input]);
			} else if(isset($_REQUEST[$input])) { 
				$data = FH::sanitize($_REQUEST[$input]);
			}
		} else { 
			if ($contentType == "application/json") {
				$content = trim(file_get_contents("php://input"));
				$dataArr = json_decode($content, true);
				$data = $dataArr;
			} else { 
				$data = [];
				foreach($_REQUEST as $field => $value) {
					$data[$field] = FH::sanitize($value);
				}
			}
		}

		return $data;
    } 
}
