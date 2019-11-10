void checkRelay() {
    Serial.println("\n>> CHECKING RELAY STATUS...\n");

    valSensor = getSensorData();

    String getData = "GET " + location_url + String(valSensor); // CHANGE THIS

    sendCommand("AT+CIPSTART=1,\"TCP\",\""+ HOST +"\","+ PORT,4000,"OK");

    if(sendCommand("AT+CIPSEND=1," +String(getData.length()+4),10000,">")) {
        esp8266.println(getData);
        esp8266.println();

        int start_time = millis();
        while(!esp8266.available()){    //wait until a new byte is sent down from the ESP - good way to keep in lock-step with the serial port
            if((millis()-start_time)>5000){     //if nothing happens within the timeout period, get out of here
                Serial.println("timeout");
                break;
            }
        }

        if(esp8266.find("OK")) {
            Serial.println("nasend na");
            delay(500);
            if(esp8266.find("#")) {
                espResponseString = esp8266.readString();
                espResponseString = espResponseString.substring(0,2);
                setRelay(espResponseString);

                Serial.println("value:" + espResponseString); // show response string to serial monitor
            }
        }
        
        Serial.println("passed");
    }
    
    sendCommand("AT+CIPCLOSE=1",3000,"OK");  // Closed to make the process faster. Turned out it's not necessary.
}