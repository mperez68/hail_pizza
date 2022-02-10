const assert = require('chai').assert;
const util = require('../src/boundingbox');

/**
 * Unit Testing for the BoundingBox class
 * 
 * Methods being tested:
 * constructor (x, y, width, height, direction)
 * collide (oth)
 * broadDetection (oth)
 * narrowDetection (oth)
 * 
 * Method NOT being tested:
 * draw (ctx, game, color)
 */
describe('BoundingBox', function() {
    before(function(){
        // setup
    });
    
    // Test names are written in plain english, directly explain what the purpose of the test is.

    it ('should construct bounding boxes', function(){
        // * constructor (x, y, width, height, direction)
        assert.fail("Not Implemented.")
    });

    it ('should detect if it is colliding with another bounding box', function(){
        // * collide (oth)
        assert.fail("Not Implemented.")
    });

    it ('should broadly detect if another bounding box is colliding', function(){
        // * broadDetection (oth)
        assert.fail("Not Implemented.")
    });

    it ('should narrowly detect if another bounding box is colliding', function(){
        // * narrowDetection (oth)
        assert.fail("Not Implemented.")
    });
});