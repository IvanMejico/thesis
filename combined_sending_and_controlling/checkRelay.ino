boolean checkRelay() {
    valSensor = getSensorData();

    String getData = "GET " + location_url + String(valSensor); // CHANGE THIS

    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,4000,"OK");
    // esp8266.print("AT+CIPSEND=0," +String(getData.length()+4));
    if(sendCommand("AT+CIPSEND=0," +String(getData.length()+4),10000,">")) {
        esp8266.println(getData);
        esp8266.println();

        int start_time = millis();
        while(!esp8266.available()){//wait until a new byte is sent down from the ESP - good way to keep in lock-step with the serial port
            if((millis()-start_time)>5000){//if nothing happens within the timeout period, get out of here
                Serial.println("timeout");
                break;
            }
        }

        // response += esp8266.readString();
        // Serial.println(response);
        if(esp8266.find("OK")) {
            Serial.println("nasend na");
            delay(500);
            if(esp8266.find("#")) {
                response = esp8266.readString();
                response = response.substring(0,2);
                Serial.println("value:" + response);
                setRelay(response);
            }
        }
        
        Serial.println("passed");
    }

    
    // Serial.println(response);
    sendCommand("AT+CIPCLOSE=0",3000,"OK");  // Closed to make the process faster. Turned out it's not necessary.
    // Serial.println("");
}