#include <SoftwareSerial.h>

// EmonLibrary examples openenergymonitor.org, Licence GNU GPL V3
#include "EmonLib.h"             // Include Emon Library
#define VOLT_CAL 290.0
EnergyMonitor emon1;             // Create an instance

#define ESP8266_RX 10  // Connect the TX pin from the ESP to this RX pin of the Arduino
#define ESP8266_TX 11  // Connect the TX pin from the Arduino to the RX pin of ESP

//NETWORK INFORMATION
String SSID_ESP = "B315_E2741";         // WIFI SSID
String SSID_KEY = "LEMNISCATE";         // WIFI PASSWORD
String HOST = "192.168.254.120";        // HOST NAME (Raspberry Pi IP ord DNS)
String PORT = "80";

// CHANGE THIS
String sensor_node_id = "PSN001";

String relay_url = "/sensordata/relay.php?";   // SCRIPT FROR RELAY CONTROL
String send_url = "/sensordata/submit.php?";   // SCRIPT FOR SENDING SENSOR READINGS
String nodeIp;                                    // IP ANDRESS OF THE SENSOR NODE
String espResponseString = "";      // RESPONSE STRING FROM THE DATABASE

//Define the used function later in the code.
boolean setupESP();   
boolean sendCommand(String command, int maxTime, String readReply);
boolean sendToServer();
void setRelay(String relay_status);
void checkRelay();
void sendSensorReading(String unit, float reading);
void setRelay(String relay_status);

float voltage=0;
float current=0;
float power=0;

String type;
float reading[2];

// SoftwareSerial esp8266(ESP8266_RX, ESP8266_TX);

void setup() {
  // SETUP ELECTRICAL SENSORS READING VALUES
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  emon1.voltage(A0, VOLT_CAL, 1.7);  // Voltage: input pin, calibration, phase_shift

  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);

  // Serial.begin(9600);
  Serial.begin(115200);
  setupESP();
}

void loop() {
  // check and set relay status from the server
  checkRelay("PSN001-R0", 3);
  checkRelay("PSN001-R1", 4);
  checkRelay("PSN001-R2", 5);
  checkRelay("PSN001-R3", 6);   


  //*** Electrical measurements
  //   type = "electrical";
  //   voltage = getVoltage();
  //   current = getCurrent();
  //   reading[0] = voltage;
  //   reading[1] = current;

  // sendSensorReading(type, reading);

  //*** For debugging
  // delay(2000);
  // Serial.println("---");
}
