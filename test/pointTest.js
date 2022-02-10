const assert = require('chai').assert;
const Point = require('../src/point');

/**
 * Unit Testing for the Point class
 * Methods being tested:
 * constructor (x, y)
 * static sum(points)
 * static distance (pt1, pt2)
 * static angle (pt1, pt2)
 * static angle (pt1)
 * isLeft (oth)
 * isRight (oth)
 * isAbove (oth)
 * isBelow (oth)
 */
describe('Point', function() {
    before(function(){
        // Create two concurrent arrays of all possible combinations of zero, positive, and negative in a point 
        this.xCoords = [ 0,  0,  1,  1,  1,  0, -1, -1, -1 ];
        this.yCoords = [ 0,  1,  1,  0, -1, -1, -1,  0,  1 ];
        this.points = [];
    
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length); i++){
            this.points.push(new Point(this.xCoords[i], this.yCoords[i]));
        }
    });
    
    // Test names are written in plain english, directly explain what the purpose of the test is.

    it('should construct points', function(){
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length); i++){
            assert.equal(this.points[i].x, this.xCoords[i], "x is not assigning correctly at index " + i)
            assert.equal(this.points[i].y, this.yCoords[i], "y is not assigning correctly at index " + i)
        }
    })

    it ('should sum two or more points', function(){
        // sum(points)
        assert.fail("Not Implemented.")
    })

    it ('should find the distance between two points', function(){
        // distance(pt1, pt2)
        assert.fail("Not Implemented.")
    })

    it ('should give the angle between two points', function(){
        // angle(pt1, pt2)
        assert.fail("Not Implemented.")
    })

    it ('should give the angle of a given point', function(){
        // angle(pt1)
        assert.fail("Not Implemented.")
    })

    it ('should compare directions', function(){
        // isLeft(oth)
        // isRight(oth)
        // isAbove(oth)
        // isBelow(oth)
        assert.fail("Not Implemented.")
    })
});
