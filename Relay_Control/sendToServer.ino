boolean sendToServer() {

    String getData = "GET " + location_url; // CHANGE THIS

    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,4000,"OK");
    // Serial.print("AT+CIPSEND=0," +String(getData.length()+4));
    if(sendCommand("AT+CIPSEND=0," +String(getData.length()+4),10000,">")) {
        Serial.println(getData);
        Serial.println();

        int start_time = millis();
        while(!Serial.available()){//wait until a new byte is sent down from the ESP - good way to keep in lock-step with the serial port
            if((millis()-start_time)>5000){//if nothing happens within the timeout period, get out of here
                // Serial.println("timeout 1");
                break;
            }
        }

        // response += Serial.readString();
        // // Serial.println(response);
        if(Serial.find("OK")) {
            // Serial.println("nasend na");
            delay(500);
            if(Serial.find("#")) {
                response = Serial.readString();
                response = response.substring(0,2);
                // Serial.println("value:" + response);
                setRelay(response);
            }
        }
        
        // Serial.println("passed");
    }

    
    // // Serial.println(response);
    // sendCommand("AT+CIPCLOSE=0",3000,"OK");  // Closed to make the process faster. Turned out it's not necessary.
    // Serial.println("");
}