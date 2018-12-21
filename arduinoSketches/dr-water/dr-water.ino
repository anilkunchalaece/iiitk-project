/*
 * Authors : Kunchala Anil & Co from 
 * Email : anilkunchalaece@gmail.com
 * Date : Dec 21 2018
 * 
 * This sketch is used to measure PH and Turbidity of water and send it to the Bluetooth App
 */


//#define DEBUG_ARRAY
#define DEBUG

#define TURBIDITY_PIN A0
#define PH_PIN A1
#define STATUS_LED 13

#define AVERAGE_SAMPLES 20 

//used to store the array of values to reduce the noise
int turbidityArray[AVERAGE_SAMPLES];
int phArray[AVERAGE_SAMPLES];

byte turbudityIndex = 0;
byte phIndex = 0;

float currentPhValue = 0;
float currentTurbudityValue = 0;

const int SAMPLING_INTERVAL = 50; // in Milli Seconds
const int BL_INTERVAL = 1000; // in Milli Seconds
unsigned long samplingStart = 0;
unsigned long blStart = 0;


void setup() {
  Serial.begin(9600);
  pinMode(STATUS_LED,OUTPUT);
  Serial.println("Dr-Water");
  samplingStart = millis();
  blStart = millis();
}//end of setup

void loop() {

  if(millis() - samplingStart > SAMPLING_INTERVAL) {
    
  samplingStart = millis(); // update the samplingStart
  getAndStoreSensorVoltages();
  
  }//end of samplingStart

  if(millis() - blStart > BL_INTERVAL){
  
    blStart = millis(); //update the blStart
    calculateTheSensorValues();
    
  }//end of blStart
  
}//end of loop


/*
 *This function is used to get the analogRead values from sensors and 
 *stores it in array for further processing. we are storing analogRead values
 *cause it is integer whereas sensor parameters will be in float
 */
void getAndStoreSensorVoltages(){
    //increment the index
    turbudityIndex = turbudityIndex + 1;
    phIndex = phIndex + 1;

    //if index reaches max reset the index
    if(turbudityIndex > AVERAGE_SAMPLES) turbudityIndex = 0;
    if(phIndex > AVERAGE_SAMPLES) phIndex = 0;

    turbidityArray[turbudityIndex] = getTurbidityVoltage();
    phArray[phIndex] = getPHVoltage();

}//end of getAndStoreSensorValues Fcn


void calculateTheSensorValues(){
  //average turbiduity and ph 
  const byte phArrayLength = sizeof(phArray) / sizeof(phArray[0]); //both arrays of same length
  int turbiditySum = 0;
  int phSum = 0;
  for (int i=0; i < phArrayLength; i++){
    turbiditySum = turbiditySum + turbidityArray[i];
    phSum = phSum + phArray[i];
  }

  float turbidityAverage = turbiditySum / phArrayLength;
  float phAverage = phSum / phArrayLength;

  currentTurbudityValue = calculateTurbudity(turbidityAverage);
  currentPhValue = calculatePh(phAverage);

  #ifdef DEBUG
  Serial.print("turbidity : ");
  Serial.print(currentTurbudityValue);
  Serial.print("\t Ph : ");
  Serial.println(currentPhValue);
  #endif
}

int getTurbidityVoltage(){
  int vol = analogRead(TURBIDITY_PIN);
#ifdef DEBUG_ARRAY
  Serial.print("turbidity voltage ");
  Serial.println(vol);
#endif
  return vol;  
}//end of getTurbidityVoltage Fcn

int getPHVoltage(){
  int vol= analogRead(PH_PIN);
 #ifdef DEBUG_ARRAY
  Serial.print("PH voltage ");
  Serial.println(vol);
#endif
  return vol;  
}//end of getPHVoltage Fcn



double calculateTurbudity(float averageTurbudityVoltage){

  //convert the value back to voltage
  float voltage = averageTurbudityVoltage * 5.0 / 1024.0;

  //convert the voltage to NTU
  //ref - https://www.dfrobot.com/wiki/images/2/2e/Relationship_diagram.jpg
  double ntuValue = -(1120.4 * voltage * voltage) + (5742.3 * voltage) - 4352.9;

#ifdef DEBUG_ARRAY
  Serial.print("voltage\t ");
  Serial.print(voltage);
  Serial.print(" Turbidity\t ");
  Serial.println(ntuValue);
#endif
  return ntuValue;
}//end of getTurbidity


double calculatePh(float averagePhVoltage){

  float voltage = averagePhVoltage * 5.0 / 1024.0;
  
  //converting the volatge to PH
  //ref - https://www.dfrobot.com/wiki/index.php/PH_meter(SKU:_SEN0161)
  float phValue = voltage * 3.5;
  
#ifdef DEBUG_ARRAY
  Serial.print("Voltage\t ");
  Serial.print(voltage);
  Serial.print(" PH\t ");
  Serial.println(phValue);
#endif
 return phValue;
}//end of getPH
