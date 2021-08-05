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
var bufferSize = 1024;

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
    if (Tabs == "Diagram") {
      
      let arrayData = data.split(",");
      if (arrayData[0] == "freq") mainWindow.webContents.send('freq', arrayData[1]);
      if (arrayData[0] == "bal1") mainWindow.webContents.send('bal1', data);
      if (arrayData[0] == "bal2") mainWindow.webContents.send('bal2', data);
      if (arrayData[0] == "bal1" || arrayData[0] == "bal2") mainWindow.webContents.send('bal', data);
    }

    if (Tabs == "VibroMeter") {
      let arrayData = data.split(",").map((i) => Number(i));
      Cap1 = parseFloat((arrayData[0] * 0.00488).toFixed(2));
      Cap2 = parseFloat((arrayData[1] * 0.00488).toFixed(2));
      mainWindow.webContents.send('cap1', Cap1);
      mainWindow.webContents.send('cap2', Cap2);
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
  port.close() ;
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
    port.write(arg);
    port.write("\n");
  }
})
















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