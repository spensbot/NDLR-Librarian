//Creates and maintains a connection with the first available NDLR device.
//Created 2019 by Spenser Saling

const serialport = require('serialport')
const Readline = require('@serialport/parser-readline')
const updateConnectionGui = require('./UpdateConnectionGui')
const {createDefaultSession} = require("./NdlrSessionMaker")
const EventEmitter = require("events")
const {NDLR, ALERTS, DEBUG} = require("./Constants")
const {SerialWriter} = require("./SerialWriter")

const connectionUpdateTime = 1000 //milliseconds
const baudRate = 115200 //or try 57600
const writeTime = 100 //milliseconds
const lineParser = new Readline() //This will take the incoming serial port data and parse it to us one line at a time.

let ndlrPath = null
let ndlrPort = null
let ndlrInfo = {
    ver: '',
    serialNum: '',
}

let presetIndex = 0
let logNextLine = false
let readCompleteSession = false
let portLocked = false

let serialWriter = null
let session = createDefaultSession()

lineParser.on('data', data => {

    if (logNextLine) {
        if (data.indexOf("SUCCESS") < 0){
            console.log("ERROR!!!:",data)
        }
        logNextLine = false
    }

    if (data.indexOf("The NDLR ver =") === 0) {
        ndlrInfo.ver = data.slice(16, -1)
    } else if (data.indexOf("The NDLR serial#") === 0) {
        ndlrInfo.serialNum = data.slice(19, -1)
    } else if (data.indexOf("Dump RAW Preset:") === 0){
        presetIndex = data.slice(16) - 1
    } else if (data.indexOf("<PreL") === 0){
        let presetRowIndex = data.slice(5,7) - 1
        let presetRowData = data.slice(8,-2).split(",")
        presetRowData.forEach( (value, index) => {
            presetRowData[index] = Number(value)
        })
        session.presets[presetIndex][presetRowIndex] = presetRowData
    } else if (data.indexOf("<Patt") === 0){
        let patternIndex = data.slice(5,7) - 21
        let patternData = data.slice(8,-2).split(",")
            patternData.forEach( (value, index) => {
            patternData[index] = Number(value)
        })
        session.patterns[patternIndex] = patternData
    } else if (data.indexOf("<Rhym") === 0){
        let rhythmIndex = data.slice(5,7) - 21
        let rhythmData = data.slice(8,-2).split(",")
        rhythmData.forEach( (value, index) => {
            rhythmData[index] = Number(value)
        })
        session.rhythms[rhythmIndex] = rhythmData
    } else if (data.indexOf("<CSeq") === 0){
        let chordIndex = data.slice(5,6) - 1
        let chordData = data.slice(7,-2).split(",")
        chordData.forEach( (value, index) => {
            chordData[index] = Number(value)
        })
        session.chords[chordIndex] = chordData
    } else if (data.indexOf("ERR") >= 0){
        //These error messages aren't very useful.. So we only log the verbose messages.
        //See below
        console.log(data)
    } else if (data.indexOf("SUCCESS") >= 0) {
        console.log(data)
    } else if (data.indexOf("Verbose") === 0){
        logNextLine = true
        //console.log(data)
    } else {
        //If the line isn't recongnized, don't do anything with it.
    }

    if (data.indexOf("<CSeq5-") === 0){
        readCompleteSession = true
    }
})

//Upon instantiation, this object automatically begins checking-for/connecting-to the first available NDLR
class NdlrConnection{
    constructor(){
        //Initialize connection, update periodically
        updateConnection()
        setInterval( () => updateConnection() , connectionUpdateTime)
    }

    writeSessionToNdlr(session){
        writePresetsToNdlr(session.presets)
        writeToNdlr(session, "patterns")
        writeToNdlr(session, "rhythms")
        writeToNdlr(session, "chords")
    }

    getSession(callback){
        readSessionFromNdlr()
        setTimeout( () => {
            if (readCompleteSession) {
                callback(session)
            }
            else {
                alert(ALERTS.SESSION_NOT_READ)
            }
        }, 500)
    }
}

//Check and update the connection
function updateConnection() {
    if (ndlrPath === null) setNDLRPath()
    if (ndlrPath != null && ndlrPort === null) setNDLRPort()
    if (ndlrPort != null) {
        if(!portLocked){
            writeLine('a')
        }
    }
}

//Look through the list of serial ports for an NDLR. Set the ndlrPath accordingly
function setNDLRPath() {
    serialport.list((err, ports) => {
        if (err) {
            console.log(err.message)
            return
        }
        if (ports.length === 0) {
            console.log('No ports discovered')
        }
        ports.forEach(port => {
            if ( isNdlr(port) ){
                ndlrPath = port["comName"]
            }
        })
    })
}

//Open a serial port connection with necessary callbacks
function setNDLRPort() {
    ndlrPort = new serialport(ndlrPath, { baudRate: baudRate })

    ndlrPort.on('open', () => {
        console.log("Serial Port Opened")
        setConnectionStatus(true)
        serialWriter = new SerialWriter(ndlrPort)
    })

    ndlrPort.on('close', () => {
        console.log("Serial Port Closed")
        setConnectionStatus(false)
    })

    ndlrPort.on('error', err => {
        console.log("Error: ", err.message)
        setConnectionStatus(false)
    })

    ndlrPort.pipe(lineParser)
}

//Set the Gui and connection objects.
function setConnectionStatus(connected){
    updateConnectionGui(connected, ndlrInfo)
    if (!connected){
        if (ndlrPort != null) {
            ndlrPort.close()
            ndlrPort = null
        }
        ndlrPath = null
        serialWriter = null
    } else {
        //
    }
}

//Check if the device at a given port is a teensy
function isNdlr(port){
    if ( port["manufacturer"] == "Teensyduino" ) return true
    else return false
}

function writePresetsToNdlr(presets){
    presets.forEach( (preset, pIndex) => { //Loop over each preset
        let writeString = NDLR.presets.writes.write
        let storeString = NDLR.presets.writes.store
        let presetNum = pIndex + NDLR.presets.offset
        preset.forEach( (row, rIndex) => { //Send each row in the preset to the NDLR
            let rowNum = (rIndex + NDLR.presets.offset).toString().padStart(2, "0")
            writeLine( writeString + rowNum + "-" + row.join(",") + ">" )
        })
        writeLine( storeString + presetNum + ">" ) //After each row has been sent. Save the preset
    })
}

function writeToNdlr(session, type){
    session[type].forEach( (line, index) => {
        let writeString = NDLR[type].writes.write
        let storeString = NDLR[type].writes.store
        let num = index + NDLR[type].offset
        writeLine( writeString + num + "-" + line.join(",") + ">" )
        if (storeString){
            writeLine( storeString + num + ">")
        }
    })
}

function readSessionFromNdlr(){
    for (type of NDLR.types){
        ndlrPort.write( NDLR[type].writes.dump )
    }
}

function writeLine(text){
    serialWriter.addLine(text)
}

module.exports = NdlrConnection