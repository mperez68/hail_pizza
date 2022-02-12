const assert = require('chai').assert;
const Vector = require('../src/vector');

/**
 * Unit Testing for the Vector class
 * 
 * Methods being tested:
 * constructor (angle, magnitude)
 * static sum (vectors)
 * equals (oth)
 * getHead ()
 * 
 * Method NOT being tested:
 * draw(ctx, game, x, y)
 */
describe('Vector', function() {
    before(function(){
        // setup
    });
    
    // Test names are written in plain english, directly explain what the purpose of the test is.

    it ('should construct vectors', function(){
        // constructor (angle, magnitude)
        assert.fail("Not Implemented.")
    })

    it ('should compare two vectors', function(){
        // equals (oth)
        assert.fail("Not Implemented.")
    })

    it ('should sum one or more vectors', function(){
        // sum (vectors)
        assert.fail("Not Implemented.")
    })

    it ('should give the Point objectt pointing to the head', function(){
        // getHead ()
        assert.fail("Not Implemented.")
    })
});