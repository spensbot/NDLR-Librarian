//Required Files
const tableify = require('tableify')
const serialport = require('serialport')

//DOM Element References
const troubleshootModal = document.getElementById('troubleshoot-modal')
const troubleshootModalDismissButton = document.getElementById('troubleshoot-modal-dismiss-button')
const troubleshootTable = document.getElementById('troubleshoot-table')
const connectionTroubleshootButton = document.getElementById('connection-troubleshoot-button')

//Button Onclicks
connectionTroubleshootButton.onclick = (e) => {
    createSerialDeviceTableHTML( tableHTML => {
        troubleshootTable.innerHTML = tableHTML
    });
    troubleshootModal.style.display = "flex";
}
troubleshootModalDismissButton.onclick = (e) => {
    troubleshootModal.style.display = "none";
}

//Creates an HTML table with each detected serial device
function createSerialDeviceTableHTML(callback) {
    serialport.list((err, ports) => {
        if (err) {
            console.log(err.message)
            callback('Error: ' + err.message)
        } else if (ports.length === 0) {
            callback('No ports discovered')
        } else {
            ports.forEach(port => {
                delete port.pnpId
                delete port.locationId
                delete port.vendorId
                delete port.productId
            })
            callback(tableify(ports))
        }
    })
}