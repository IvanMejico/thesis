/************************************************************************************************************
  Arduino Sensor Node Sketch: Measures sensor readings and submits it to the server using HTTP requests.
  Author: Ivan Mejico
  Date: 2020/11/04
*************************************************************************************************************/


#include <SoftwareSerial.h>
#define ESP8266_RX 10
#define ESP8266_TX 11

SoftwareSerial esp8266(ESP8266_RX, ESP8266_TX);


//------------------------------------------------------------------------//
// CONFIGURATIONS																												  //
//------------------------------------------------------------------------//

// NETWORK
const String SSID_ESP = "Hellespont";
const String SSID_KEY = "SPARTA464BC";
const String HOST = "192.168.254.10";
const String PORT = "80";
// SERVER
const String READING_ENDPOINT = "/iotdashboard/requests/requests.php";
const String BATTERY_ENDPOINT = "/iotdashboard/requests/requests.php";
const String RELAY_ENDPOINT = "/iotdashboard/requests/relay.php";
const String ACCESS_TOKEN = "5zdZNDGxtkbn5eS";
// DEBUG
const bool DEBUG = false;
// NODE
const String NODE_ID = "psn001";
const bool HASRELAY = false;
const int RELAY_PINS[] = {1, 2, 3, 4};
const int DELAY = 5000;
// READING
const String READING_TYPE = "electrical";
const String CURRENT_TYPE = "DC";


//Setup Wind Readings Variables
int serial_in;

double x = 0;
double y = 0;
double a = 0;
double b = 0;

float voltageMax = 2.0;
float voltageMin = .4;
float voltageConversionConstant = .004882814;
float sensorVoltage = 0;

float windSpeedMin = 0;
float windSpeedMax = 32;

int windSpeed = 0;
int prevWindSpeed = 0;

// Calibration
int voltageAdj = 4.59;

//------------------------------------------------------------------------//
// MAIN																																	  //
//------------------------------------------------------------------------//

void setup() {
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);

  if(READING_TYPE == "battery") {
    pinMode(3, OUTPUT);
  }

  if (HASRELAY) pinMode(1, OUTPUT);

  if (DEBUG) {
    Serial.begin(9600);
    esp8266.begin(115200);
  } else {
    Serial.begin(115200);
  }

  setupESP();
}

float getSOC(int pin) {
  // 0% = 2.08V     -> Battery voltage on 0% SOC
  // 100% = 12.48V  -> Battery voltage on 100% SOC
  // 1.04V per 1%   -> Equivalent voltage for 1% SOC
  
  float vout = 0.0, vin = 0.0, R1 = 30000.0, R2 = 7500.0;
  float SOC = 0;
  int value = 0;

  value = analogRead(pin);
  vout = (value * 5.0) / 1024.0;
  vin = vout / (R2 / (R1 + R2));

  SOC = vin/12.48 * 100;
  
  return SOC;
}

float getVoltageDC(int pin) {
  float vout = 0.0, vin = 0.0, R1 = 30000.0, R2 = 7500.0;
  float voltage;
  int value = 0;

  value = analogRead(pin);
  vout = (value * 5.0) / 1024.0;
  vin = vout / (R2 / (R1 + R2));

  voltage = vin - voltageAdj;
  if(voltage < 0) voltage = 0;
  return voltage;
}

float getCurrentDC(int pin) {
  unsigned int x = 0;
  float AcsValue = 0.0, Samples = 0.0, AvgAcs = 0.0, AcsValueF = 0.0;

  for (int x = 0; x < 150; x++) {     //Get 150 samples
    AcsValue = analogRead(A1);      //Read current sensor values
    Samples = Samples + AcsValue;   //Add samples together
    delay (3);                      // let ADC settle before next sample 3ms
  }

  AvgAcs = Samples / 150.0; //Taking Average of Samples
  AcsValueF = (2.5 - (AvgAcs * (5.0 / 1024.0)) ) / 0.185;

  return AcsValueF;
}

float getWindSpeed(int pin) {
  int sensorValue = analogRead(pin);
  float voltage = sensorValue * (5.0 / 1023.0);
  sensorVoltage = sensorValue * voltageConversionConstant;
  if (sensorVoltage <= voltageMin) {
    windSpeed = 0;
  } else {
    windSpeed = ((sensorVoltage - voltageMin) * windSpeedMax / (voltageMax - voltageMin)) * 2.232694;
  }

  x = windSpeed;
  if (x >= y ) {
    y = x;
  } else {
    y = y;
  }

  a = sensorVoltage;
  if (a >= b) {
    b = a;
  } else {
    b = b;
  }

  if (windSpeed != prevWindSpeed) {
    if (DEBUG) {
      Serial.print("Wind Speed: ");
      Serial.print(windSpeed);
      Serial.print("m/s\t\t");
      Serial.print("Sensor Voltage: ");
      Serial.println(sensorVoltage);
      Serial.print("V");
    }
    prevWindSpeed = windSpeed;

    return windSpeed;
  }
}

float getInsolation(int pin) {
  const int RESISTANCE = 10; // Resistance in thousands of ohms
  const int PANEL_LENGTH = 70; // Length of solar cell in mm
  const int PANEL_WIDTH = 25; // Width of solar cell in mm
  volatile float area;
  volatile float power;
  volatile float radiation;

  area = PANEL_LENGTH * PANEL_WIDTH / (100 * 100); // we are dividing by 10000 get the area in square meters
  power = pow(analogRead(pin), 2) / RESISTANCE ; // Calculating power
  radiation = power / area;

  return radiation;
}

float getVoltageAC(int pin) {
}

float getCurrentAC(int pin) {
}


void loop() {
  float readings[2];

  if (READING_TYPE == "electrical") {
    if (CURRENT_TYPE == "DC") {
      readings[0] = getVoltageDC(A0);
      readings[1] = getCurrentDC(A1);
    } else if (CURRENT_TYPE == "AC") {
      readings[0] = getVoltageAC(A0);
      readings[1] = getCurrentAC(A1);
    }
  } else if (READING_TYPE == "environmental") {
    readings[0] = getWindSpeed(A1);
    readings[1] = getInsolation(A0);
  } else if (READING_TYPE == "battery") {    
    int relayPin = 3;
    if(DEBUG) Serial.println("\nopening circuit...");
    digitalWrite(relayPin, LOW);
    if(DEBUG) Serial.println("Getting SOC...");
    readings[0] = getSOC(A0);
    readings[1] = 0.00;
    
    delay(1000);
    
    if(DEBUG) Serial.println("\nclosing circuit...");
    digitalWrite(relayPin, HIGH);
  }

  sendSensorReading(READING_TYPE, readings);
  delay(DELAY);
}
