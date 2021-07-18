var express = require('express');
var app = express();
const http = require('http').Server(app);
var fft = require('fft-js').fft;
var fftUtil = require('fft-js').util;

http.listen(4000, () => {
    console.log('listening on *:4000');
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
var arrCap1 = [];
var arrCap2 = [];
var arrayData = [];
var freq;
var phase;
var state = "";

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
    if (data.length > 10) {
        arrayData = data.split(";");
        if (arrayData.length > 0) {

            arrCap1 = arrayData[0].split(",").map((i) => parseFloat((Number(i) * 0.00488 - 2.5).toFixed(3)));
            freq = arrayData[1];
            phase = arrayData[2];
            arrCap1.pop();

            if (arrCap1.length == bufferSize) {
                var maxCap1 = Math.max(...arrCap1)
                var minCap1 = Math.min(...arrCap1)
                var ampCap1 = maxCap1 - minCap1;
                var disp1 = (ampCap1 / 0.025).toFixed(1);

                io.sockets.emit('Amp1', ampCap1);
                io.sockets.emit('disp1', disp1);
                io.sockets.emit('freq',  freq);
                io.sockets.emit('phase', phase);

                io.sockets.emit('balancing1', disp1, phase);
            }
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
        state = arg
        // if (arg == "START") port.write("s");
        // if (arg == "STOP")  port.write("S");
    });
})