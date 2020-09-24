// #include <SoftwareSerial.h> // x

// EmonLibrary examples openenergymonitor.org, Licence GNU GPL V3
#include "EmonLib.h"             // Include Emon Library
#define VOLT_CAL 290.0
EnergyMonitor emon1;             // Create an instance

#define ESP8266_RX 10  // Connect the TX pin from the ESP to this RX pin of the Arduino
#define ESP8266_TX 11  // Connect the TX pin from the Arduino to the RX pin of ESP

//NETWORK INFORMATION
String SSID_ESP = "B315_E2741";         // WIFI SSID
String SSID_KEY = "YM1A429R4YQ";         // WIFI PASSWORD
String HOST = "192.168.254.120";        // HOST NAME (Raspberry Pi IP ord DNS)
String PORT = "80";

String sensor_node_id = "PSN002"; // CHANGE THIS

String send_url = "/iotdashboard/submit.php?";   // SCRIPT FOR SENDING SENSOR READINGS
String nodeIp;                                    // IP ANDRESS OF THE SENSOR NODE
String espResponseString = "";      // RESPONSE STRING FROM THE DATABASE

//Define the used function later in the code.
boolean setupESP();   
boolean sendCommand(String command, int maxTime, String readReply);
void sendSensorReading(String unit, float reading);

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


  // Serial.begin(9600); // x
  Serial.begin(115200);
  setupESP();
}

void loop() {

  //*** Electrical measurements
  type = "electrical";
  voltage = getVoltage();
  current = getCurrent();
  reading[0] = voltage;
  reading[1] = current;

  sendSensorReading(type, reading);

  //*** For debugging
  // delay(2000);
  // ww.println("---");
}
