void sendSensorReading(String unit, float reading) {
    //Serial.println("\n>> SENDING SENSOR READING...\n");
    
    // SEND SENSOR DATA
    String getData = "GET " + send_url 
        + "sensor_id=" + sensor_node_id 
        + "&unit="+ unit 
        + "&value=" + String(reading);
        
    sendCommand("AT+CIPMUX=1",2000,"OK");
    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
    sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
    Serial.println(getData);delay(1500);
    sendCommand("AT+CIPCLOSE=0",2000,"OK");
}