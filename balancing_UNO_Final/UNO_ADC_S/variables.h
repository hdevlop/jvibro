#include <eRCaGuy_Timer2_Counter.h>
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

#include <movingAvg.h>        
movingAvg avgFr(10);

long BAUDRATE = 115200;
int samples = 570;
volatile uint8_t flag = false;
char startSendData = false;
int  ADC_CAP1[570];
byte Ch_Select = 0;
int ADCCounter1;
long startTimeKeeper =0;
int Phase1,Phase2;
float freq=0;
float PulseTime;
unsigned int diff ,C1,C2;
int i = 0,j=0;
String strings[5];
int balancing = 0;
unsigned int capT; 
unsigned int capX = A0; 

bool ST_SP = false;
bool Calib = false;
bool Oscillo = false;
bool Diagram = false;
unsigned int AmpCap;

unsigned int minVal = 1024;
unsigned int maxVal = 0;
unsigned int  Mfreq = 10;
float multiplier = 1;
int  deg_Amp = 0;
