class Sampler {
  constructor(noteDict) {
    this.noteDict = noteDict;
    this.toDestination = jest.fn().mockReturnThis();
    this.connect = jest.fn().mockReturnThis();
    this.start = jest.fn().mockReturnThis();
    this.triggerAttack = jest.fn().mockReturnThis();
    this.volume = jest.fn().mockReturnThis();
  }
}

class Player {
  constructor(sample) {
    this.sample = sample;
    this.toDestination = jest.fn().mockReturnThis();
    this.connect = jest.fn().mockReturnThis();
  }
}

class AMSynth {
  toDestination() {
    return this;
  }
}
class FMSynth {
  toDestination() {
    return this;
  }
}
class DuoSynth {
  toDestination() {
    return this;
  }
}

class PluckSynth {
  constructor(synthOptions) {
    this.synthOptions = synthOptions
  }
  toDestination() {
    return this;
  }
}

class Synth {
  constructor(synthOptions) {
    this.synthOptions = synthOptions
  }
  toDestination() {
    return this;
  }
}
class NoiseSynth {
  constructor(synthOptions) {
    this.synthOptions = synthOptions
  }
  toDestination() {
    return this;
  }
}

class PolySynth {
  constructor(synth, count) {
    this.synth = synth;
    this.count = count;
    this.triggerAttack = jest.fn().mockReturnThis();
    this.start = jest.fn().mockReturnThis();
    this.triggerAttackRelease = jest.fn().mockReturnThis();
  }

  toDestination() {
    return this;
  }
  connect() {
    return this
  }
}

class context {
  static resume() {
  }
}

class ToneAudioBuffer {
  static async loaded() {
    return this
  }
}

const Tone = {
  AMSynth,
  PolySynth,
  Player,
  Sampler,
  Synth,
  PluckSynth,
  NoiseSynth,
  DuoSynth,
  context,
  FMSynth,
  Frequency: jest.fn(() => {
    return {
      toFrequency: jest.fn().mockReturnThis()
    }
  }),
  ToneAudioBuffer,
  getContext: jest.fn(() => {
    return {
      createMediaStreamDestination: jest.fn().mockReturnThis()
    }
  }),
  gainToDb: jest.fn().mockReturnThis(),
  start: jest.fn(),
  now: jest.fn().mockReturnThis(),
  Context: jest.fn().mockReturnThis(),
  Instrument: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn(),
  })),
  doNeighbor:jest.fn().mockReturnThis(),
};

module.exports = Tone;
