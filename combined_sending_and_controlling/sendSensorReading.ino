void sendSensorReading(float voltage, float current) {
    Serial.println("\n>> SENDING SENSOR READING...\n");
    
    /**
     * SEND SENSOR DATA
     * */

    // For Electrical Readings
    String getData = "GET " + send_url 
        + "sensor_id=" + sensor_node_id 
        + "&voltage=" + String(voltage) 
        + "&current=" + String(current);

    // For  Wind Speed Readings
    // String getData = "GET " + send_url 
    //     + "sensor_id=" + sensor_node_id 
    //     + "&wind_speed=" + String(voltage);

    // Serial.println(getData); // For debugging only

    sendCommand("AT+CIPMUX=1",2000,"OK");
    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
    sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
    esp8266.println(getData);delay(1500);
    sendCommand("AT+CIPCLOSE=0",2000,"OK");
}