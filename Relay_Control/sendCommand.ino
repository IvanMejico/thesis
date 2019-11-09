boolean sendCommand(String command, int maxTime, char readReply[]) {

    // Serial.print("at command => ");
    // Serial.print(command);
    // Serial.print(" ");

    timeout_start_val = millis();
    
    // LOOP UNTIL FOUND OR TIMEOUT
    while(true){        
        Serial.println(command);
        if(Serial.find(readReply)) {
            // Serial.println(" SUCCESS");
            return 1;
        }

        if((millis()-timeout_start_val) > maxTime) {
            // Serial.println(" Timeout: Fail");
            return 0;
        }
        
        // Serial.print(".");
    }// end of infinite loop
    
}  