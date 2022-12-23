const { app, BrowserWindow } = require("electron")
const path = require("path")

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "awesome app",
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        },
    })
    // let child = new BrowserWindow({parent: win})
    // child.loadFile("child.html")
    win.loadFile("index.html")
    // win.webContents.OpenDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})