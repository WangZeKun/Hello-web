import {app, BrowserWindow, globalShortcut} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://127.0.0.1:8080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000
    })
    mainWindow.maximize()
    // mainWindow.setFullScreen(true);
    // globalShortcut.register('ESC', () => {
    //     if (mainWindow.isFullScreen()) {
    //         mainWindow.setFullScreen(false);
    //     } else {
    //         mainWindow.setFullScreen(true);
    //     }
    // })
    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

