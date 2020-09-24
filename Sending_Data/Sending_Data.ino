#include <SoftwareSerial.h>
#define RX 10   // RECIEVE PIN FOR SoftwareSerial
#define TX 11   // TRANSMIT PIN FOR SoftwareSerial

String AP = "B315_E2741";           // NETWORK SSID
String PASS = "LEMNISCATE";         // NETWORK PASSWORD
String HOST = "192.168.254.120";    // NETWORK SERVER ADDRESS
String PORT = "80";                 // PORT ID

// WIND SENSOR VARAIBLES
float valSensor = 0;
const int numReadings = 10;   // Defines number of reading to calculate average windspeed
int readings[numReadings];    // the readings from the analog input
   
SoftwareSerial esp8266(RX,TX);  //library for debugging. To be able to see messages on the serial monitor whilst using the simultaneously using serial communication for wifi module communication.

void setup() {

  // SETUP WIND SENSOR READING VALUES
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }
  
  Serial.begin(9600);
  esp8266.begin(115200);
  
  sendCommand("AT",2000,"OK");
  sendCommand("AT+CWMODE=1",2000,"OK");
  sendCommand("AT+CWJAP=\""+ AP +"\",\""+ PASS +"\"",5000,"OK");
}
void loop() {
  // SEND SENSOR DATA
  valSensor = getSensorData();
  String getData = "GET /esp8266/wifidata.php?value="+String(valSensor);
  sendCommand("AT+CIPMUX=1",2000,"OK");
  sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
  sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
  esp8266.println(getData);delay(1500);
  sendCommand("AT+CIPCLOSE=0",2000,"OK");  // Commented out to speed up the process. Turns out that closing the TCP/UDP connection is unnecessary. Might include in the production though.

  // GET RELAY STATUS
  
}