var levels  = {
    'template': {
        bounds: { left: -1, top: -1, right:  1, bottom:  1 },
        grd: [  // Ground Tiles
            { xs: -1, ys: -1, xe:  1, ye:  0 }
        ], 
        road: [ // Road Tiles
            { xs: -1, ys:  1, xe:  1, ye:  1 }
        ], 
        bldg: [ // Building Tiles
            { xs: -1, ys: -1, xe: -1, ye: -1 }
        ], 
        peds: [ // Neutral Pedestrians
            { x: 0, y: -1, a: 90}
        ],
        vehs: [ // Neutral Vehicles
            { x: -1, y: 0, a: 0}
        ],
        zmbs: [ // Aggressive Pedestrians (Zombies)
            { x: 1, y: -1, a: 135}
        ],
        pigs: [ // Aggressive Vehicles (Cops/Pigs)
            { x: -1, y: 1, a: 315}
        ],
        buffs: [// Buff Locations TODO decide of random or deterministic
            {x: 1, y: 0, v: 0}
        ],
        sqs: [  // Sidequests TODO develop more
            {x: 0, y: 1, v: 0}
        ],
        player: {x: -2, y: -2, a: 315}, // Player Starting Location TODO decide how player character enters
        end: {x: 0.5, y: 0.5}   // End point to finish mission
    },
    0: {    // Default TODO splash screen
        bounds: { left: -20, top: -15, right:  20, bottom:  15 },
        grd: [  // Ground Tiles
            { xs: -20, ys: -15, xe:  20, ye:  -1 },
            { xs: -20, ys:   1, xe:  20, ye:  15 }
        ],
        road: [ // Road Tiles
            { xs: -20, ys:   0, xe:  20, ye:   0 }
        ], 
        bldg: [ // Building Tiles
            { xs: -20, ys:  -15, xe:    5, ye:  -8 },
            { xs:   6, ys:  -15, xe:   20, ye:  -4 },
            { xs: -20, ys:    2, xe:  -14, ye:   9 },
            { xs:  14, ys:    2, xe:   20, ye:   9 },
            { xs: -20, ys:   10, xe:   20, ye:   15 }
        ],
        peds: [ // Neutral Pedestrians
            //
        ],
        vehs: [ // Neutral Vehicles
            //
        ],
        zmbs: [ // Aggressive Pedestrians (Zombies)
            //
        ],
        pigs: [ // Aggressive Vehicles (Cops/Pigs)
            //
        ],
        buffs: [// Buff Locations
            //
        ],
        sqs: [  // Sidequests
            //
        ],
        player: {x: 0, y: 1.8, a: 350}, // Player Starting Location
        end: {x: 0.5, y: 0.5},   // End point to finish mission
        focus: { x:0, y:0, z: 0.5 }
    },
    1: {   // Level 1
        bounds: { left: -20, top: -20, right:  20, bottom:  20 },
        // xs/ys: starting coordinates
        // xe/ye: ending coordinates
        // draws square of object in those coordinates
        grd: [  // Ground Tiles
            { xs: -20, ys: -20, xe:  -1, ye:  -2 },
            { xs:   2, ys: -20, xe:  20, ye:  -2 },
            { xs:   2, ys:   3, xe:  20, ye:  20 },
            { xs: -20, ys:   3, xe:  -1, ye:  20 }
             ],
        
        road: [ // Road Tiles
            { xs: -20, ys:  -1, xe:  20, ye:   2 }, // Horizontal line
            { xs:   0, ys: -20, xe:   1, ye:  -2 }, // top vertical line
            { xs:   0, ys:   2, xe:   1, ye:  20 }  // bottom vertical line
        ],
        bldg: [ // Building Tiles
            { xs:  -7, ys:  -6, xe:  -3, ye:  -3 },
            { xs:   3, ys:  -5, xe:   4, ye:  -4 }
        ],
        peds: [ // Neutral Pedestrians
            { x: 12, y: -2, a: 0},
            { x: 4, y: -2, a: 0},
            { x: -1, y: -2, a: 0},
            { x: -5, y: -2, a: 0}
        ],
        vehs: [ // Neutral Vehicles
            { x: 13, y: 2.3, a: 10},
            { x: 7, y: 2.3, a: 10},
            { x: 3, y: 2.3, a: 10},
            { x: -2, y: 2.3, a: 10},
            { x: -8, y: 2.3, a: 10},
            { x: -16, y: 2.3, a: 10},
            { x: -14, y: -1.3, a: 190},
            { x: -5, y: -1.3, a: 190},
            { x: 8, y: -1.3, a: 190},
            { x: 12, y: -1.3, a: 190},
            { x: 19, y: -1.3, a: 190}
        ],
        zmbs: [ // Aggressive Pedestrians (Zombies)
            //
        ],
        pigs: [ // Aggressive Vehicles (Cops/Pigs)
            //
        ],
        buffs: [// Buff Locations
            //
        ],
        sqs: [  // Sidequests
            //
        ],
        player: {x: 3, y: -1.3, a: 190}, // Player Starting Location
        end: {x: 19.5, y: 0.5}   // End point to finish mission
    },
    2: {   // Level 2
        bounds: { left: -1, top: -1, right:  1, bottom:  1 },
        grd: [  // Ground Tiles
            { xs: -1, ys: -1, xe:  1, ye:  0 }
        ], 
        road: [ // Road Tiles
            { xs: -1, ys:  1, xe:  1, ye:  1 }
        ], 
        bldg: [ // Building Tiles
            { xs: -1, ys: -1, xe: -1, ye: -1 }
        ], 
        peds: [ // Neutral Pedestrians
            { x: 0, y: -1, a: 90}
        ],
        vehs: [ // Neutral Vehicles
            { x: -1, y: 0, a: 0}
        ],
        zmbs: [ // Aggressive Pedestrians (Zombies)
            { x: 1, y: -1, a: 135}
        ],
        pigs: [ // Aggressive Vehicles (Cops/Pigs)
            { x: -1, y: 1, a: 315}
        ],
        buffs: [// Buff Locations TODO decide of random or deterministic
            {x: 1, y: 0, v: 0}
        ],
        sqs: [  // Sidequests TODO develop more
            {x: 0, y: 1, v: 0}
        ],
        player: {x: -2, y: -2, a: 315}, // Player Starting Location TODO decide how player character enters
        end: {x: 0.5, y: 0.5}   // End point to finish mission
    },
    3: { // END LEVEL
        //
    }
}