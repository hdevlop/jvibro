import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);

var samplesCap2 = [];

var Width = window.screen.width;
var Height = window.screen.height - 100;
let verticalPosCH1 = 0;
let AmpCH1 = 5;
let bufferSize = 512;
var Amp = 0;
var State = false;

socket.on('cap2', (c2) => {
    // if (State == "START") samplesCap2.push(c2);
    if (State == "START") samplesCap2 = c2;
    if (State == "STOP") samplesCap2 = [];
});

socket.on('disp2', (amp) => {
    Amp = amp;
});

const cap2 = p => {
    p.setup = () => {
        p.createCanvas(Width, Height);
    }
    p.draw = () => {
        p.background(100);
        p.clear();

        p.textSize(32);
        p.fill("red");
        p.text('Amplitude Cap2 = ' + Amp, 950, 50);

        p.strokeWeight(3);
        p.stroke('red');
        p.noFill();

        p.beginShape();
        for (var i = 0; i < bufferSize; i++) {
            var x = p.map(i, 0, bufferSize, 0, p.width);
            var y = p.map(samplesCap2[i], -AmpCH1, AmpCH1, Height / 2, -Height / 2) + p.map(verticalPosCH1, -AmpCH1, AmpCH1, Height / 2, -Height / 2)
            p.vertex(x, y + Height / 2);
        }
        p.endShape();

        if (samplesCap2.length >= p.width) {
            samplesCap2.splice(0, bufferSize);
        }
    }
    p.myCustomRedrawAccordingToNewPropsHandler = ({ ArrRange, ArrPos, state }) => {
        if (ArrPos.posCH2) verticalPosCH1 = ArrPos.posCH2;
        if (ArrRange.rangeCH2) AmpCH1 = ArrRange.rangeCH2;
        State = state;
        if (State == "STOP") samplesCap2 = [];
    }
};

export default cap2;