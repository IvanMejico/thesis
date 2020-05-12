const float Vcal = 0.33;
const float Bcal = 0.005; 

float vOUT = 0.0;
float vIN = 0.0;
float R1 = 30000.0;
float R2 = 7500.0;
float value = 0.0;


float fullVoltage = 13.0;
float drainVoltage = fullVoltage - 1; // This is just nominal value
int percent;


int getSoc() {
  value = analogRead(voltageSensor);
  vOUT = (value * 5.0) / 1024.0;
  vIN = vOUT / (R2/(R1+R2));

  vIN -= Vcal;

  if(vIN > drainVoltage) {
    percent = 100;
    for(float i=fullVoltage; (i>=vIN); i-=Bcal) {
      percent -= 1;
    }  
  } else {
    percent = 0; // Assuming that 0% will be right around fullVoltage-1, the vIN must not be lower.
  }
  // Serial.println("---");
  // Serial.print("vIN: ");
  // Serial.println(vIN);
  // Serial.print("SOC: ");
  // Serial.print(percent);
  // Serial.print("%");

  return percent;
}
