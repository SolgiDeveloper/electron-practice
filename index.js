const electron = require('electron');
const {app, BrowserWindow, Menu} = electron

let mainWindow;
app.on('ready', () => {
  // As of version 5, the default for nodeIntegration changed from true to false. You can enable it when creating the Browser Window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

const menuTemplate = [
  {
    label: 'file'
  }
]
