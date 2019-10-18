const {NDLR} = require('./Constants')

function validateSession(session){
    for (const type of NDLR.types){
        if (session[type].length !== NDLR[type].count) {
            throw `There should be ${NDLR[type].count} ${type}. Actual: ${data.length}`
        }
    }

    for (const type of NDLR.types){
        session[type].forEach( (element, index) => {
            try {
                validate[type](element)
            } catch(e) {
                throw `${type} #${index} ` + e
            }
        })
    }

    return true
}

//------------------------      LOCAL HELPERS     -----------------------------------

validate = {
    presets: function(preset){
        if (preset.length !== NDLR.presets.default.length) {
            throw `should have ${NDLR.presets.default.length} values. Actual: ${preset.length}`
        }
        NDLR.presets.default.forEach( (row, index) => {
            if (preset[index].length !== row.length) {
                throw `row ${index} should have ${row.length} values. Actual: ${preset[index].length}`
            }
        })
        return true
    },

    patterns: function(pattern){
        if (pattern.length !== NDLR.patterns.default.length) {
            throw `should have ${NDLR.patterns.default.length} values. Actual: ${pattern.length}`
        }
        let firstElement = pattern[0]
        let remainingElements = pattern.slice(1)
        if ( contains(firstElement, NDLR.patterns.firstElementVals) !== true ){
            try {
                contains(firstElement, NDLR.patterns.firstElementVals)
            } catch(e) {
                throw "Item 1" + e
            }
        }
        if ( isBetween(remainingElements, [0, firstElement] ) !== true ){
            try {
                isBetween(remainingElements, [0, firstElement] )
            } catch(e) {
                throw e
            }
        }
        return true
    },

    rhythms: function(rhythm){
        if (rhythm.length !== NDLR.rhythms.default.length) {
            throw `should have ${NDLR.rhythms.default.length} values. Actual: ${rhythm.length}`
        }
        if ( isBetween(rhythm, NDLR.rhythms.range) !== true) {
            try{
                isBetween(rhythm, NDLR.rhythms.range)
            } catch(e) {
                throw e
            }
        }
        return true
    },

    chords: function(chord){
        if (chord.length !== NDLR.chords.default.length) {
            throw `should have ${NDLR.chords.default.length} values. Actual: ${chord.length}`
        }
        a = chord.slice(0, -(NDLR.chords.bRanges.length * NDLR.chords.bRanges.bSets) )
        b = chord.slice( -(NDLR.chords.bRanges.length * NDLR.chords.bRanges.bSets) )
        a.forEach( (val, index) => {
            ranges = NDLR.chords.aRanges
            rangeIndex = index % ranges.length
            range = ranges[rangeIndex]
            try {
                isBetween( [val], range )
            } catch (e) {
                throw e
            }
        })
        b.forEach( (val, index) => {
            ranges = NDLR.chords.bRanges
            rangeIndex = index % ranges.length
            range = ranges[rangeIndex]
            try {
                isBetween( [val], range )
            } catch (e) {
                throw e
            }
        })
        return true
    }
}

//Returns true if val can be found in array "set"
//Otherwise throws an error message
function contains(val, set){
    for (const item of set){
        if (val === item) {
            return true
        }
    }
    throw `val ${val} is not contained in this set: ${set}`
}

//Returns true if each val in array "vals" is equal to or between range[0] and range[1]
//Otherwise throws an error message
function isBetween(vals, range ) {
    vals.forEach( (val, index) => {
        if ( val<range[0] || val>range[1]) {
            throw `val ${val} is outside the bounds [${range[0]} , ${range[1]}]`
        }
    })
    return true
}


module.exports = {
    validateSession,
    contains,
    isBetween,
}


//-----------------------------     DEPRECATED     --------------------------------------