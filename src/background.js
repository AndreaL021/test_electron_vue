import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const fs = require('fs')
const path = require('path')
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    fullscreenable: true,
    icon: 'favicon.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  win.removeMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})
ipcMain.handle("getProdotti", (event) => {
  let folderPath = path.resolve('.', 'DB');
  let filePath = path.resolve('.', 'DB\\db.json');

  // Verifica se il file esiste
  if (!fs.existsSync(folderPath)) {
    try {
      fs.mkdirSync(folderPath);
    } catch (err) {
      console.error('Errore durante la creazione del file:', err);
      return [];
    }
  }
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify([]));
    } catch (err) {
      console.error('Errore durante la creazione del file:', err);
      return [];
    }
  }
  // Leggi il contenuto del file
  try {
    let data = fs.readFileSync(filePath, 'utf-8');
    return data;
  } catch (err) {
    console.error('Errore durante la lettura del file:', err);
    return [];
  }
});
ipcMain.on("setProdotto", (event, prodotti) => {
  let filePath = path.resolve('.', 'DB\\db.json');
  fs.writeFileSync(filePath, prodotti, (err) => {
    if (err) {
      console.error(err)
    }
    // console.log('Prodotto salvato');
  })
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
