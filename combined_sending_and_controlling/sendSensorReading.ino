void sendSensorReading(float reading) {
    Serial.println("\n>> SENDING SENSOR READING...\n");
    
    // SEND SENSOR DATA
    String getData = "GET /esp8266/wifidata.php?value="+String(reading);
    sendCommand("AT+CIPMUX=1",2000,"OK");
    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
    sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
    esp8266.println(getData);delay(1500);
}