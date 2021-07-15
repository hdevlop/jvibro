const p5 = require('node-p5');

var ang_TW = 135;


var ang_O = 135;
var ang_OT = 238;

var Mag_O = 5.6;
var Mag_OT = 3.3;

function sketch(p) {
    p.setup = () => {
        p.createCanvas(200, 200);
        p.angleMode(p.DEGREES);
        let vO = p5.Vector.fromAngle(ang_O)
    }
    p.draw = () => {
        p.background(50);
        p.text('hello world!', 50, 100);
    }
}

let p5Instance = p5.createSketch(sketch);