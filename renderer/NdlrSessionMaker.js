const {NDLR} = require('./Constants')

//Creates a session with the factory default values
//A valid session
function createDefaultSession(){
    let session = {}
    for (const type of NDLR.types){
        session[type] = fillArray( NDLR[type].count , NDLR[type].default )
    }
    return session
}

module.exports = {
    createDefaultSession
}

//------------------------      LOCAL HELPERS     -----------------------------------

function fillArray(length, val){
    let myArray = []
    for (let i=0 ; i<length ; i++) {
        myArray[i] = val
    }
    return myArray
}

//--------------------------     DEPRECATED     ------------------------------------

//A recursive function that fills a multi-dimentional array of given dims (ie: [2,3,4,5] ) with "val"
//Note: "val" could also be an array.
function fillNestedArrays(dims, val){
    let myArray = []
    if (dims.length > 1) {//This array should be filled with arrays
        for (let i=0 ; i<dims[0] ; i++) {
            myArray[i] = fillNestedArrays(dims.slice(1), val)
        }
    } else { //This is the last dim. Fill it with "val"
        for (let i=0 ; i<dims[0] ; i++) {
            myArray[i] = val
        }
    }   
    return myArray
}
