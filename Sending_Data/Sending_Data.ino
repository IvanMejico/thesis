#include <SoftwareSerial.h>
#define RX 10
#define TX 11
String AP = "B315_E2741";       // CHANGE ME
String PASS = "LEMNISCATE"; // CHANGE ME
String HOST = "192.168.254.102";
String PORT = "80";

unsigned long timeout_start_val;
int valSensor = 1;

SoftwareSerial esp8266(RX,TX);
  
void setup() {
  Serial.begin(9600);
  esp8266.begin(115200);
  sendCommand("AT",2000,"OK");
  sendCommand("AT+CWMODE=1",2000,"OK");
  sendCommand("AT+CWJAP=\""+ AP +"\",\""+ PASS +"\"",5000,"OK");
}
void loop() {
  valSensor = getSensorData();
  String getData = "GET /esp8266/wifidata.php?value="+String(valSensor);
  sendCommand("AT+CIPMUX=1",2000,"OK");
  sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
  sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
  esp8266.println(getData);delay(1500);
  // sendCommand("AT+CIPCLOSE=0",2000,"OK");
}
int getSensorData(){
  return random(1000); // Replace with 
}