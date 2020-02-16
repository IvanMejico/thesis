// START: WIND SENSOR VARIABLES
double x = 0;
double y = 0;
double a = 0;
double b = 0;
const int sensorPin = A0; //Defines the pin that the anemometer output is connected
int readIndex = 0; // the index of the current reading
int totalWind= 0; // the running total
int averageWind = 0; // the average
int sensorValue = 0; //Variable stores the value direct from the analog pin
float sensorVoltage = 0; //Variable that stores the voltage (in Volts) from the anemometer being sent to the analog pin
float sensorVoltage2 = 0; //Variable that stores the voltage (in Volts) from the anemometer being sent to the analog pin
float windSpeed = 0; // Wind speed in meters per second (m/s)

float voltageConversionConstant = .004882814; //This constant maps the value provided from the analog read function, which ranges from 0 to 1023, to actual voltage, which ranges from 0V to 5V
int sensorDelay = 2000; //Delay between sensor readings, measured in milliseconds (ms)

//Anemometer Technical Variables
//The following variables correspond to the anemometer sold by Adafruit, but could be modified to fit other anemometers.

float voltageMin = .4; // Mininum output voltage from anemometer in mV.
float windSpeedMin = 0; // Wind speed in meters/sec corresponding to minimum voltage

float voltageMax = 2.0; // Maximum output voltage from anemometer in mV.
float windSpeedMax = 32; // Wind speed in meters/sec corresponding to maximum voltage

// END: WIND SENSOR VARIABLES

float getWindSpeed(){
    sensorValue = analogRead(sensorPin); //Get a value between 0 and 1023 from the analog pin connected to the anemometer

    // subtract the last reading:
    totalWind = totalWind - readings[readIndex];
    // read from the sensor:
    readings[readIndex] = sensorValue;
    // add the reading to the total:
    totalWind = totalWind + readings[readIndex];
    // advance to the next position in the array:
    readIndex = readIndex + 1;
    sensorVoltage2 = sensorValue * voltageConversionConstant; //Convert sensor value to actual voltage
    // if we’re at the end of the array…
    if (readIndex >= numReadings) {
        // …wrap around to the beginning:
        readIndex = 0;

        // calculate the average:
        averageWind = totalWind / numReadings;

        sensorVoltage = averageWind * voltageConversionConstant; //Convert sensor value to actual voltage

        //Convert voltage value to wind speed using range of max and min voltages and wind speed for the anemometer
        if (sensorVoltage <= voltageMin) {
            windSpeed = 0; //Check if voltage is below minimum value. If so, set wind speed to zero.
        } else {
            windSpeed = ((sensorVoltage - voltageMin) * windSpeedMax / (voltageMax - voltageMin))*2.232694; //For voltages above minimum value, use the linear relationship to calculate wind speed.
        }
    }

    //Max wind speed calculation

    x = windSpeed;
    if (x >= y) {
        y = x;
    } else {
        y = y;
    }

    //Max voltage calculation

    a = sensorVoltage;
    if (a >= b) {
        b = a;
    } else {
        b = b;
    }

    Serial.println("Wind Speed: " + String(windSpeed));
    return windSpeed;
}