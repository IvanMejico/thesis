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

    public function get($input=false) {
        if(!$input) {
            $data = [];
            foreach($_REQUEST as $field => $value) {
                $data[$field] = FH::sanitize($value);
            }
            return $data;
        }
        if(!isset($_REQUEST[$input])) return false;
        return FH::sanitize($_REQUEST[$input]);
    }

    public function getPayload() {
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
        if ($contentType === "application/json") {
            $content = trim(file_get_contents("php://input"));
            $decoded = json_decode($content, true);
            if(is_array($decoded)) {
                return $decoded;
            } else {
                echo 'Something went wrong.';
            }
        }       
    }
}