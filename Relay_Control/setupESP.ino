boolean setupESP() {

    if(sendCommand("AT", 2000, "OK")) {
        if(sendCommand("AT+RST", 2000, "OK")) {
            if(sendCommand("AT+CWMODE=1", 5000, "OK")) {
                if(sendCommand("AT+CWQAP", 5000, "OK")) {
                    if(sendCommand("AT+CWJAP=\""+SSID_ESP+"\",\""+SSID_KEY+"\"", 10000, "OK")) {
                        if(sendCommand("AT+CIFSR", 5000, "192.168")) {
                            String returnVal = Serial.readString();
                            IP_ADDRESS = "192.168" + returnVal.substring(0,8);

                            if(sendCommand("AT+CIPMUX=1", 5000, "OK")) {
                                // Serial.println("IP ADDRESS: " + IP_ADDRESS);
                                // Serial.println("DONE");
                            }
                        }
                    }
                }
            }
        }
    }
}
