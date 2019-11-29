#include <SoftwareSerial.h>

#define ESP8266_RX 10  // Connect the TX pin from the ESP to this RX pin of the Arduino
#define ESP8266_TX 11  // Connect the TX pin from the Arduino to the RX pin of ESP
#define relayPin 3

//NETWORK INFORMATION
String SSID_ESP = "B315_E2741";         // WIFI SSID
String SSID_KEY = "LEMNISCATE";         // WIFI PASSWORD
String HOST = "192.168.254.101";        // HOST NAME (Raspberry Pi IP ord DNS)
String PORT = "80";

String sensor_node_id = "PSN001";

String relay_url = "/sensordata/relay.php?";   // SCRIPT FROR RELAY CONTROL
String send_url = "/sensordata/submit.php?";   // SCRIPT FOR SENDING SENSOR READINGS
String nodeIp;                                    // IP ANDRESS OF THE SENSOR NODE
String espResponseString = "";      // RESPONSE STRING FROM THE DATABASE

//Define the used function later in the code.
// float getSensorData();
boolean setupESP();   
boolean sendCommand(String command, int maxTime, String readReply);
boolean sendToServer();
void setRelay(String relay_status);
void checkRelay();
void sendSensorReading(String unit, float reading);
void setRelay(String relay_status);


// WIND SENSOR VARAIBLES
float valSensor = 0;
const int numReadings = 10;   // Defines number of reading to calculate average windspeed
int readings[numReadings];    // the readings from the analog input

float voltage=0;
float current=0;
float power=0;
float wind = 0;

String type;
float reading[2];

SoftwareSerial esp8266(ESP8266_RX, ESP8266_TX);

void setup() {
  // SETUP WIND SENSOR READING VALUES
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }

  pinMode(relayPin, OUTPUT);

  Serial.begin(9600);
  esp8266.begin(115200);
  setupESP();
  digitalWrite(relayPin, LOW);
}

void loop() {
  // checkRelay();   // check and set relay status from the server



  //*** Wind measurements
  // type = "wind";
  // wind = random(1, 4);
  // reading[0] = wind;
  // sendSensorReading(type, reading);

  //*** Electrical measurements
  type = "electrical";
  voltage = random(3, 12);
  current = random(1, 3);
  reading[0] = voltage;
  reading[1] = current;
  sendSensorReading(type, reading);



  // valSensor = getSensorData();    // gather sensor dat
  // sendSensorReading(voltage, current);   // send sensor measurement to the server

  //*** For debugging
  // delay(2000);
  // Serial.println("---");
}
