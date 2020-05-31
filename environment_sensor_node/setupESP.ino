boolean setupESP() {
    Serial.println("\n>> SETTING UP ESP CONNECTION...\n");

    if(sendCommand("AT", 2000, "OK")) {
        if(sendCommand("AT+RST", 2000, "OK")) {
            if(sendCommand("AT+CWMODE=1", 5000, "OK")) {
                if(sendCommand("AT+CWQAP", 5000, "OK")) {
                    if(sendCommand("AT+CWJAP=\""+SSID_ESP+"\",\""+SSID_KEY+"\"", 10000, "OK")) {
                        if(sendCommand("AT+CIFSR", 5000, "192.168")) {
                            String returnVal = Serial.readString(); // >
                            nodeIp = "192.168" + returnVal.substring(0,8);

                            if(sendCommand("AT+CIPMUX=1", 5000, "OK")) {
                                // Serial.println("IP ADDRESS: " + nodeIp); // x
                                // Serial.println("DONE"); // x
                            }
                        }
                    }
                }
            }
        }
    }
}
