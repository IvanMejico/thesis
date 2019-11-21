// #include <SoftwareSerial.h>

#define ESP8266_RX 10  // Connect the TX pin from the ESP to this RX pin of the Arduino
#define ESP8266_TX 11  // Connect the TX pin from the Arduino to the RX pin of ESP
#define relayPin 3

//NETWORK INFORMATION
String SSID_ESP = "B315_E2741";         // WIFI SSID
String SSID_KEY = "LEMNISCATE";         // WIFI PASSWORD
String HOST = "192.168.254.100";        // HOST NAME (Raspberry Pi IP ord DNS)
String PORT = "80";

String sensor_node_id = "ESN001";

String relay_url = "/sensordata/relay.php?";   // SCRIPT FROR RELAY CONTROL
String send_url = "/sensordata/submit.php?";   // SCRIPT FOR SENDING SENSOR READINGS
String nodeIp;                                    // IP ANDRESS OF THE SENSOR NODE
String espResponseString = "";      // RESPONSE STRING FROM THE DATABASE

//Define the used function later in the code.
float getSensorData();
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


// SoftwareSerial esp8266(ESP8266_RX, ESP8266_TX);

void setup() {
  // SETUP WIND SENSOR READING VALUES
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }

  pinMode(relayPin, OUTPUT);

  Serial.begin(115200);
  // esp8266.begin(115200);
  setupESP();
  digitalWrite(relayPin, LOW);
}

void loop() {
  checkRelay();   // check and set relay status from the server

  // for debugging
  valSensor = random(10);
  //Serial.println(valSensor);

  // valSensor = getSensorData();    // gather sensor dat
   sendSensorReading("wind_speed", valSensor);   // send sensor measurement to the server
  
  //Serial.println("---");
}
