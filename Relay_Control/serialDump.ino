
//pretty simple function - read everything out of the serial buffer and whats coming and get rid of it
void serialDump(){
    Serial.println("dump");
  char temp;
  while(esp8266.available()){
    temp =esp8266.read();
    delay(1);//could play around with this value if buffer overflows are occuring
  }//while
  //Serial.println("DUMPED");
  
  
}//serial dump
