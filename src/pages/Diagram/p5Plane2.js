import p5 from 'p5';
import Roboto from './Seven_Seg.ttf'
var ls = require('local-storage');
const { ipcRenderer } = window.require("electron");

var CW = -1;
var count = 0;
var AmpArray = [];
var AngArray = [];
var StateRun = "";
var START = false;

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

var Range = 10;
var mup = 1;
var AVG = ls.get('AVG');
var unit = ls.get('unit');
var Divider = ls.get('Divider');
var data = ls.get('calibration');
var showResult = false;
var GO = false;
var Active = false;
var countNext = 0;
var ArrMag = [];
var ArrAng= [];
//=========================================================================//
//=========================================================================//
ipcRenderer.on('Bal2', (event, Mag1, Phs1) => {
    if (START && Active) {
        unit = "um";
        recv(Mag1 *mup, Phs1 * CW);
    }
});

const recv = (Amp, Ang) => {
    Amp = (Amp / Divider).toFixed(0);
    if(Amp<15) {Amp = 0;Ang=0;}
    AmpArray.push(Amp);
    AngArray.push(Ang);
    count += 1;
    if (count >= AVG) {
        AmpArray.splice(0, 1);
        count = 0;
        Aver(AmpArray, AngArray);
        AmpArray = [];
        AngArray = [];
    }
    if (count < AVG && count > 0) {
        angScreen = Ang;
        magScreen = Amp;

        if (StateRun == "FirstRun_b2") {
            Mag_O = Amp
            ang_O = Ang
        }
        if (StateRun == "TrialRun_b2") {
            if(GO){
                Mag_O = Amp;
                ang_O = Ang;
            }else{
                Mag_OT = Amp;
                ang_OT = Ang;
            }
        }
    }
}

const Aver = (A, G) => {
    const Averaging = (arr) => {
        var total = 0;
        for (var i = 0; i < arr.length; i++) {
            total += parseFloat(arr[i], 10);
        }
        var avg = total / arr.length;
        if (unit == "mV") avg = avg.toFixed(0)
        if (unit == "mils") avg = avg.toFixed(2);
        if (unit == "um") avg = avg.toFixed(0);
        return avg
    }

    if (StateRun == "FirstRun_b2") {
        Mag_O = Averaging(A);
        ang_O = Averaging(G);
        angScreen = ang_O;
        magScreen = Mag_O;
        showResult = false;
    }

    if (StateRun == "TrialRun_b2") {
        if(GO){
            Mag_O = Averaging(A);
            ang_O = Averaging(G);
        }else{
            Mag_OT = Averaging(A);
            ang_OT = Averaging(G);
        }
        showResult = true;
    }

}
//=========================================================================//
//=========================================================================//
const P5Plane2 = p => {
    var width = 510;
    var height = 510;
    p.setup = () => {
        p.createCanvas(width, height);
        p.angleMode(p.DEGREES);

        let X0 = width / 2;
        let Y0 = height / 2 - 1;
        v0 = p.createVector(X0, Y0);
        unit = ls.get('unit');
    };

    p.draw = () => {
        AVG = ls.get('AVG');
        Divider = ls.get('Divider');
        data = ls.get('calibration');

        if (data) {
            ang_TW = data.angle_left;
            Trial_W = data.Weight_left;
        }
        p.clear();

        V_O = p5.Vector.fromAngle(p.radians(ang_O), mapNum(Mag_O));
        V_OT = p5.Vector.fromAngle(p.radians(ang_OT), mapNum(Mag_OT));
        V_T = p5.Vector.sub(V_O, V_OT);

        let AngleBetween = p.degrees(V_O.angleBetween(V_T));
        ang_CW = Math.round((AngleBetween + ang_TW));  //(AngleBetween + ang_TW).toFixed(1);
        if (ang_CW > 360) ang_CW = ang_CW - 360;
        if (ang_CW < 0)   ang_CW = 360 + ang_CW ;
        Mass_CW = ((V_O.mag() / V_T.mag()) * Trial_W).toFixed(1)

        drawVec(v0, V_O, "red", ang_O);
        drawVec(v0, V_OT, "yellow", ang_OT);

        if (StateRun == "TrialRun_b2" && START == false && showResult) {
            angScreen = ang_CW * CW;
            magScreen = Mass_CW;
            unit = "GR";
            showResult = false;
            ArrMag[countNext] = magScreen;
            ArrAng[countNext] = ang_CW;
            ls.set("CorrMagP2", ArrMag);
            ls.set("CorrAngP2", ArrAng);
        
        }

        if (Active == false ) {
            angScreen = 0;
            magScreen = 0;
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
        var in_max = Range;
        var out_min = 0;
        var out_max = 210;

        return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    var mapVec = (number) => {
        var in_min = 0;
        var in_max = 210;
        var out_min = 0;
        var out_max = Range;

        return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    p.myCustomRedrawAccordingToNewPropsHandler = ({ State, Start, range, set1,go,active,arraycount  }) => {
        StateRun = State;
        START = Start;
        GO = go;
        Active = active;

        countNext = arraycount;

        if (set1) {
            angScreen = 0;
            magScreen = 0;
        }
        if (range == "A") {
            Range = 8000;
            mup = 5.1;
        }
        if (range == "B") {
            Range = 2000;
            mup = 1;
        }
        if (range == "C") {
            Range = 250;
            mup = 1 / 6;
        }
        if (range == "D") {
            Range = 25;
            mup = 1 / 10;
        }
    }
};

const sketch2 = (p) => {
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
        p.text(magScreen, 60, 160);
        p.text(angScreen * CW, 60, 330);

        p.textSize(100);
        p.text(unit, 420, 160);
        p.text("deg", 420, 330);
    };
};

export { P5Plane2, sketch2 };