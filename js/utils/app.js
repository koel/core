// App (electron)-only methods
let mainWindow

if (KOEL_ENV === 'app') {
  mainWindow = require('electron').remote.getCurrentWindow()
}

export const app = {
  triggerMaximize: () => mainWindow && (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize())
}
