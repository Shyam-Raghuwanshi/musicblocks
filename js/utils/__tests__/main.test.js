const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require("util")
jest.mock('tone');
describe("tests", () => {
    let createDefaultSynth,
        instruments,
        instrumentsSource,
        _createSampleSynth
 
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
            "../../turtle-singer.js",
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
                SAMPLECENTERNO: typeof SAMPLECENTERNO !== "undefined" ? SAMPLECENTERNO : undefined,
                  };
        `);

        const results = wrapper();
        const Synth = results.Synth();
        instrumentsSource = results.instrumentsSource
        instruments = results.instruments
        createDefaultSynth = Synth.createDefaultSynth;
        _createSampleSynth = Synth._createSampleSynth;
    });

    describe("createDefaultSynth", () => {
        it("creates the default poly/default/custom synth for the specified turtle", () => {
            const turtle = "turtle1";
            createDefaultSynth(turtle);
            expect(instruments[turtle]["electronic synth"]).toBeTruthy()
            expect(instruments[turtle]["custom"]).toBeTruthy();
            expect(instrumentsSource["electronic synth"]).toEqual([0, "electronic synth"]);
            expect(instrumentsSource["custom"]).toEqual([0, "custom"]);
        });
    });

    describe("_createSampleSynth", () => {
        it("it should creates a synth using existing samples: drums and voices.", () => {
            const turtle = "turtle1";
            loadSamples()
            expect(_createSampleSynth(turtle, "electronic synth", "piano")).tobe(undefined)
        });
    });


});
