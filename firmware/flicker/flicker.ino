
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


State *currentState;// = &SEQUENCES[0][0];
float lastChangeTime = 0.f;

void setup() {

  Serial.begin(115200);

  for ( uint8_t i = 0; i < NUM_NEONS; i++ ) {
    pinMode( NEON_PINS[i], OUTPUT );
  }

  currentState = nextState( currentState );
  display( currentState );
}

void loop() {

  float timeNow = millis() * 0.001f;

  if ( timeNow - lastChangeTime >= currentState->duration ) {
    currentState = nextState( currentState );
    display( currentState );
    lastChangeTime = timeNow;
  }
  
  Serial.print(currentState->pattern);
  Serial.print(", ");
  Serial.println(currentState->duration);
  delay(500);
}
