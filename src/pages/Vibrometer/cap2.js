
const { ipcRenderer } = window.require("electron");
var samplesCap2 = [];

var Width = 1040;
var Height = 800;
let verticalPosCH1 = 0;
let AmpCH1 = 5;
let bufferSize = 200;
var Amp = 0;
var State = false;

ipcRenderer.on('cap2', (event, c2) => {

    if (State == "START") samplesCap2.push(c2);

});

ipcRenderer.on('disp2', (amp) => {
    Amp = amp;
});

const cap2 = p => {
    p.setup = () => {
        p.createCanvas(Width, Height);
    }
    p.draw = () => {
        p.background(100);
        p.clear();

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

        if (State == "START" && samplesCap2.length >= bufferSize) {
            samplesCap2 = [];
        }
    }
    p.myCustomRedrawAccordingToNewPropsHandler = ({ ArrRange, ArrPos, state, time }) => {
        if (ArrPos.posCH2) verticalPosCH1 = ArrPos.posCH2;
        if (ArrRange.rangeCH2) AmpCH1 = ArrRange.rangeCH2;
        State = state;
        // if (State == "STOP") samplesCap2 = [];
        bufferSize = time;
    }
};

export default cap2;