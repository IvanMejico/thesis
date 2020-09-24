void setRelay(String relay_status, int pin) {
    String firstCharacter, secondCharacter;

    firstCharacter = relay_status.substring(0,1);
    secondCharacter = relay_status.substring(1,2);

    // Serial.print("PIN:");
    // Serial.print(pin);
    
    if(relay_status == "TR" || firstCharacter == "T" || secondCharacter == "R") {
        if(digitalRead(pin) == HIGH) {
            digitalWrite(pin, LOW); // LOW closes "normally open" relay terminal.
            // Serial.println("Relay: LOW"); // x
        }
    } else if (relay_status == "FL" || firstCharacter == "F" || secondCharacter == "L") {
        if(digitalRead(pin) == LOW) {
            digitalWrite(pin, HIGH); // HIGH opens "normally open" relay terminal
            // Serial.println("Relay: HIGH"); // x
        }
    }
}