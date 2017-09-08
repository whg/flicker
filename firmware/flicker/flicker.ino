#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);


#define SEQUENCE_MAX_LENGTH 20
#define MAX_SEQUENCES 12
#define END_PATTERN 255

#define NUM_NEONS 6
const uint8_t NEON_PINS[NUM_NEONS] = { 4, 5, 6, 7, 8, 9 };

typedef struct {
  uint8_t pattern;
  float duration;
} State;

typedef State Sequence[SEQUENCE_MAX_LENGTH];

#define NUM_SEQUENCES 5
const Sequence SEQUENCES[NUM_SEQUENCES] = {
/* asdf */ { { 1, 1.0f }, { 2, 1.0f }, { 3, 1.0f }, { END_PATTERN, 0.f }},
/* tw */ { { 10, 2.0f }, { 11, 3.0f }, { 12, 3.5f }, { END_PATTERN, 0.f }},
/* seq */ { { 1, 1.0f }, { 2, 1.0f }, { 4, 1.0f }, { 8, 1.0f }, { 16, 1.0f }, { 32, 1.0f }, { END_PATTERN, 0.f }},
/* ttt */ { { 1, 1.0f }, { 2, 1.0f }, { 4, 1.0f }, { END_PATTERN, 0.f }},
/* t2 */ { { 1, 1.0f }, { 58, 1.0f }, { 1, 1.0f }, { END_PATTERN, 0.f }},
};


/// output the current state on NEON_PINS
void display( const State *state ) {
  for ( uint8_t i = 0; i < NUM_NEONS; i++ ) {
     digitalWrite( NEON_PINS[i], state->pattern & (1 << i) );
  }
}

void turnOnAll() {
  for ( uint8_t i = 0; i < NUM_NEONS; i++ ) {
     digitalWrite( NEON_PINS[i], 0 );
  }
}

/// Given a state find the next state in SEQUENCES
/// can be passed NULL which starts at returns first state
State* nextState( const State *state ) {
  static uint8_t sequenceCounter = 0;
  State *nextState = state + 1;

  if ( state == NULL ) {
    nextState = &SEQUENCES[0][0];
  } else if ( nextState->pattern == END_PATTERN ) {
    sequenceCounter = (sequenceCounter + 1) % NUM_SEQUENCES;
    nextState = &SEQUENCES[sequenceCounter][0];
  }
  
  return nextState;
}


State *currentState = NULL;
float lastChangeTime = 0.f;

#define MODE_PIN 15
#define SPEED_PIN A0

float speed = 1.0f;

enum mode_t { SEQUENCE, ALL_ON };
mode_t mode = SEQUENCE;

inline float mapf( float x, float in_min, float in_max, float out_min, float out_max ) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

bool readSpeed() {
  int val = map( analogRead( SPEED_PIN ), 0, 1 << 10, 0, 50);
  float newSpeed = mapf( val, 0, 50, 0.1, 5.0 );
  bool output = speed != newSpeed;
  speed = newSpeed;
  return output;
}

bool readModeButton() {
  static long lastChange = 0;
  static uint8_t lastState = 9;
  long now = millis();
  uint8_t currentState = digitalRead( MODE_PIN );
  if ( currentState == LOW && currentState != lastState && now - lastChange > 400 ) {
    mode = mode == SEQUENCE ? ALL_ON : SEQUENCE;
    lastChange = now;
    return true;
  }
  lastState = currentState;
  return false;
}

void setup() {

  Serial.begin(115200);

  for ( uint8_t i = 0; i < NUM_NEONS; i++ ) {
    pinMode( NEON_PINS[i], OUTPUT );
  }

  currentState = nextState( NULL );
  display( currentState );

  u8g2.begin();
  u8g2.setFont( u8g2_font_9x15_mr );
  
  PORTB |= (1 << PB0);

  pinMode( SPEED_PIN, INPUT );
  pinMode( MODE_PIN, INPUT_PULLUP );
}

void loop() {

  bool changed = false;
  
  switch ( mode ) {
    case SEQUENCE:
    {
      float timeNow = millis() * 0.001f;

      if ( timeNow - lastChangeTime >= currentState->duration * speed ) {
        currentState = nextState( currentState );
        display( currentState );
        lastChangeTime = timeNow;
        changed = true;
      }
    }
      break;
    case ALL_ON:
    {
      turnOnAll();
    }
      break;
  }

  if ( changed || readSpeed() || readModeButton() ) {
    u8g2.clearBuffer();
    char str[25];
    sprintf( str, "t-step: %d.%01ds", (int)speed, (int)(speed * 10) % 10 );
    u8g2.drawStr( 0,20, str );

    sprintf( str, "mode: %s", mode == SEQUENCE ? "sequence" : "all on" );
    u8g2.drawStr( 0,36, str );

    // _~_
    uint8_t s = currentState->pattern;
    sprintf( str, "%c%c%c%c%c%c", s & 0x20 ? '~' : '_', s & 0x10 ? '~' : '_', s & 0x08 ? '~' : '_', s & 0x04 ? '~' : '_', s & 0x02 ? '~' : '_', s & 0x01 ? '~' : '_' );
    u8g2.drawStr( 0, 52, str );

    u8g2.sendBuffer(); 
  }

  //delay(50);
}
