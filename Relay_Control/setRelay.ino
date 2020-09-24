String firstCharacter, secondCharacter;

void setRelay(String relay_status) {
    firstCharacter = relay_status.substring(0,1);
    secondCharacter = relay_status.substring(1,2);

    if(relay_status == "TR" || firstCharacter == "T" || secondCharacter == "R") {
        digitalWrite(relayPin, HIGH);
        Serial.println("Relay: HIGH");
    } else if (relay_status == "FL" || firstCharacter == "F" || secondCharacter == "L") {
        Serial.println("Relay: LOW");
        digitalWrite(relayPin, LOW);
    } else
        Serial.println("Relay: Nothing happened");
}