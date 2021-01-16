/*
  Rui Santos
  Complete project details at Complete project details at https://RandomNerdTutorials.com/esp8266-nodemcu-http-get-post-arduino/

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "Hellespont";
const char* password = "SPARTA464BC";

//Your Domain name with URL path or IP address with path
String serverName = "http://192.168.254.10:80/iotdashboard/requests/relay.php";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 2000;

void setup() {
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);

  pinMode(D1, HIGH);
  pinMode(D2, HIGH);
  pinMode(D3, HIGH);
  pinMode(D4, HIGH);
  
  Serial.begin(115200); 

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  //Send an HTTP request every 10 minutes
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;

      String serverPath = serverName + "?type=node-hash";
      
      // Your Domain name with URL path or IP address with path
      http.begin(serverPath.c_str());
      
      // Send HTTP GET request
      int httpResponseCode = http.GET();
      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();  
        Serial.println(payload);



        // Open and close relay        
        int arr_size = payload.length();
        char array[arr_size];
        payload.toCharArray(array, arr_size);

        /*
        Serial.println(arr_size);
        Serial.println("start");
        for(int i=0; i<=arr_size; i++) {
          Serial.print(array[i]);
        }
        Serial.println("end");
        */
  
        char *strings[10];
        char *ptr = NULL;
        byte index = 0;    
        
        ptr = strtok(array, "#");

        while(ptr != NULL) {
          strings[index] = ptr;
          index++;
          ptr = strtok(NULL, "#");
        }
        
        
        for(int n = 0; n < index; n++) {
          String s = strings[n];

          String relay_id = s.substring(1,2);
          Serial.print("relay: ");
          Serial.println(relay_id);

          String relay_status = s.substring(3,-1);
          Serial.print("status: ");
          Serial.println(relay_status);
          
          switchRelay(relay_id.toInt(), relay_status);
          
          
          Serial.println("==============================");
        }

        
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

void switchRelay(int pin, String stat) {
  
  
  if(stat == "1"){
    switch(pin) {
      case 1:
        digitalWrite(D1, LOW); 
        break;
      case 2:
        digitalWrite(D2, LOW); 
        break;
      case 3:
        digitalWrite(D3, LOW); 
        break;
      case 4:
        digitalWrite(D4, LOW); 
        break;
    }
     
  } else if(stat == "0"){
         switch(pin) {
      case 1:
        digitalWrite(D1, HIGH); 
        break;
      case 2:
        digitalWrite(D2, HIGH); 
        break;
      case 3:
        digitalWrite(D3, HIGH); 
        break;
      case 4:
        digitalWrite(D4, HIGH); 
        break;
    }
  }
}
