//------------------------------------------------------------------------//
// SEND HTTP POST REQUEST  																							  //
//------------------------------------------------------------------------//

void sendSensorReading(String reading_type, float readings[]) {
	if(DEBUG) Serial.println("\n>> SENDING SENSOR READING...\n"); 
  
  String endpoint = READING_ENDPOINT;
	String payload = "";
  
	if (READING_TYPE == "electrical") { 
    if(DEBUG) Serial.println("electrical");
		float voltage = float(readings[0]),
				current = float(readings[1]); 
		payload = "{\"node_id\":\""+NODE_ID
			+ "\", \"voltage\":\"" + String(voltage)
			+ "\", \"current\":\"" + String(current)
			+ "\", \"access_token\":\"" + ACCESS_TOKEN + "\"}";
	} else if (READING_TYPE == "environmental") { 
    if(DEBUG) Serial.println("environmental");
		float wind_speed = float(readings[0]),
					solar_insolation = float(readings[1]); 
		payload = "{\"node_id\":\""+NODE_ID
			+ "\", \"wind_speed\":\"" + String(wind_speed)
			+ "\", \"solar_insolation\":\"" + String(solar_insolation) 
			+ "\", \"access_token\":\"" + ACCESS_TOKEN + "\"}";
	} else if (READING_TYPE == "battery") {
    if(DEBUG) Serial.println("battery");
    float soc = readings[0];
    String id = "1";

    payload = "{\"id\":\""+id
      + "\", \"level\":\"" + String(1.2)
      + "\", \"access_token\":\"" + ACCESS_TOKEN + "\"}";
     
    endpoint = BATTERY_ENDPOINT;
	}
 
  String post = "POST " + endpoint + " HTTP/1.1\r\n"; 
  post += "Host: " + HOST + "\r\nContent-Type: application/json\r\nContent-Length: "
          + String(payload.length()) + "\r\n\r\n";
  post += payload; 

  if(DEBUG) Serial.println(post);
  sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
  sendCommand("AT+CIPSEND=0," +String(post.length()),2000,">");
	if(DEBUG) {
			esp8266.println(post);
			if(esp8266.find("SEND OK")) {
					Serial.println("////////////// SENT DATA //////////////");
					Serial.println(post);
					Serial.println("///////////////////////////////////////");
					sendCommand("AT+CIPCLOSE=0",2000,"OK");
			} 
	} else {
			Serial.print(post);
			if(Serial.find("SEND OK")) sendCommand("AT+CIPCLOSE=0",2000,"OK"); 
	}
} 
