void sendSensorReading(String type, float reading[]) {
    String getData;
    // Serial.println("\n>> SENDING SENSOR READING...\n"); // x

    /**
     * SEND SENSOR DATA
     * */

    // Check if the type of measurement
    if (type == "electrical") {
        float voltage = reading[0];
        float current = reading[1];

        getData = "GET " + send_url 
        + "sensor_id=" + sensor_node_id 
        + "&voltage=" + String(voltage) 
        + "&current=" + String(current);

    } else if (type == "wind") {
        int windSpeed = reading[0];

        getData = "GET " + send_url 
            + "sensor_id=" + sensor_node_id 
            + "&wind_speed=" + String(windSpeed);
    }


    // Serial.println(getData); // For debugging only

    sendCommand("AT+CIPMUX=1",2000,"OK");
    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
    sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
    Serial.println(getData);delay(1500); // >
    sendCommand("AT+CIPCLOSE=0",2000,"OK");
}