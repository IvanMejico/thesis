//------------------------------------------------------------------------//
// SUBMIT ESP COMMANDS 																									  //
//------------------------------------------------------------------------//

boolean sendCommand(String command, int maxTime, char readReply[]) {
    unsigned long timeout_start_val; 
    timeout_start_val = millis(); 
		if(DEBUG) { 
				Serial.print("at command => ");
				Serial.print(command);
				Serial.print(" "); 
		}

    while(true){        
				if(DEBUG) { 
						esp8266.println(command);
						if(esp8266.find(readReply)) {
								Serial.println(" SUCCESS");
								return 1;
						} 
						if((millis()-timeout_start_val) > maxTime) {
								Serial.println(" Timeout: Fail");
								return 0;
						} 
						Serial.print(".");
				} else { 
						Serial.println(command);
						if(Serial.find(readReply)) return 1; 
						if((millis()-timeout_start_val) > maxTime) return 0;
				}
    }
    
}  
