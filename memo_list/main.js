const electron = require("electron")
const path = require("path")
const url = require("url")

process.env.NODE_ENV = "development"

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow

app.on("ready", () => {
    // create new window
    mainWindow = new BrowserWindow({})
    // load html in mainWindow
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: "file:",
        slashes: true
    }))
    mainWindow.on("closed", function() {
        app.quit()
    })
    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // insert menu
    Menu.setApplicationMenu(mainMenu)
})

// handle add item window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add Shopping List Item"
    })
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: "file:",
        slashes: true
    }))
    // close item window
    addWindow.on("close", function() {
        addWindow = null
    })
}

// catch item:add
ipcMain.on("item:add", function(e, item) {
    mainWindow.webContents.send("item:add", item)
    addWindow.close()
})

const mainMenuTemplate = [
    // each object is a dropdown
    {
        label: "File",
        subMenu: [
            {
                label: "Add Item",
                click() {
                    createAddWindow()
                }
            },
            {
                label: "Clear Items",
                click() {
                    mainWindow.webContents.send("item:clear")
                }
            },
            {
                label: "Quit",
                accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]

if (process.platform === "darwin") {
    mainMenuTemplate.unshift({})
}

// add devTools if in dev
if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push({
        label: "Developer Tools",
        subMenu: [
            {
                role: "reload"
            },
            {
                label: "Toggle DevTools",
                accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        ]
    })
}