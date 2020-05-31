/**
 * 1) send relay id
 * 2) get the relay status for the specific sensor node
 * */

void checkRelay(String relay_id, int pin) {
    // Serial.println("\n>> CHECKING RELAY STATUS...\n"); // x

    String getData = "GET " + relay_url +"relay_id=" + relay_id; // GET request
    // Serial.println(getData); // For debugging only
    sendCommand("AT+CIPSTART=1,\"TCP\",\""+ HOST +"\","+ PORT,4000,"OK");

    if(sendCommand("AT+CIPSEND=1," +String(getData.length()+4),10000,">")) {
        Serial.println(getData); // >
        Serial.println(); // >

        int start_time = millis();
        while(!Serial.available()){   // > // wait until a new byte is sent down from the ESP - good way to keep in lock-step with the Serial port
            if((millis()-start_time)>5000){     //if nothing happens within the timeout period, get out of here
                // Serial.println("timeout"); // x
                break;
            }
        }

        if(Serial.find("OK")) { // >
            // Serial.println("nasend na"); // x
            delay(400);
            if(Serial.find("#")) { // >
                espResponseString = Serial.readString(); // >
                espResponseString = espResponseString.substring(0,2);
                setRelay(espResponseString, pin);

                // Serial.println("value:" + espResponseString); // x // show response string to serial monitor
            }
        }
        
        // Serial.println("passed"); // x
    }
    
    sendCommand("AT+CIPCLOSE=1",1000,"OK");  // Closed to make the process faster. Turned out it's not necessary.
}