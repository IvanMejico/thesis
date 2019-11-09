#include <SoftwareSerial.h>
#define RX 10
#define TX 11
String AP = "B315_E2741";
String PASS = "LEMNISCATE";
String HOST = "192.168.254.100";
String PORT = "80";

unsigned long timeout_start_val;

// Sensor variables
float valSensor = 0;
const int numReadings = 10; //Defines number of reading to calculate average windspeed
int readings[numReadings]; // the readings from the analog input
  
SoftwareSerial Serial(RX,TX);

void setup() {
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }
  
  Serial.begin(9600);
  Serial.begin(115200);
  sendCommand("AT",2000,"OK");
  sendCommand("AT+CWMODE=1",2000,"OK");
  sendCommand("AT+CWJAP=\""+ AP +"\",\""+ PASS +"\"",5000,"OK");
}
void loop() {
  valSensor = getSensorData();
  String getData = "GET /Serial/wifidata.php?value="+String(valSensor);
  sendCommand("AT+CIPMUX=1",2000,"OK");
  sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,2000,"OK");
  sendCommand("AT+CIPSEND=0," +String(getData.length()+4),5000,">");
  Serial.println(getData);delay(1500);
  // sendCommand("AT+CIPCLOSE=0",2000,"OK");
}