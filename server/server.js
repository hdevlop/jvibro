var express = require('express');
var app = express();
const http = require('http').Server(app);
var fft = require('fft-js').fft;
var fftUtil = require('fft-js').util;

http.listen(4000, () => {
    console.log('listening on *:3000');
})

const io = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5000"],
        methods: ["GET", "POST"]
    }
});

//===============================================================================//
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var port;
var parser;
var portName;
var bufferSize = 512;
var Tabs = "";

const ConfigPort = (PortCOM, baudRate) => {
    port = new SerialPort(PortCOM, { autoOpen: true, baudRate: baudRate });
    parser = port.pipe(new Readline({ delimiter: '\n' }))

    port.on('open', function () {
        console.log('Port open');
        portName = PortCOM;
    });

    port.on('error', function (err) {
        console.log('Error: ', err.message)
    })

    parser.on('data', function (data) {
        recDataOneChannel(data);
    });
}
//===============================================================================//
const recDataOneChannel = (data) => {
    if (data.length > 0) {
console.log(data);
        if(Tabs=="Diagram"){
            // var arrCap1 = data.split(",").map((i) => parseFloat((Number(i) * 0.00488 - 2.5).toFixed(3)));
            // arrCap1.pop();
            // console.log(arrCap1);
            // if (arrCap1.length == bufferSize) {
            //     io.sockets.emit('cap1', arrCap1);
            // }
        }

        if (Tabs == "VibroMeter") {
            var arrayData = data.split(",").map((i) => Number(i));
            Cap1 = parseFloat((arrayData[0] * 0.00488).toFixed(2));
            Cap2 = parseFloat((arrayData[1] * 0.00488).toFixed(2));

            // io.sockets.emit('data', Cap1);
            // io.sockets.emit('data2', Cap2);
        }
    }
}
//===============================================================================//
io.on('connection', (socket) => {
    console.log("connected");
    socket.on("SendToARD", (arg) => {
        if (portName != arg.PortCOM) ConfigPort(arg.PortCOM, arg.Baudrate);
        port.write(`${arg.Baudrate},${arg.Freqency},${arg.Samples},\n`)
    });
    socket.on("state", (arg) => {
        // if (arg == "START") port.write("s");
        // if (arg == "STOP")  port.write("S");
    });

    socket.on("Tabs", (arg) => {
        Tabs = arg;
        if (arg == "Diagram" && port != undefined )     port.write("d\n");
        if (arg == "VibroMeter" && port != undefined )  port.write("o\n");
    });
})






























            //     var phasors = fft(arrCap1);
            //     var fr = fftUtil.fftFreq(phasors, 512), mag = fftUtil.fftMag(phasors);

            //     const ffts = mag.map(a => (Math.abs(a) * 2 / bufferSize) * 2);
            //     var Peack = Math.max(...ffts);
            //     Peack = Peack.toFixed(3);
            //     console.log("peack:", Peack, "V");
            //     console.log("disp", (Peack / 0.025).toFixed(1), "milis");