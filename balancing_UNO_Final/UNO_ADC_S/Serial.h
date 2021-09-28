////==================================================================================//
////==================================================================================//
void split(String string, char c){
  String data = "";
  int bufferIndex = 0;
  for (int i = 0; i < string.length(); ++i){
    char c = string[i];
    if (c != ','){
      data += c;
    }
    else{
      data += '\0';
      strings[bufferIndex++] = data;
      data = "";
    }
  }
}
//==================================================================================//
//============================ SerialReadString ====================================//
void SerialReadString(){
  unsigned int  Sfreq;
  unsigned int baud;
  
  while( Serial.available() > 0 ) {
    char inChar = (char)Serial.read();
    String theChar = Serial.readStringUntil('\n');
    split(theChar, ',');

    if(theChar.length()>4){
       baud = strings[0].toFloat();
       Sfreq   = strings[1].toInt();
       Mfreq   = strings[2].toInt();
       Serial.println("ardok");
    }
    //=========================================//
    //=========================================//
    if(inChar == 'S'){
      ST_SP = false;
      Diagram = false;
    }

    if(inChar == 's'){
      ST_SP = true;   
    }
    
    if(inChar == 'g'){
      Diagram = true;
      Oscillo = false;
    }

    if(inChar == 'o'){
       Oscillo = true;
       Diagram = false;
    }
    //=========================================//
    //=========================================//
    if(inChar == 'b'){
      Serial.flush();
      digitalWrite(4,HIGH);
      digitalWrite(5,HIGH);
    }
    if(inChar == 'a'){
      Serial.flush();
      digitalWrite(4,LOW);
      digitalWrite(5,HIGH);
    }
    if(inChar == 'c'){
      digitalWrite(4,HIGH);
      digitalWrite(5,LOW);
    }
    if(inChar == 'd'){
      digitalWrite(4,LOW);
      digitalWrite(5,LOW);
    }

    if(inChar == 'B'){
      digitalWrite(7,HIGH);
      digitalWrite(6,HIGH);
    }
    if(inChar == 'A'){
      digitalWrite(7,LOW);
      digitalWrite(6,HIGH);
    }
    if(inChar == 'C'){
      digitalWrite(7,HIGH);
      digitalWrite(6,LOW);
    }
    if(inChar == 'D'){
      digitalWrite(7,LOW);
      digitalWrite(6,LOW);
    }
  }
}
