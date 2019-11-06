void setRelay(String relay_status) {
    if(relay_status == "TR") {
        digitalWrite(relayPin, HIGH);
        Serial.println("Relay: HIGH");
    } else if (relay_status == "FL") {
        Serial.println("Relay: LOW");
        digitalWrite(relayPin, LOW);
    } else
        Serial.println("Relay: Nothing happened");
}