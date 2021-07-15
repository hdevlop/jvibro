var express = require('express');
var app = express();
const http = require('http').Server(app);

http.listen(4000, () => {
    console.log('listening on *:2000');
})

const io = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5000", "http://192.168.1.93:5500"],
        methods: ["GET", "POST"]
    }
});
var start =false;

//===============================================================================//
io.on('connection', (socket) => {
    console.log("connected");
    socket.on("arduino", (arg) => {
        if(arg=="start"){
            start = true;
        }
        if (arg == "stop") {
            start = false;
        }
    });
    socket.on("balancing", (Amp,Ang) => {
        if (start){
            io.emit('balancing', Amp, Ang);
        }
    });

})

