const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require("util")
jest.mock('tone');

describe("Utility Functions (logic-only)", () => {
    let whichTemperament,
        temperamentChanged,
        getFrequency,
        _getFrequency,
        getCustomFrequency,
        resume,
        loadSamples,
        _loadSample,
        setupRecorder,
        getDefaultParamValues,
        createDefaultSynth,
        _createSampleSynth,
        _parseSampleCenterNo,
        _createBuiltinSynth,
        _createCustomSynth,
        __createSynth,
        createSynth,
        loadSynth,
        _performNotes,
        startSound,
        instruments,
        CUSTOMSAMPLES,
        instrumentsSource,
        trigger

    const turtle = "turtle1";

    beforeAll(() => {
        global.TextEncoder = TextEncoder;
        global.TextDecoder = TextDecoder;
        global.MediaRecorder = jest.fn();
        global.AudioBuffer = jest.fn()
        global.module = module;
        global.Tone = require("./index.js");

        const codeFiles = [
            "../../../lib/require.js",
            "../platformstyle.js",
            "../musicutils.js",
            "../synthutils.js",
            "../utils.js",
            "../../logo.js",
            "../../turtle-singer.js"
        ];
        let wrapperCode = '';

        codeFiles.forEach(filePath => {
            const fileCode = fs.readFileSync(path.join(__dirname, filePath), "utf8");
            wrapperCode += `\n${fileCode}`;
        })

        const dirPath = path.join(__dirname, "../../../sounds/samples")
        const sounds = fs.readdirSync(dirPath, 'utf8')
        sounds.forEach(fileName => {
            if (!fileName.endsWith(".js")) return;
            const filePath = path.join(dirPath, fileName);
            const fileCode = fs.readFileSync(filePath, "utf8");
            wrapperCode += `\n${fileCode}`;
        });

        const wrapper = new Function(`
            let metaTag = document.querySelector("meta[name=theme-color]");
            metaTag = document.createElement('meta');
            metaTag.name = 'theme-color';
            metaTag.content = "#4DA6FF";
            document.head?.appendChild(metaTag);
            ${wrapperCode}
            
            return {
                Synth: typeof Synth !== "undefined" ? Synth : undefined,
                instrumentsSource: typeof instrumentsSource !== "undefined" ? instrumentsSource : undefined,
                instruments: typeof instruments !== "undefined" ? instruments : undefined,
                SAMPLECENTERNO: typeof SAMPLECENTERNO !== "undefined" ? SAMPLECENTERNO : undefined,
                CUSTOMSAMPLES: typeof CUSTOMSAMPLES !== "undefined" ? CUSTOMSAMPLES : undefined,
                  };
        `);

        const results = wrapper();
        const Synth = results.Synth();
        instruments = results.instruments;
        CUSTOMSAMPLES = results.CUSTOMSAMPLES;
        SAMPLECENTERNO = results.SAMPLECENTERNO;
        instrumentsSource = results.instrumentsSource;
        createDefaultSynth = Synth.createDefaultSynth;
        whichTemperament = Synth.whichTemperament
        temperamentChanged = Synth.temperamentChanged
        getFrequency = Synth.getFrequency
        _getFrequency = Synth._getFrequency
        getCustomFrequency = Synth.getCustomFrequency
        resume = Synth.resume
        loadSamples = Synth.loadSamples
        _loadSample = Synth._loadSample
        setupRecorder = Synth.setupRecorder
        getDefaultParamValues = Synth.getDefaultParamValues
        _createSampleSynth = Synth._createSampleSynth
        _parseSampleCenterNo = Synth._parseSampleCenterNo
        _createBuiltinSynth = Synth._createBuiltinSynth
        _createCustomSynth = Synth._createCustomSynth
        __createSynth = Synth.__createSynth
        createSynth = Synth.createSynth
        loadSynth = Synth.loadSynth
        _performNotes = Synth._performNotes
        startSound = Synth.startSound
        trigger = Synth.trigger
    });

    describe("createDefaultSynth", () => {
        it("it should creates the default poly/default/custom synth for the specified turtle", () => {
            createDefaultSynth(turtle);
            expect(instruments[turtle]["electronic synth"]).toBeTruthy()
            expect(instruments[turtle]["custom"]).toBeTruthy();
            expect(instrumentsSource["electronic synth"]).toEqual([0, "electronic synth"]);
            expect(instrumentsSource["custom"]).toEqual([0, "custom"]);
        });
    });

    describe("_createBuiltinSynth", () => {
        it("it should creates a synth using builtin synths from Tone.js.", () => {
            const result = _createBuiltinSynth(turtle, "guitar", "sine", {});
            expect(result).toBeInstanceOf(Tone.Synth)
        });
        it("it should creates a synth using builtin synths from Tone.js.", () => {
            const result = _createBuiltinSynth(turtle, "guitar", "pluck", {});
            expect(result).toBeInstanceOf(Tone.PluckSynth)
        });
        it("it should creates a synth using builtin synths from Tone.js.", () => {
            const result = _createBuiltinSynth(turtle, "guitar", "noise3", {});
            expect(result).toBeInstanceOf(Tone.NoiseSynth)
        });
    })

    describe("_createCustomSynth", () => {
        it("it should creates an amsynth using Tone.js methods like AMSynth, FMSynth, etc.", () => {
            const result = _createCustomSynth("amsynth", {});
            expect(result).toBeInstanceOf(Tone.AMSynth);
        });
        it("it should creates a fmsynth using Tone.js methods like AMSynth, FMSynth, etc.", () => {
            const result = _createCustomSynth("fmsynth", {});
            expect(result).toBeInstanceOf(Tone.FMSynth);
        });
        it("it should creates a duosynth using Tone.js methods like AMSynth, FMSynth, etc.", () => {
            const result = _createCustomSynth("duosynth", {});
            expect(result).toBeInstanceOf(Tone.DuoSynth);
        });
        it("it should creates a testsynth using Tone.js methods like AMSynth, FMSynth, etc.", () => {
            const result = _createCustomSynth("testsynth", {});
            expect(result).toBeInstanceOf(Tone.PolySynth);
        });
    })

    describe("__createSynth", () => {
        beforeAll(() => {
            loadSamples()
        })
        it("it should creates a PolySynth based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            loadSamples()
            __createSynth(turtle, "guitar", "guitar", {});
            expect(instruments[turtle]["electronic synth"]).toBeInstanceOf(Tone.PolySynth)
        });
        it("it should creates a PolySynth based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            loadSamples()
            __createSynth(turtle, "guitar", "sine", {});
            expect(instruments[turtle]["electronic synth"]).toBeInstanceOf(Tone.PolySynth)
        });
        it("it should creates a amsynth based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            loadSamples()
            const instrumentName = "guitar"
            __createSynth(turtle, instrumentName, "amsynth", {});
            expect(instruments[turtle][instrumentName]).toBeInstanceOf(Tone.AMSynth)
        });

        it("it should creates a CUSTOMSAMPLES based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            CUSTOMSAMPLES['pianoC4'] = "pianoC4";
            CUSTOMSAMPLES['drumKick'] = "drumKick";
            const instrumentName = "guitar"
            __createSynth(turtle, instrumentName, "pianoC4", {});
            expect(instruments[turtle][instrumentName]).toBeInstanceOf(Tone.Sampler)
        });
        it("it should creates a CUSTOMSAMPLES based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            const instrumentName = "guitar"
            const sourceName = "http://testing.com"
            __createSynth(turtle, instrumentName, sourceName, {});
            expect(instruments[turtle][sourceName]["noteDict"]).toBe(sourceName)
            expect(instrumentsSource[instrumentName]).toStrictEqual([1, 'drum'])
        });
        it("it should creates a CUSTOMSAMPLES based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            const instrumentName = "guitar"
            const sourceName = "file://testing.jpg"
            __createSynth(turtle, instrumentName, sourceName, {});
            expect(instruments[turtle][sourceName]["noteDict"]).toBe(sourceName)
            expect(instrumentsSource[instrumentName]).toStrictEqual([1, 'drum'])
        });
        it("it should creates a CUSTOMSAMPLES based on the specified parameters, either using samples, built-in synths, or custom synths", () => {
            const instrumentName = "guitar"
            const sourceName = "drum"
            __createSynth(turtle, instrumentName, sourceName, {});
            expect(instrumentsSource[instrumentName]).toStrictEqual([1, 'drum'])
        });
    })

    describe("loadSynth", () => {
        it("it should loads a synth based on the user's input, creating and setting volume for the specified turtle.", () => {
            const result = loadSynth("turtle1", "flute");

            expect(result).toBeTruthy();
            expect(result).toBeInstanceOf(Tone.Sampler);

            expect(instruments.turtle1).toHaveProperty("flute");
        });
    });


    // describe("trigger", () => {

    //     it("it should triggers notes on a specified turtle with the given parameters.", () => {
    //         expect(trigger("turtle1", "A", 1, "piano", null, undefined, true, undefined)).toBe(undefined);
    //     });
    // });


    // ----------------
    // describe("_createSampleSynth", () => {
    //     it("creates voice synth correctly", () => {
    //         loadSamples()
    //         _loadSample("guitar")
    //         const result = _createSampleSynth("turtle1", "electronic synth", "guitar");
    //         expect(result).toBeInstanceOf(Tone.Sampler);
    //     });
    // })

    // describe("startSound", () => {
    //     it("it should start the sound", () => {
    //         expect(startSound("turtle1", "guitar", "A")).toBe(undefined);
    //     });
    //     it("it should start the sound", () => {
    //         expect(startSound("turtle1", "custom", "A")).toBe(undefined);
    //     });
    // });


    describe("_performNotes", () => {
        let mockSynth;
        let mockTone;
        let instance;
        mockSynth = {
            triggerAttackRelease: jest.fn(),
            chain: jest.fn(),
            connect: jest.fn(),
            setNote: jest.fn(),
            oscillator: { partials: [] }
        };

        beforeEach(() => {
            mockTone = {
                now: jest.fn(() => 0),
                Destination: {},
                Filter: jest.fn(),
                Vibrato: jest.fn(),
                Distortion: jest.fn(),
                Tremolo: jest.fn(),
                Phaser: jest.fn(),
                Chorus: jest.fn(),
                Part: jest.fn(),
                ToneAudioBuffer: {
                    loaded: jest.fn().mockResolvedValue(true)
                }
            };
            global.Tone = mockTone;

            // Mock synth
            mockSynth = {
                triggerAttackRelease: jest.fn(),
                chain: jest.fn(),
                connect: jest.fn(),
                setNote: jest.fn(),
                oscillator: { partials: [] }
            };

            // Create instance with required properties
            instance = {
                inTemperament: "equal",
                _performNotes,
                _getFrequency: jest.fn(),
                getCustomFrequency: jest.fn()
            };

            // Bind the provided function to our instance
            instance._performNotes = instance._performNotes.bind(instance);

            // Mock timers
            jest.useFakeTimers();
        });

        test('should handle custom temperament', () => {
            // Arrange
            instance.inTemperament = 'custom';
            const notes = 'A4+50';

            // Act
            instance._performNotes(mockSynth, notes, 1, null, null, false, 0);
      
            expect(mockSynth.triggerAttackRelease).toHaveBeenCalledWith(notes, 1, 0);
          });
        

        test('should handle null effects and filters', () => {
            // Arrange
            const notes = 'A4';
            const beatValue = 1;
            const paramsEffects = null;
            const paramsFilters = null;
            const setNote = false;
            const future = 0;

            // Act
            instance._performNotes(mockSynth, notes, beatValue, paramsEffects, paramsFilters, setNote, future);

            // Assert
            expect(mockSynth.triggerAttackRelease).toHaveBeenCalledWith(notes, beatValue, 0);
        });


        it("it should perform notes using the provided synth, notes, and parameters for effects and filters.", () => {
            const notes = 'A';
            const beatValue = 1;
            const future = 0;
            const paramsEffects = null;
            const paramsFilters = null;
            let tempSynth = instruments[turtle]["electronic synth"];
            tempSynth.start(Tone.now() + 0);
            expect(() => {
                if (paramsEffects === null && paramsFilters === null) {
                    try {
                        expect(_performNotes(tempSynth, "A", 1, null, null, true, 10)).toBe(undefined);
                    } catch (error) {
                        throw error;
                    }
                }
            }).not.toThrow();

        });
    });

    // describe("whichTemperament", () => {
    //     it("should get the temperament", () => {
    //         expect(whichTemperament()).toBe("equal");
    //     });
    // });
    // describe("temperamentChanged", () => {
    //     it("should change the temperament", () => {
    //         expect(temperamentChanged("equal", "Bb3")).toBe(undefined);
    //         expect(whichTemperament()).toBe("equal");
    //     });
    // });
    // describe("getFrequency", () => {
    //     it("it should return the frequency or frequencies.", () => {
    //         expect(getFrequency("Bb2", false)).toBe(116.54094037952261);
    //         expect(getFrequency("Bb3", false)).toBe(233.0818807590453);
    //         expect(getFrequency("A4", false)).toBe(440.00000000000085);
    //     });
    // });
    // describe("_getFrequency", () => {
    //     it("it should return the frequency or frequencies.", () => {
    //         expect(_getFrequency("Bb2", false, "equal")).toBe(116.54094037952261);
    //         expect(_getFrequency("Bb3", false, "equal")).toBe(233.0818807590453);
    //         expect(_getFrequency("A4", false, "equal")).toBe(440.00000000000085);
    //     });
    // });
    // describe("getCustomFrequency", () => {
    //     it("it should return the custom frequency or frequencies.", () => {
    //         expect(getCustomFrequency("Bb2", "equal")).toBe("B♭");
    //         expect(getCustomFrequency("A4", "equal")).toBe("A");
    //         expect(getCustomFrequency("Bb3", "equal")).toBe("B♭");
    //     });
    // });

    // describe("resume", () => {
    //     it("it should resume the Tone.js context", () => {
    //         expect(resume()).toBe(undefined);
    //         expect(Tone).toStrictEqual(Tone);
    //     });
    // });

    // describe("loadSamples", () => {
    //     it("it should loadSamples", () => {
    //         expect(loadSamples()).toBe(undefined);
    //     });
    // });

    // describe("_loadSample", () => {
    //     it("it should loads samples into the Synth instance.", () => {
    //         expect(_loadSample()).toBe(undefined);
    //     });
    // });

    // describe("setupRecorder", () => {
    //     it("it should sets up the recorder for the Synth instance.", () => {
    //         expect(setupRecorder()).toBe(undefined);
    //         function isToneInstance(instance) {
    //             return instance instanceof Tone.PolySynth ||
    //                 instance instanceof Tone.Sampler ||
    //                 instance instanceof Tone.Player;
    //         }

    //         for (const tur in instruments) {
    //             for (const synth in instruments[tur]) {
    //                 expect(isToneInstance(instruments[tur][synth])).toBe(true);
    //             }
    //         }
    //     });
    // });

    // describe("getDefaultParamValues", () => {
    //     it("it should retrieves default parameter values for various synthesizers.", () => {
    //         expect(getDefaultParamValues("sine")).toStrictEqual({
    //             oscillator: { type: 'sine' },
    //             envelope: { attack: 0.03, decay: 0.001, sustain: 1, release: 0.03 }
    //         })
    //         expect(getDefaultParamValues("square")).toStrictEqual({
    //             oscillator: { type: 'square' },
    //             envelope: { attack: 0.03, decay: 0.001, sustain: 1, release: 0.03 }
    //         })
    //         expect(getDefaultParamValues("triangle")).toStrictEqual({
    //             oscillator: { type: 'triangle' },
    //             envelope: { attack: 0.03, decay: 0.001, sustain: 1, release: 0.03 }
    //         })
    //         expect(getDefaultParamValues("sawtooth")).toStrictEqual({
    //             oscillator: { type: 'sawtooth' },
    //             envelope: { attack: 0.03, decay: 0.001, sustain: 1, release: 0.03 }
    //         })
    //     });
    // });


    // describe("createDefaultSynth", () => {
    //     it("it should creates the default poly/default/custom synth for the specified turtle.", () => {
    //         // expect(createDefaultSynth("guitar")).toBe(undefined);
    //     });
    // });

    // describe("_createSampleSynth", () => {
    //     it("it should creates a synth using existing samples: drums and voices.", () => {
    //         // expect(_createSampleSynth("","guitar","kick")).toBe(undefined);
    //     });
    // });
    // describe("_parseSampleCenterNo", () => {
    //     it("it should parses solfege notation and octave to determine the pitch number.", () => {
    //         expect(_parseSampleCenterNo("do", 2)).toBe("24");
    //         expect(_parseSampleCenterNo("do", 3)).toBe("36");
    //         expect(_parseSampleCenterNo("do", 4)).toBe("48");
    //         expect(_parseSampleCenterNo("do", 5)).toBe("60");
    //         expect(_parseSampleCenterNo("A", 5)).toBe("69");
    //         expect(_parseSampleCenterNo("A", 2)).toBe("33");
    //     });
    // });

    // describe("_createBuiltinSynth", () => {
    //     it("it should creates a synth using existing samples: drums and voices.", () => {
    //         // expect(_createBuiltinSynth("","amsynth","kick", {})).toBe(undefined);
    //     });
    // });

    // describe("_createCustomSynth", () => {
    //     it("it should creates a custom synth using Tone.js methods like AMSynth, FMSynth, etc.", () => {
    //         // expect(_createCustomSynth("builtinSynth1", {})).toBe(undefined);
    //     });
    // });

    // describe("__createSynth", () => {
    //     it("it should creates a synth based on the specified parameters, either using samples, built-in synths, or custom synths.", () => {
    //         expect(__createSynth("turtle1", "piano", "voiceSample1", {})).toBe(undefined);
    //     });
    // });

    // describe("createSynth", () => {
    //     it("it should creates a synth based on the user's input in the 'Timbre' clamp, handling race conditions with the samples loader.", () => {
    //         expect(createSynth("turtle1", "piano", "voiceSample1", {})).toBe(undefined);
    //     });
    // });



});
