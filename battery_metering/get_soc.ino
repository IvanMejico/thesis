const int voltageSensor = A0;

float vOUT = 0.0;
float vIN = 0.0;
float R1 = 30000.0;
float R2 = 7500.0;
float value = 0.0;


float fullVoltage = 13.04;
float drainVoltage = 12.93;
const float Vcal = 0.33;
const float Bcal = (fullVoltage - drainVoltage)/100; 
int percent;


int getSoc() {
  value = analogRead(voltageSensor);
  vOUT = (value * 5.0) / 1024.0;
  vIN = vOUT / (R2/(R1+R2));

  vIN -= Vcal;

  if(vIN > drainVoltage) {
      percent = 100;
      for(float i=fullVoltage; i>vIN; i-=Bcal) {
        percent -= 1;
      }  
    } else {
      percent = 0;
  }

  // For debugging only
  //  Serial.println("______________________________________________________________");
  //  Serial.print("vIN: ");
  //  Serial.println(vIN);
  //  Serial.print("SOC: ");
  //  Serial.print(percent);
  //  Serial.print("%");
  //  Serial.println("\n______________________________________________________________");


  return percent;
}
