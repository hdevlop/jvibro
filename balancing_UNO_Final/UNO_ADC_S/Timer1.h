//===================================================================================//
//=================================== initTimer1() ==================================//
void initTimer1(void){
  cli();  
  TCCR1A= 0;
  TCCR1B= 0;
  TCNT1= 0;
  TCCR1B |= (1 << CS12) | (0 << CS11) | (0 << CS10);  
  TCCR1B |= (1 << ICNC1); 
  TCCR1B |= (1 << ICES1); 
  TIFR1  |= (1 << ICF1);  
  TIMSK1 |= (1 << ICIE1) | (1 << TOIE1);
  sei(); 
}

//==================================================================================//
//============================= Interuption TIMER1 =================================//
ISR(TIMER1_CAPT_vect){
  startTimeKeeper = timer2.get_micros();
  i++;
  if(i==1) {
    C1 = ICR1;
  }
  if(i==2) {
    C2 = ICR1;
    diff = C2 - C1;
    PulseTime = (diff*16.0e-3);
    freq = 1000/PulseTime;
    i=0;
  }
}
ISR(TIMER1_OVF_vect){
  C1 =0; C2 = 0; i = 0;
}
