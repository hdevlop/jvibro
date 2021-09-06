#include "variables.h"
#include "Timer1.h"
#include "Serial.h"
//==================================================================================//
//==================================== Setup() =====================================//
void setup() {
  timer2.setup();
  Serial.begin(115200);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  
  pinMode(8, INPUT);
  pinMode(9, INPUT);

  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(A2, INPUT);
  
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(13,OUTPUT);
  
  digitalWrite(4,HIGH);
  digitalWrite(5,HIGH);
  digitalWrite(6,HIGH);
  digitalWrite(7,HIGH);
  attachInterrupt(digitalPinToInterrupt(2), phaseCalcA, RISING );
  attachInterrupt(digitalPinToInterrupt(3), phaseCalcB, RISING );
  initTimer1();
  avgFr.begin();
}
//==================================================================================//
//====================================== LOOP ======================================//

void loop() {
  SerialReadString();
  while(Calib){
    SerialReadString();
  }
  
  while(Oscillo){
    SerialReadString();
    if(ST_SP){   
      Serial.print(analogRead(A0));
      Serial.write(',');
      Serial.print(analogRead(A1));
      Serial.write(',');
      Serial.print(analogRead(A2));
      Serial.write(',');
      Serial.print(freq);
      Serial.write('\n');
    }
  }
  
  while(Diagram){
    if(ST_SP){
      Serial.print(analogRead(A0));
      Serial.write(',');
      Serial.print(analogRead(A1));
      Serial.write(',');
      Serial.print(freq);
      Serial.write(',');
      Serial.print(Phase1);
      Serial.write(',');
      Serial.print(Phase2);
      Serial.write('\n');
    }
    SerialReadString();
  }
}
//==================================================================================//
void phaseCalcA() {
  if(PulseTime>0){
    long stopTimeKeeper = timer2.get_micros();
    long elapsedTime = stopTimeKeeper - startTimeKeeper;
    float Ph = (elapsedTime*360)/(PulseTime*1.0e3) ;
    Ph = (Ph + 90) - 360;
    if(Ph<0) Ph =360 + Ph;
    Phase1 = round(Ph);
  }
}
void phaseCalcB() {
  if(PulseTime>0){
    long stopTimeKeeper = timer2.get_micros();
    long elapsedTime = stopTimeKeeper - startTimeKeeper;
    float Ph = (elapsedTime*360)/(PulseTime*1.0e3) ;
    Ph = (Ph + 90) - 360;
    if(Ph<0) Ph =360 + Ph;
    Phase2 = round(Ph);
  }
}
