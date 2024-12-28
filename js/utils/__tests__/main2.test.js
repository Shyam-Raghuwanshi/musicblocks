// __mocks__/tone.js
class AMSynth {
    toDestination() {
        return this;
    }
}

class PolySynth {
    constructor(synth, count) {
        this.synth = synth;
        this.count = count;
    }
    
    toDestination() {
        return this;
    }
}

const Tone = {
    AMSynth,
    PolySynth,
    start: jest.fn(),
    Context: jest.fn()
};

module.exports = { Tone };

// test file
jest.mock('tone');
const { Tone } = require('tone');

describe("createDefaultSynth", () => {
    beforeEach(() => {
        instruments = {};
        instruments["turtle1"] = {};
        instrumentsSource = {};
    });

    it("creates the default poly/default/custom synth for the specified turtle", () => {
        const turtle = "turtle1";
        createDefaultSynth(turtle);
        
        expect(instruments[turtle]["electronic synth"]).toBeTruthy();
        expect(instruments[turtle]["custom"]).toBeTruthy();
        expect(instrumentsSource["electronic synth"]).toEqual([0, "electronic synth"]);
        expect(instrumentsSource["custom"]).toEqual([0, "custom"]);
    });
});