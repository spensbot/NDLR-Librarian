//DOM Element References
const connectionStatus = document.getElementById('connection-status')
const connectionSpinner = document.getElementById('connection-spinner')
const connectionLabel = document.getElementById('connection-label')
const connectionTroubleshootButton = document.getElementById('connection-troubleshoot-button')
const bigAssButtons = document.getElementsByClassName('big-ass-button')

//Updates DOM elemments depending on NDLR connection status
function updateConnectionGui(connected, ndlrInfo){
    if (connected){
        connectionStatus.style.backgroundColor="rgb(71, 143, 71)"
        connectionSpinner.style.display="none"
        connectionLabel.innerHTML=`Connected to NDLR Ver: ${ndlrInfo.ver} Serial #: ${ndlrInfo.serialNum}`
        connectionTroubleshootButton.style.display="none"
        for (const button of bigAssButtons) {
            button.className = "big-ass-button"
        } 
    } else {
        ndlrVer = ""
        ndlrSerialNum = ""
        connectionStatus.style.backgroundColor="rgb(172, 67, 67)"
        connectionSpinner.style.display="inline"
        connectionLabel.innerHTML=`Searching for an NDLR`
        connectionTroubleshootButton.style.display="inline"
        for (const button of bigAssButtons) {
            button.className = "big-ass-button disabled"
        } 
    }
}

module.exports = updateConnectionGui