const {DEBUG} = require("./Constants")

const writeTime = 100 //milliseconds

class SerialWriter {
    constructor(port) {
        this.port = port
        this.lineArray = []
        setInterval( () => {
            if (this.lineArray.length > 0) {
                let line = this.lineArray.shift()
                port.write(line)
                if (DEBUG) { console.log(line) }
            }
        }, writeTime)
    }
    
    addLine(line){
        this.lineArray.push(line)
    }
}

module.exports = {
    SerialWriter
}