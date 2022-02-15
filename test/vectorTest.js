const assert = require('chai').assert;
const Point = require('../src/point');
const Vector = require('../src/vector');
import('../src/util')

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
        // common values
        let a = Math.sqrt(2);   // 1.41...
        let b = Math.sqrt(5);   // 2.23...
        let c = Math.sqrt(8);   // 2.82...
        let d = Math.atan(2) * (180 / Math.PI);         // 63.43...
        let e = Math.atan(-2) * (180 / Math.PI) + 180;  // 116.57...
        let f = Math.atan(1/2) * (180 / Math.PI);       // 26.57...
        let g = Math.atan(-1/2) * (180 / Math.PI) + 360;// 333.43...
        let h = Math.atan(-2) * (180 / Math.PI) + 360;  // 296.56...
        let l = Math.atan(2) * (180 / Math.PI) + 180;   // 243.43...
        let m = Math.atan(1/2) * (180 / Math.PI) + 180; // 206.57...
        let n = Math.atan(-1/2) * (180 / Math.PI) + 180;// 153.43...
        // points and vectors, matching
        this.xCoords = [ 0,  0,  1,  1,  1,  0, -1, -1, -1 ];
        this.yCoords = [ 0,  1,  1,  0, -1, -1, -1,  0,  1 ];
        this.angs =    [ 0, 90, 45,  0,315,270,225,180,135 ];
        this.mags =    [ 0,  1,  a,  1,  a,  1,  a,  1,  a ];
        this.sumAngs = [ 0, 90, 45,  0,315,270,225,180,135,
                            90,  d, 45,  0,  0,180,135,  e,
                                45,  f,  0,  0,  0, 90, 90, 
                                     0,  g,315,270,  0, 90,
                                       315,  h,270,270,  0,
                                           270,  l,225,180,
                                               225,  m,180,
                                                   180,  n,
                                                       135 ];
        this.sumMags = [ 0,  1,  a,  1,  a,  1,  a,  1,  a,
                             2,  b,  a,  1,  0,  1,  a,  b, 
                                 c,  b,  2,  1,  0,  1,  2,
                                     2,  b,  a,  1,  0,  1,
                                         c,  b,  2,  1,  0,
                                             2,  b,  a,  1,
                                                 c,  b,  2,
                                                     2,  b,
                                                         c ];
        this.totSum = new Vector(0,0);
        this.points = [];
        this.vectors = [];
        this.sums = [];
    
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length); i++){
            this.points.push(new Point(this.xCoords[i], this.yCoords[i]));
        }

        for (let i = 0; i < Math.min(this.mags.length, this.angs.length); i++){
            this.vectors.push(new Vector(this.angs[i], this.mags[i]));
        }

        for (let i = 0; i < Math.min(this.sumMags.length, this.sumAngs.length); i++){
            this.sums.push(new Vector(this.sumAngs[i], this.sumMags[i]));
        }
    });
    
    // Test names are written in plain english, directly explain what the purpose of the test is.
    it ('should construct vectors', function(){
        // constructor (angle, magnitude)
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length); i++){
            assert.equal(this.vectors[i].magnitude, this.mags[i], "magnitude is not assigning correctly at index " + i)
            assert.equal(this.vectors[i].angle, this.angs[i], "angle is not assigning correctly at index " + i)
        }

        assert.isTrue(new Vector(90, -10).equals(new Vector(270, 10)), "negative vector not adjusting correctly");
    })

    it ('should compare two vectors', function(){
        // equals (oth)
        assert.isTrue(new Vector(0, 1).equals(new Vector(0, 1)), "Comparison returning false positive.");
        assert.isFalse(new Vector(0,0).equals(new Vector(1, 1)), "Comparison returning false negative.");
    })

    it ('should sum one or more vectors', function(){
        // sum (vectors)
        // one vector
        for (let i = 0; i < this.vectors.length; i++){
            assert.isTrue(Vector.sum(this.vectors.slice(i, i + 1)).equals(this.vectors[i]),
                "sum of Vector(" + this.vectors[i].angle + ", " +  this.vectors[i].magnitude + ") falsely returning Vector(" + 
                    Vector.sum(this.vectors.slice(i, i + 1)).angle + ", " + Vector.sum(this.vectors.slice(i, i + 1)).magnitude + ")." );
        }
        // two vectors
        let k = 0; // sums pointer
        for (let i = 0; i < this.vectors.length; i++){
            for (let j = i; j < this.vectors.length; j++){
                assert.isTrue(Vector.sum([ this.vectors[i], this.vectors[j] ]).equals(this.sums[k]),
                    "sum of Vector(" + this.vectors[i].angle + ", " +  this.vectors[i].magnitude + ") " + 
                    "Vector(" + this.vectors[j].angle + ", " + this.vectors[j].magnitude + ") not returning expected sum," + 
                    "Vector(" + this.sums[k].angle + ", " + this.sums[k].magnitude + "), got Vector(" + 
                    Vector.sum([ this.vectors[i], this.vectors[j] ]).angle + ", " +
                    Vector.sum([ this.vectors[i], this.vectors[j] ]).magnitude + ").");
                k++;
            }
        }
        // greater than two vectors
        assert.isTrue(Vector.sum(this.vectors).equals(this.totSum), "Total sum not being calculated correctly.");

        // false check
        assert.isNotTrue(Vector.sum(this.vectors).equals(new Vector(1, 1)), "Total sum not being calculated correctly.");
    })

    it ('should give the Point object pointing to the head', function(){
        // getHead ()
        for (let i = 0; i < Math.min(this.points.length, this.vectors.length); i++){
            assert.isTrue(this.vectors[i].getHead().equals(this.points[i]), 
                "Head not matching cooresponding coordinate: Point(" + 
                this.vectors[i].getHead().x + ", " + this.vectors[i].getHead().y + ") != Point(" + 
                this.points[i].x + ", " + this.points[i].y + ").");
        }
    })
});