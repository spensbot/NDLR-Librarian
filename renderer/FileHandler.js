const {dialog, app} = require("electron").remote
const Store = require('electron-store')
const {createDefaultSession} = require('./NdlrSessionMaker')
const fs = require('fs')
const {ALERTS} = require('./Constants')

const ndlrFileFilter = [
    { name: "NDLR Session Files", extensions: ["ndlr"] }
]
const store = new Store();

if (store.has('sessionsDirectory')){
    var documentsPath = store.get('sessionsDirectory')
} else {
    var documentsPath = app.getPath('documents')
}

function saveSessionFromNdlr(session){
    dialog.showSaveDialog({
        title: "Where would you like to save your NDLR session?",
        defaultPath: documentsPath,
        buttonLabel: 'save my shit!',
        filters: ndlrFileFilter
    }).then(result => {
        if (!result.canceled) {
            store.set('sessionsDirectory', result.filePath)
            documentsPath = store.get('sessionsDirectory')
            let sessionJSON = JSON.stringify(session)
            fs.writeFile(result.filePath, sessionJSON, err => {
                if (err) {
                    alert(err)
                } else {
                    alert(ALERTS.SESSION_SAVED)
                }
            })
        }
    }).catch(err => {
        alert(err)
    })
}

function loadSessionToNdlr(callback){
    dialog.showOpenDialog({
        title: "Which Session Would You Like To Load?",
        defaultPath: documentsPath,
        buttonLabel: 'Load my shit!',
        filters: ndlrFileFilter,
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            store.set('sessionsDirectory', result.filePaths[0]);
            documentsPath = store.get('sessionsDirectory')
            fs.readFile(result.filePaths[0], (err, data) => {
                if (err) {
                    alert(err)
                } else {
                    let session = JSON.parse(data)
                    callback(session)
                }
            })
        }
    }).catch(err => {
        alert(err)
    })
}

module.exports = {
    saveSessionFromNdlr,
    loadSessionToNdlr
}