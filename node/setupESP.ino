//------------------------------------------------------------------------//
// SETUP AND CONNECT ESP WIFI ADAPTER																		  //
//------------------------------------------------------------------------//
  
boolean setupESP() {
    Serial.println("\n>> SETTING UP ESP CONNECTION...\n");

		sendCommand("AT+RST", 2000, "OK");
		sendCommand("AT+CWMODE=1", 5000, "OK");
		sendCommand("AT+CWJAP=\""+SSID_ESP+"\",\""+SSID_KEY+"\"", 10000, "OK");
		sendCommand("AT+CIPMUX=1", 5000, "OK");
		if(sendCommand("AT+CIFSR", 5000, "192.168") && DEBUG == true) {
				String returnVal = esp8266.readString();
				String NODEiP = "192.168" + returnVal.substring(0,8); 
				Serial.println("IP ADDRESS: " + NODEiP);
				Serial.println("SETUP DONE");
		}
}
