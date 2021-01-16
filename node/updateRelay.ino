//------------------------------------------------------------------------//
// SEND HTTP GET REQUEST 																							    //
//------------------------------------------------------------------------//

void updateRelay(int pin) {
		String relayId="relay";
		if(pin < 10)
				relayId += "0" + String(pin); 
		else
				relayId += String(pin);

    if(DEBUG) Serial.println("\n>> CHECKING RELAY STATUS...\n"); 

		String response;
		String get = "GET " + RELAY_ENDPOINT + "?relay_id="+ relayId +" HTTP/1.1\r\n" + 
								"Host: " + HOST + "\r\n" + 
								"Content-Length: 40\r\n" + 
								"Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW\r\n\r\n" + 
								"----WebKitFormBoundary7MA4YWxkTrZu0gW";

    sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
    sendCommand("AT+CIPSEND=0," + String(get.length()),2000,">");

    if(DEBUG) {
        esp8266.println(get); 

        int start_time = millis();
				while(esp8266.available()){
						if((millis()-start_time)>5000){
								Serial.println("timeout");
								break;
						}
				}

        if(esp8266.find("#")) { 
						Serial.println("# found:" + esp8266.read());
        }
				sendCommand("AT+CIPCLOSE=0," + String(get.length()),2000,">");
		} else {
		}
}

// void setRelay(String relay_status, int pin) {
//     String firstCharacter, secondCharacter;
// 
//     firstCharacter = relay_status.substring(0,1);
//     secondCharacter = relay_status.substring(1,2); 
//     
//     if(relay_status == "TR" || firstCharacter == "T" || secondCharacter == "R") {
//         if(digitalRead(pin) == HIGH) {
//             digitalWrite(pin, LOW); // LOW closes "normally open" relay terminal.
//             // Serial.println("Relay: LOW"); // x
//         }
//     } else if (relay_status == "FL" || firstCharacter == "F" || secondCharacter == "L") {
//         if(digitalRead(pin) == LOW) {
//             digitalWrite(pin, HIGH); // HIGH opens "normally open" relay terminal
//             // Serial.println("Relay: HIGH"); // x
//         }
//     }
// } 
