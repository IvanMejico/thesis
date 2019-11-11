#include <SoftwareSerial.h>

#define ESP8266_RX 10  //Connect the TX pin from the ESP to this RX pin of the Arduino
#define ESP8266_TX 11  //Connect the TX pin from the Arduino to the RX pin of ESP
#define relayPin 3

//NETWORK INFORMATION
String SSID_ESP = "B315_E2741";         // WIFI SSID
String SSID_KEY = "LEMNISCATE";         // WIFI PASSWORD
String HOST = "192.168.254.120";        // HOST NAME (Raspberry Pi IP ord DNS)
String PORT = "80";
// String location_url = "/sensordata/submit.php?value=";          // TARGET PHP SCRIPT
String location_url = "/sensordata/relay.php?";
String nodeIp;
String response = "";

unsigned long timeout_start_val;
int valSensor;

//Define the used function later in the code.
int getSensorData();
boolean setup_ESP();   
boolean sendCommand(String command, int maxTime, String readReply);
boolean sendToServer();
void setRelay(String relay_status);

SoftwareSerial esp8266(ESP8266_RX, ESP8266_TX);

void setup() {
  pinMode(relayPin, OUTPUT);

  Serial.begin(9600);
  esp8266.begin(115200);
  setupESP();
  digitalWrite(relayPin, LOW);
}

void loop() {
  sendToServer();
}
