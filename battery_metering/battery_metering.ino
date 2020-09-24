// #include <SoftwareSerial.h>

#define ESP8266_RX 10  // Connect the TX pin from the ESP to this RX pin of the Arduino
#define ESP8266_TX 11  // Connect the TX pin from the Arduino to the RX pin of ESP
#define relayPin 3

//NETWORK INFORMATION
String SSID_ESP = "B315_E2741";         // WIFI SSID
String SSID_KEY = "YM1A429R4YQ";         // WIFI PASSWORD
String HOST = "192.168.254.120";        // HOST NAME (Raspberry Pi IP ord DNS)
String PORT = "80";

String sensor_node_id = "PSN003"; // CHANGE THIS
String relay_id = "PSN003-R0"; // CHANGE THIS

String send_url = "/iotdashboard/submit.php?";   // SCRIPT FOR SENDING SENSOR READINGS
String nodeIp;                                    // IP ANDRESS OF THE SENSOR NODE
String espResponseString = "";      // RESPONSE STRING FROM THE DATABASE

//Define the used function later in the code.
boolean setupESP();   
boolean sendCommand(String command, int maxTime, String readReply);
// SoftwareSerial esp8266(ESP8266_RX, ESP8266_TX); // x


void setup() {
  pinMode(A0, INPUT);

  // Serial.begin(9600);
  Serial.begin(115200); // >
  setupESP();
}

void loop() {
  sendSoc(getSoc());
}
