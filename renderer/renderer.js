//This is the root javascript file called by "index.html"
//It is called renderer because this javascript will excecute in the rendered window

const NdlrConnection = require("./NdlrConnection")
const {saveSessionFromNdlr, loadSessionToNdlr} = require('./FileHandler')
const {validateSession} = require("./NdlrSessionValidator")
require('./TroubleshootModal')

const ndlrConnection = new NdlrConnection()

const saveMyShitButton = document.getElementById("save-my-shit-button")
const loadMyShitButton = document.getElementById("load-my-shit-button")

saveMyShitButton.onclick = (e) => {
    ndlrConnection.getSession( session => {
        let valid = true
        try {
            validateSession(session)
        } catch(e) {
            valid = false
            alert(e, "The session recieved from the NDLR is invalid. Try again.")
        }
        if (valid) {saveSessionFromNdlr(session)}
    })
}
loadMyShitButton.onclick = (e) => {
    loadSessionToNdlr( session => {
        let valid = true
        try {
            validateSession(session)
        } catch(e) {
            valid = false
            alert(e, "Invalid Session Could Not Be Written")
        }
        if (valid) {ndlrConnection.writeSessionToNdlr(session)}
    })
}

