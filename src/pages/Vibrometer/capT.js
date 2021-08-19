
const { ipcRenderer } = window.require("electron");
var samplesCap3 = [];

var Width = 1040;
var Height = 800;
let verticalPosCH3 = 0;
let AmpCH3 = 10;
let bufferSize = 200;
var Check ,Amp;
var State = false;

ipcRenderer.on('capT', (event, c2) => {

    if (State == "START" && Check) samplesCap3.push(c2);

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
        p.stroke('#2fdf75');
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
    p.myCustomRedrawAccordingToNewPropsHandler = ({ rangeCH3, PosCh3, state, time ,check}) => {
        if (PosCh3) verticalPosCH3 = PosCh3;
        State = state;
        if (State == "STOP" || !check) samplesCap3 = [];
        bufferSize = time;
        Check = check;
    }
};

export default capT;