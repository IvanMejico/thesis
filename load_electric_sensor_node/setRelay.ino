void setRelay(String relay_status, int relay_pin) {
    String firstCharacter, secondCharacter;

    firstCharacter = relay_status.substring(0,1);
    secondCharacter = relay_status.substring(1,2);

    if(relay_status == "TR" || firstCharacter == "T" || secondCharacter == "R") {
        if(digitalRead(relay_pin) == HIGH) {
            digitalWrite(relay_pin, LOW); // LOW closes "normally open" relay terminal.
            // Serial.println("Relay: LOW");
        }
    } else if (relay_status == "FL" || firstCharacter == "F" || secondCharacter == "L") {
        if(digitalRead(relay_pin) == LOW) {
            digitalWrite(relay_pin, HIGH); // HIGH opens "normally open" relay terminal
            // Serial.println("Relay: HIGH");
        }
    }
}