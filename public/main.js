const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
//====================================================================================//
//====================================================================================//

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false,
    frame: false,
    skipTaskbar: false,
    resizable: true,
    alwaysOnTop: true,
    offscreen: true,
  });
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