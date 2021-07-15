import p5 from 'p5';
import Roboto from './Seven_Seg.ttf'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);

var CW = -1;
var count = 0;
var AmpArray = [];
var AngArray = [];
var StateRun = "";
var StopB = false;

var v0;
var V_O;
var V_OT;
var V_T;

var ang_TW = 315;
var Trial_W = 74;

var ang_O = 0;
var ang_OT = 0;

var Mag_O = 0;
var Mag_OT = 0;

var ang_CW = 0;
var Mass_CW = 0;

var angScreen = 0
var magScreen = 0

var unit = "MILS"
//=========================================================================//
//=========================================================================//
socket.on('balancing', (Amp, ang) => {
    recv(Amp, ang);
    Aver(Amp, ang);
});

const recv = (Amp, Ang) => {
    // count += 1;
    // AmpArray.push(Amp);
    // AngArray.push(Ang);
    // if (count == 5) {
    //     count = 0;
    //     Aver(AmpArray, AngArray);
    //     AmpArray = [];
    //     AngArray = []
    // }
}

const Aver = (A, G) => {
    const Averaging = (arr) => {
        var total = 0;
        for (var i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        var avg = total / arr.length;

        return arr
    }

    console.log(StateRun);

    if (StateRun == "FirstRun"){
        Mag_O = Averaging(A);
        ang_O = parseInt(Averaging(G) * CW);

        angScreen = ang_O;
        magScreen = Mag_O;
    }

    if (StateRun == "TrialRun") {
        Mag_OT = Averaging(A);
        ang_OT = parseInt(Averaging(G) * CW);

        angScreen = ang_OT ;
        magScreen = Mag_OT ;
    }

}
//=========================================================================//
//=========================================================================//
const P5Plane1 = p => {
    var width = 420;
    var height = 420;
    p.setup = () => {
        p.createCanvas(width, height);
        p.angleMode(p.DEGREES);
        let X0 = width / 2;
        let Y0 = height / 2;
        v0 = p.createVector(X0, Y0);
    };

    p.draw = () => {
        p.clear();

        V_O = p5.Vector.fromAngle(p.radians(ang_O), mapNum(Mag_O));
        V_OT = p5.Vector.fromAngle(p.radians(ang_OT), mapNum(Mag_OT));
        V_T = p5.Vector.sub(V_O, V_OT);

        let AngleBetween = p.degrees(V_O.angleBetween(V_T));
        ang_CW = parseInt(AngleBetween + ang_TW);
        Mass_CW = ((V_O.mag() / V_T.mag()) * Trial_W).toFixed(1)

        p.fill("red");
        p.textSize(20);

        drawVec(v0, V_O, "red", ang_O);
        drawVec(v0, V_OT, "yellow", ang_OT);

        if (StateRun == "TrialRun" && StopB == true) {
            angScreen = ang_CW * CW;
            magScreen = Mass_CW;
            unit = "GR"
        }

    };
    //=====================================================================//
    //=====================================================================//
    const drawVec = (base, vec, myColor, angle) => {
        p.push();
        p.stroke(myColor);
        p.strokeWeight(4);
        p.fill(myColor);
        p.translate(base.x, base.y);
        p.line(0, 0, vec.x, vec.y);

        p.rotate(angle);
        let arrowSize = 10;
        p.translate(vec.mag() - arrowSize, 0);
        p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        p.pop();
    }
    //=====================================================================//
    var mapNum = (number) => {
        var in_min = 0;
        var in_max = 10;
        var out_min = 0;
        var out_max = 210;

        return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    var mapVec = (number) => {
        var in_min = 0;
        var in_max = 210;
        var out_min = 0;
        var out_max = 10;

        return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    p.myCustomRedrawAccordingToNewPropsHandler = ({ State ,Stop }) => {
        console.log(State);
        StateRun = State;
        StopB = Stop;
    }
};

const sketch = (p) => {
    var myFont;

    p.setup = () => {
        myFont = p.loadFont(Roboto);
        p.createCanvas(600, 400);
    }

    p.myCustomRedrawAccordingToNewPropsHandler = (state) => {

    };

    p.draw = () => {
        p.background(100);
        p.clear();
        p.fill("white");
        p.textSize(160);
        p.textFont(myFont);
        p.text(magScreen, 100, 160);
        p.text(angScreen * CW, 100, 330);

        p.textSize(100);
        p.text(unit, 400, 160);
        p.text("deg", 400, 330);
    };
};

export { P5Plane1, sketch };