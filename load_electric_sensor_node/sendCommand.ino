boolean sendCommand(String command, int maxTime, char readReply[]) {
    unsigned long timeout_start_val;
    
    // Serial.print("at command => "); // x
    Serial.print(command); // o
    Serial.print(" "); // o

    timeout_start_val = millis();
    
    // LOOP UNTIL FOUND OR TIMEOUT
    while(true){        
        Serial.println(command);
        if(Serial.find(readReply)) {
            // Serial.println(" SUCCESS"); // x
            return 1;
        }

        if((millis()-timeout_start_val) > maxTime) {
            // Serial.println(" Timeout: Fail"); // x
            return 0;
        }
        
        // Serial.print(".");`// x
    }// end of infinite loop
    
}  