import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);

var Width = window.screen.width;
var Height = window.screen.height - 100;

var samplesCap1 = [];
let verticalPosCH1 = 0;
let AmpCH1 = 5;
let bufferSize = 512;

var State = false;

socket.on('data', (c1) => {
    // if (State == "START") samplesCap1.push(c1);
    if (State == "START") samplesCap1 = c1;
    if (State == "STOP") samplesCap1 = [];
});

const cap1 = p => {
    p.setup = () => {
        p.createCanvas(Width, Height);
    }
    p.draw = () => {
        p.background(100);
        p.clear();

        p.strokeWeight(3);
        p.stroke(232, 235, 52);
        p.noFill();

        p.beginShape();
        for (var i = 0; i < bufferSize; i++) {
            var x = p.map(i, 0, bufferSize, 0, p.width);
            var y = p.map(samplesCap1[i], -AmpCH1, AmpCH1, Height / 2, -Height / 2) + p.map(verticalPosCH1, -AmpCH1, AmpCH1, Height / 2, -Height / 2)
            p.vertex(x, y + Height / 2);
        }
        p.endShape();

        if (samplesCap1.length >= p.width) {
            samplesCap1.splice(0, bufferSize)
        }
    }
    p.myCustomRedrawAccordingToNewPropsHandler = ({ ArrRange, ArrPos, state }) => {
        if (ArrPos.posCH1) verticalPosCH1 = ArrPos.posCH1;
        if (ArrRange.rangeCH1) AmpCH1 = ArrRange.rangeCH1;
        State = state;
    }
};

export default cap1;