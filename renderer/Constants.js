const DEBUG = true

const NDLR = {
    types: [
        "presets",
        "patterns",
        "rhythms",
        "chords"
    ],
    
    presets: {
        count: 8,
        offset: 1,
        writes: {
            dump: "<a>",
            write: "<PrVL", 
            read: "<PreL", //<PreL##-(data)>
            store: "<STRPre", //<STRPre#>
        },
        default: [
            [500,0,10,0,0,0,0,240,260,10,0,0,0,0,0,10,10,10,0,0],
            [100,0,20,0,0,0,0,290,190,0,10,0,0,0,0,10,10,10,0,0],
            [40,10,100,0,0,0,0,750,50,10,0,0,0,0,0,1000,10,10,0,0],
            [900,10,10,0,0,0,0,1000,120,0,10,0,0,0,0,10,10,10,0,0],
            [80,0,80,40,120,210,80,10,150,1270,10,0,0,0,0,630,210,210,0,0],
            [10,0,10,500,500,500,500,20,160,1270,10,0,0,0,0,0,30,30,0,0],
            [30,0,80,50,130,220,90,40,10,1270,0,0,0,0,0,0,80,80,0,0],
            [0,10,0,500,500,500,500,1000,10,750,0,0,0,0,0,0,0,0,0,0],
            [8,0,8,1,0,1,3,0,8,0,1,0],
            [6,0,8,2,0,2,3,0,8,0,14,0]
        ]
        //Range varies for each value.
    },

    patterns: {
        count: 20,
        offset: 21,
        writes: {
            dump: "<b>",
            write: "<PaVt",
            read: "<Patt", //<Patt##-(data)>
            store: "<STRPatt", //<STRPatt##>
        },
        default: [20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        firstElementVals: [20,40,60],
        //For presets, the first number can be 20, 40, or 60.
        //The range of the remaining numbers is between 0 and the first number (i.e. 0-20, 0-40, etc.)
    },

    rhythms: {
        count: 20,
        offset: 21,
        writes: {
            dump: "<c>",
            write: "<RhVm",
            read: "<Rhym", //<Rhym##-(data)>
            store: "<STRRhym", //<STRRhym##>
        },
        default: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        range: [0, 128]
        //Range is from 0-128 on each
    },

    chords: {
        count: 5,
        offset: 1,
        writes: {
            dump: "<d>",
            write: "<CSVq",
            read: "<CSeq", //<CSeq#-(data)>
            store: null, //Doesn't have one
        },
        default: [
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,1,1,1,
            0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1
        ],
        aRanges: [
            [0, 32],
            [1, 7],
            [1, 7],
            [1, 12],
            [1, 15]
        ],
        aSets: 18,
        bRanges: [
            [0, 3],
            [0, 8]
        ],
        bSets: 8,
        //Range for first 18 sets of 5 values [Beat=0-32, Deg=1-7, Type=1-7, Key=1-12, Mode=1-15]
        //Range for remaining 8 sets of 2 [ChordSec=1-3, Repeats=0-8]
    }
}

const ALERTS = {
    SESSION_SAVED: "Your NDLR session has been saved!",
    SESSION_LOADED: "The selected session has been loaded to the NDLR",
    SESSION_NOT_READ: "The NDLR didn't respond in time. Check your connection and try again."
}

module.exports = {
    NDLR,
    ALERTS,
    DEBUG,
}