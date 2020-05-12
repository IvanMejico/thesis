void sendSoc(int soc) {
    String getData;
    Serial.println("\n>> SENDING SOC...\n");

    /**
     * SEND BATTERY STATE OF CHARGE
     * */

    getData = "GET " + send_url 
        + "level=" + soc;


    Serial.println(getData); // For debugging only

    sendCommand("AT+CIPMUX=1",2000,"OK");
    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
    sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
    esp8266.println(getData);delay(1500);
    sendCommand("AT+CIPCLOSE=0",2000,"OK");
}