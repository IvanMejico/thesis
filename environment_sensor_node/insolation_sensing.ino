#define ANALOG_PIN A0 // Analog pin
#define RESISTANCE 10 // Resistance in thousands of ohms
#define PANEL_LENGTH 70 // Length of solar cell in mm
#define PANEL_WIDTH 25 // Width of solar cell in mm
volatile float area;
volatile float power;
volatile float radiation;

float getInsolation() {
    area = PANEL_LENGTH * PANEL_WIDTH / (100*100); // we are dividing by 10000 get the area in square meters
    power = pow(analogRead( ANALOG_PIN ), 2) / RESISTANCE ; // Calculating power
    radiation = power / area;
    return radiation;
}