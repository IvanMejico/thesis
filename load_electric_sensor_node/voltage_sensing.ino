float getVoltage() {
  emon1.calcVI(20,2000);         // Calculate all. No.of half wavelengths (crossings), time-out
  float supplyVoltage   = emon1.Vrms;             //extract Vrms into Variable
  return supplyVoltage;
}
