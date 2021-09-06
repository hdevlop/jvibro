const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
//====================================================================================//
//====================================================================================//
var mainWindow;
function createWindow() {
  const win = new BrowserWindow({
    width: 1290,
    height: 1034,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false,
    frame: true,
    skipTaskbar: false,
    resizable: true,
    alwaysOnTop: false,
    offscreen: true,
  });
  console.log('main');
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  if (isDev) {
    // win.webContents.openDevTools();
    //win.maximize();
  }


  win.once('ready-to-show', () => {
    win.show();
    mainWindow = win;
  })

};
//========================================================================//
//========================================================================//

app.allowRendererProcessReuse = false;

app.on('ready', function () {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
//===========================================================================//
//===========================================================================//
//===========================================================================//
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var port;
var parser;
var portName;
var Tabs = "";

var Cap1_Arr = [];
var Cap2_Arr = [];
var freq_Arr = [];
var Phs1_Arr = [];
var Phs2_Arr = [];
var Buff = 1024;
var calib = false;
var diag = false;
var multiplierA = 1;
var multiplierB = 1;

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
    data = data.replace(/[\n\r]+/g, '');
    if (data == "ardok") mainWindow.webContents.send('communication', data);

    //================================================================================//
    if (Tabs == "Diagram") {
      let arrayData = data.split(",");
      let Cap1 = arrayData[0];
      let Cap2 = arrayData[1];
      let freq = arrayData[2];
      let Phase1 = arrayData[3];
      let Phase2 = arrayData[4];

      Cap1_Arr.push(Cap1);
      Cap2_Arr.push(Cap2);
      freq_Arr.push(freq);
      Phs1_Arr.push(Phase1);
      Phs2_Arr.push(Phase2);

      Cap1_Arr = Cap1_Arr.filter(function (e) { return e });
      Cap2_Arr = Cap2_Arr.filter(function (e) { return e });
      Phs1_Arr = Phs1_Arr.filter(function (e) { return e });
      Phs2_Arr = Phs2_Arr.filter(function (e) { return e });

      if (Cap1_Arr.length > Buff && Cap2_Arr.length > Buff) {
        var Mag1 = ((Math.max(...Cap1_Arr) - Math.min(...Cap1_Arr)) * 4.88).toFixed(0);
        var Mag2 = ((Math.max(...Cap2_Arr) - Math.min(...Cap2_Arr)) * 4.88).toFixed(0);
        let Freq = Averaging(freq_Arr).toFixed(1);
        let Phs1 = Averaging(Phs1_Arr).toFixed(0);
        let Phs2 = Averaging(Phs2_Arr).toFixed(0);

        if (Freq < 5) Buff = 1024;
        if (Freq <= 5 && Freq < 10) Buff = 512;
        if (Freq <= 10) Buff = 256;

        Cap1_Arr = [];
        Cap2_Arr = [];
        freq_Arr = [];
        Phs1_Arr = [];
        Phs2_Arr = [];

        mainWindow.webContents.send('Bal', Mag1, Phs1);
        mainWindow.webContents.send('Bal1', Mag1, Phs1);
        mainWindow.webContents.send('Bal2', Mag2, Phs2);
        mainWindow.webContents.send('Freq', Freq);
      }
    }
    //================================================================================//

    if (Tabs == "VibroMeter") {
      let arrayData = data.split(",").map((i) => Number(i));
      Cap1 = parseFloat((arrayData[0] * 0.00488).toFixed(2));
      Cap2 = parseFloat((arrayData[1] * 0.00488).toFixed(2));
      Cap3 = parseFloat((arrayData[2] * 0.00488).toFixed(2));
      mainWindow.webContents.send('cap1', Cap1);
      mainWindow.webContents.send('cap2', Cap2);
      mainWindow.webContents.send('capT', Cap3);
      mainWindow.webContents.send('freq', arrayData[3]);
    }
  }
}

ipcMain.on('SendToARDConfig', (event, arg) => {
  if (portName != arg.PortCOM) ConfigPort(arg.PortCOM, arg.Baudrate);
  port.write(`${arg.Baudrate},${arg.Freqency},${arg.RPM},\n`);
  port.write(`S\n`);
})

ipcMain.on('Tabs', (event, arg) => {
  Tabs = arg;
  if (port != undefined) {
    port.write("S");
    port.write("\n");
  }
})

ipcMain.on('close', (event, arg) => {
  port.close();
  portName = 0;
})

ipcMain.on('balancing', (event, arg) => {
  if (port != undefined) {
    port.write(arg);
    port.write("\n");
  }
})

ipcMain.on('byte', (event, arg) => {
  if (port != undefined) {
    if (arg == "c") {
      calib = true;
      diag = false;
    }
    if (arg == "g") {
      diag = true;
      calib = false;
    }
    port.write(arg);
    port.write("\n");
  }
})

const Averaging = (arr) => {
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += parseFloat(arr[i], 10);
  }
  var avg = total / arr.length;
  return avg
}














// ipcMain.on('ST_SP', (event, arg) => {
//   if (arg == "start" && port != undefined) {
//     if (Tabs == "Diagram") {
//       port.write("s\n");
//       port.write("d\n");
//     }
//     if (Tabs == "VibroMeter") {
//       port.write("s\n");
//       port.write("o\n");
//     }

//   }
//   if (arg == "stop" && port != undefined) port.write("S\n");
// })