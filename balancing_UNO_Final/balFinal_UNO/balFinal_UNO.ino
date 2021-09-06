#define ANALOG_IN 0
#ifndef cbi
#define cbi(sfr, bit) (_SFR_BYTE(sfr) &= ~_BV(bit))
#endif
#ifndef sbi
#define sbi(sfr, bit) (_SFR_BYTE(sfr) |= _BV(bit))
#endif
#define setbit(port,bit)  ((port) |=  (1<<bit)) 
#define clrbit(port,bit)  ((port) &= ~(1<<bit))
#include <stdlib.h>
uint16_t newData = 0;
uint16_t prevData = 0;
unsigned long startTimeKeeper, stopTimeKeeper, elapsedTime;
volatile boolean signalFlag = false ,pulseFlag = false;
//==================================================================================//
//==================================================================================//
#define ADCPIN 0
//==================================================================================//
//================================ Start Stop ADC ==================================//
void startADC(void)
{
  sbi(ADCSRA, ADEN);
  sbi(ADCSRA, ADSC);
}
void stopADC(void)
{
  cbi(ADCSRA, ADEN);
}
//==================================================================================//
//================================ Variable Setting ================================//
long BAUDRATE = 115200;
int samples = 512;
volatile uint8_t flag = false;
char startSendData = false;
int  ADC_CAP1[512];
byte Ch_Select = 0;
int ADCCounter1;
int ADCCounter2;
float C1,C2,diff,PulseTime;
char i =0;
bool startBal = false;
bool startOscillo = false;
//==================================================================================//
//================================== initADC() =====================================//
void initADC(void)
{
  cli();
  ADCSRA = 0;                // clear ADCSRA register
  ADCSRB = 0;                // clear ADCSRB register                  
  
  ADMUX  |= (1 << REFS0);    // set reference voltage 
  sbi(ADCSRA, ADPS2);       // Define various ADC prescaler
  sbi(ADCSRA, ADPS1);       // Define various ADC prescaler
  sbi(ADCSRA, ADPS0);       // Define various ADC prescaler

  ADCSRA |= (1 << ADEN);     // enable ADC
  ADCSRA |= (1 << ADATE);    // enable auto trigger
  ADCSRA |= (1 << ADIE);
  ADMUX = 0b01000000;
  ADCSRB = (( 1<<ADTS2 ) | ( 1<<ADTS0 ));
  sei();
}
//==================================================================================//
//================================== initTimer1() ==================================//
void initTimer1(void){
  cli();
  TCCR1A = 0;
  TCCR1B = 0;
  TCNT1  = 0;

  OCR1A = 15624;            // compare match register 16MHz/256/2Hz 15624 7810 31249
  TCCR1B |= (1 << WGM12);   // CTC mode
  TCCR1B |= (0 << CS12) | (0 << CS11) | (1 << CS10);
  TIMSK1 |= (1 << OCIE1A);  // enable timer compare interrupt
  sei(); 
}

//==================================================================================//
//================================= Interuption TIMER1 =============================//
ISR(TIMER1_COMPA_vect){
  Ch_Select = !Ch_Select;
  PORTB   = Ch_Select;
}
//==================================================================================//
//=================================== Interuption ADC ==============================//
ISR (ADC_vect){
  TIFR1 = ( 1<<OCF1B );
  ADC_CAP1[ADCCounter1++] = ADC;
  PIND = (1<<PD4);
  prevData = newData;
  newData = ADC;
  
  if (ADCCounter1 == samples ){
    flag = true;
    ADCCounter1 = 0;
  }
}
//==================================================================================//
//==================================== Setup() =====================================//
void setup() {
  Serial.begin(BAUDRATE);
  pinMode(8, OUTPUT);
  pinMode(12,OUTPUT);//output pin
  pinMode(4, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(2), Tachometer, RISING);
  attachInterrupt(digitalPinToInterrupt(3), signalReceived, RISING );
  initADC();
  initTimer1();
  startADC();
}
//==================================================================================//
String strings[10];
int Time;
//==================================================================================//
void loop() {
  SerialReadString();
  if(flag){
    for (int i = 0; i < samples; i++){
      Serial.print(ADC_CAP1[i]) ;
      Serial.write(',');
    }
    Serial.write('\n');
    flag = false;
  }
}
//==================================================================================//
//==================================================================================//
void SerialRead(){
  if ( Serial.available() > 0 ) {
    char theChar = Serial.read();
    switch (theChar) {
      case 's':      
        startSendData = true;
        break;
      case 'S':      
        startSendData = false;
        break;
      case 'B':      
        startBal = true;
        startOscillo = false;
        break;
      case 'O':      
        startBal = false;
        startOscillo = true;
        break;
    }
  }
}

//==================================================================================//
//==================================================================================//
void SerialReadString(){
  while( Serial.available() > 0 ) {
    String theChar = Serial.readStringUntil('\n');
    split(theChar, ',');
    
    BAUDRATE = strings[0].toInt();
    int  freq   = strings[1].toInt();
//    samples = strings[2].toInt();

    if(freq == 256)  OCR1A = 62499;
    if(freq == 512)  OCR1A = 31249;
    if(freq == 1024) OCR1A = 15624;
    if(freq == 2048) OCR1A = 7810;
    if(freq == 4096) OCR1A = 3906;
    if(freq == 8192) OCR1A = 1953;
    if(freq == 16384) OCR1A = 976;
    if(freq == 32768) OCR1A = 488;
  }
}
//==================================================================================//
//==================================================================================//
int split(String string, char c){
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
  return bufferIndex;
}
//==================================================================================//
void Tachometer() {
 startTimeKeeper = micros();
}
//==================================================================================//
void signalReceived() {
 stopTimeKeeper = micros();
 elapsedTime = stopTimeKeeper - startTimeKeeper;
 elapsedTime = floor(elapsedTime);
 float Phase = (elapsedTime * 360)/100000 ;
// Serial.println(Phase + 90) ;

 signalFlag = true;
}
