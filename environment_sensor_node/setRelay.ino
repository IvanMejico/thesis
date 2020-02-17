void setRelay(String relay_status) {
    String firstCharacter, secondCharacter;

    firstCharacter = relay_status.substring(0,1);
    secondCharacter = relay_status.substring(1,2);

    if(relay_status == "TR" || firstCharacter == "T" || secondCharacter == "R") {
        if(digitalRead(relayPin) == LOW) {
            digitalWrite(relayPin, HIGH);
            Serial.println("Relay: HIGH");
        }
    } else if (relay_status == "FL" || firstCharacter == "F" || secondCharacter == "L") {
        if(digitalRead(relayPin) == HIGH) {
            digitalWrite(relayPin, LOW);
            Serial.println("Relay: LOW");
        }
    } else
        Serial.println("Relay: Nothing happened");
}