
//pretty simple function - read everything out of the // Serial buffer and whats coming and get rid of it
void serialDump(){
    // Serial.println("dump"); // x
  char temp;
  while(Serial.available()){
    temp =Serial.read(); // >
    delay(1); //could play around with this value if buffer overflows are occuring
  }
  //Serial.println("DUMPED"); // x
  
  
}//serial dump
