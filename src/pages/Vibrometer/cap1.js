
const { ipcRenderer } = window.require("electron");
var Width = 1040;
var Height = 800;

var samplesCap1 = [];
let verticalPosCH1 = 0;
let AmpCH1 = 5;
let bufferSize = 512;

var State = false;
var Freq = 0;
var Amp = 0;

ipcRenderer.on('cap1', (event, c1) => {
    if (State == "START") samplesCap1.push(c1);
})

const cap1 = p => {
    p.setup = () => {
        p.createCanvas(Width, Height);
    }
    p.draw = () => {
        p.background(100);
        p.clear();

        p.strokeWeight(2);
        p.stroke(232, 235, 52);
        p.noFill();

        p.beginShape();
        for (var i = 0; i < bufferSize; i++) {
            var x = p.map(i, 0, bufferSize, 0, p.width);
            var y = p.map(samplesCap1[i], -AmpCH1, AmpCH1, Height / 2, -Height / 2) + p.map(verticalPosCH1, -AmpCH1, AmpCH1, Height / 2, -Height / 2)
            p.vertex(x, y + Height / 2);
        }
        p.endShape();

        if (State == "START" && samplesCap1.length >= bufferSize) {
            samplesCap1 = [];
        }
    }
    p.myCustomRedrawAccordingToNewPropsHandler = ({ rangeCH1, PosCh1, state,time }) => {
        if (PosCh1) verticalPosCH1 = PosCh1;
        State = state;
        if (State == "STOP") samplesCap1 = [];
        bufferSize = time;
    }
};

export default cap1;