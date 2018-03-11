// App (electron)-only methods
let mainWindow

if (KOEL_ENV === 'app') {
  mainWindow = require('electron').remote.getCurrentWindow()
}

const app = {
  triggerMaximize: () => mainWindow && (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize())
}

export { app }
