const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg')
const {app, BrowserWindow, ipcMain} = electron

let mainWindow;
app.on('ready', ()=>{
  // As of version 5, the default for nodeIntegration changed from true to false. You can enable it when creating the Browser Window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
})

ipcMain.on('video:submit', (event, path)=>{
  ffmpeg.ffprobe(path, (err, metadata)=>{
    mainWindow.webContents.send('video:metadata', metadata.format.duration)

  })
})