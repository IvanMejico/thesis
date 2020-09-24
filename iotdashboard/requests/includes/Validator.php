<?php

class Validator {
    public static function validateRequired($input, $requiredValues) {
        foreach($requiredValues as $v) {
            if(!isset($input[$v])) {
               throw new Exception("$v is required.") ;
            }
        }
    }

    public function confirmAccessToken($token) {
        if($token !== ACCESS_TOKEN) {
            throw new Exception('Invalid access token.');
        } 
    } 
} 
