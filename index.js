const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow;
let addWindow;
app.on('ready', () => {
  // As of version 5, the default for nodeIntegration changed from true to false. You can enable it when creating the Browser Window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  mainWindow.on('closed', ()=> app.quit())
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`)

  // when we close the window we must clear the old one for the time we open new one
  addWindow.on('closed', ()=> addWindow = null)
}
ipcMain.on('todo:add', (event, todo)=>{
  mainWindow.webContents.send('todo:add',todo);

  addWindow.close()
})

function clearTodos(){
  mainWindow.webContents.send('todo:clear');
}

const menuTemplate = [
  {
    label: 'file',
    submenu:[
      {
        label: 'New Todo',
        click() {
          createAddWindow()
        }
      },
      {
        label: 'Clear Todos',
        click() {
          clearTodos()
        }
      },
      {
        label: 'Quit',
        // accelerator: (()=>{
        //   if (process.platform === 'darwin'){
        //     return 'Command + Q'
        //   } else if (process.platform === 'win32'){
        //     return 'Ctrl + Q'
        //   }
        // })(),
        accelerator: process.platform === 'darwin' ? 'Command + Q' : 'Ctrl + Q',
        click() {
          app.quit()
        }
      }
    ]
  }
]
// how we can change menu items based on os running on machine
if (process.platform === 'darwin'){
  menuTemplate.unshift({label: 'mac-os'})
} else if (process.platform === 'win32'){
  menuTemplate.unshift({label: 'win-os'})
}

 // NODE_ENV => { production development staging test}

if (process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label: 'DevMod',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command + Alt + I' : 'Ctrl + Shift + I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();

        }
      }
    ]
  })
}