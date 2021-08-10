
const { ipcRenderer } = window.require("electron");
var samplesCap3 = [];

var Width = 1040;
var Height = 800;
let verticalPosCH3 = 0;
let AmpCH3 = 5;
let bufferSize = 200;
var Amp = 0;
var State = false;

ipcRenderer.on('capT', (event, c2) => {

    if (State == "START") samplesCap3.push(c2);

});

ipcRenderer.on('disp2', (amp) => {
    Amp = amp;
});

const capT = p => {
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
            var y = p.map(samplesCap3[i], -AmpCH3, AmpCH3, Height / 2, -Height / 2) + p.map(verticalPosCH3, -AmpCH3, AmpCH3, Height / 2, -Height / 2)
            p.vertex(x, y + Height / 2);
        }
        p.endShape();

        if (State == "START" && samplesCap3.length >= bufferSize) {
            samplesCap3 = [];
        }
    }
    p.myCustomRedrawAccordingToNewPropsHandler = ({ ArrRange, ArrPos, state, time }) => {
        if (ArrPos.posCH3) verticalPosCH3 = ArrPos.posCH3;
        // if (ArrRange.rangeCH2) AmpCH1 = ArrRange.rangeCH2;
        State = state;
        // if (State == "STOP") samplesCap2 = [];
        bufferSize = time;
    }
};

export default capT;