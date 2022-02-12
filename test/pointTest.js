const assert = require('chai').assert;
const Point = require('../src/point');

/**
 * Unit Testing for the Point class
 * 
 * Methods being tested:
 * constructor (x, y)
 * static sum(points)
 * static distance (pt1, pt2)
 * static angle (pt1, pt2)
 * static angle (pt1)
 * static getXIntercept (l, r, y)
 * static getMidPoint (l, r)
 * equals(oth)
 * isLeft (oth)
 * isRight (oth)
 * isAbove (oth)
 * isBelow (oth)
 * 
 * Methods NOT being tested:
 * draw(ctx, game)
 */
describe('Point', function() {
    before(function(){
        // common values
        let a = Math.sqrt(2);
        let b = Math.sqrt(5);
        let c = Math.sqrt(8);
        let d = Math.atan(-2) * (180 / Math.PI) + 360;  // 296.56...
        let e = Math.atan(2) * (180 / Math.PI) + 180;   // 243.43...
        let f = Math.atan(1/2) * (180 / Math.PI) + 180; // 206.56...
        let g = Math.atan(-1/2) * (180 / Math.PI) + 180;// 153.43...
        let h = Math.atan(-2) * (180 / Math.PI) + 180;  // 116.56...
        let l = null;
        let m = -0.5;
        let n = 0.5;
        let o = 1.5;
        let p = -1.5;
        // Create two concurrent arrays of all possible combinations of zero, positive, and negative in a point 
        this.xCoords = [ 0,  0,  1,  1,  1,  0, -1, -1, -1 ];
        this.xSums =   [ 0,  0,  1,  1,  1,  0, -1, -1, -1, // Hard coded expected results
                             0,  1,  1,  1,  0, -1, -1, -1,
                                 2,  2,  2,  1,  0,  0,  0,
                                     2,  2,  1,  0,  0,  0,
                                         2,  1,  0,  0,  0,
                                             0, -1, -1, -1,
                                                -2, -2, -2,
                                                    -2, -2,
                                                        -2 ];
        this.xMid =    [ 0,  0,  n,  n,  n,  0,  m,  m,  m,
                             0,  n,  n,  n,  0,  m,  m,  m,
                                 1,  1,  1,  n,  0,  0,  0,
                                     1,  1,  n,  0,  0,  0,
                                         1,  n,  0,  0,  0,
                                             0,  m,  m,  m,
                                                -1, -1, -1,
                                                    -1, -1,
                                                        -1 ];
        this.yCoords = [ 0,  1,  1,  0, -1, -1, -1,  0,  1 ];
        this.ySums =   [ 0,  1,  1,  0, -1, -1, -1,  0,  1, // Hard coded expected results
                             2,  2,  1,  0,  0,  0,  1,  2,
                                 2,  1,  0,  0,  0,  1,  2,
                                     0, -1, -1, -1,  0,  1,
                                        -2, -2, -2, -1,  0,
                                            -2, -2, -1,  0,
                                                -2, -1,  0,
                                                     0,  1,
                                                         2];
        this.yMid =    [ 0,  n,  n,  0,  m,  m,  m,  0,  n,
                             1,  1,  n,  0,  0,  0,  n,  1,
                                 1,  n,  0,  0,  0,  n,  1,
                                     0,  m,  m,  m,  0,  n,
                                        -1, -1, -1,  m,  0,
                                            -1, -1,  m,  0,
                                                -1,  m,  0,
                                                     0,  n,
                                                         1 ];
        this.dist =    [ 0,  1,  a,  1,  a,  1,  a,  1,  a,
                             0,  1,  a,  b,  2,  b,  a,  1,
                                 0,  1,  2,  b,  c,  b,  2,
                                     0,  1,  a,  b,  2,  b,
                                         0,  1,  2,  b,  c,
                                             0,  1,  a,  b,
                                                 0,  1,  2,
                                                     0,  1,
                                                         0 ];
        this.ang =     [    90, 45,  0,315,270,225,180,135,
                                 0,315,  d,270,  e,225,180,
                                   270,270,  e,225,  f,180,
                                       270,225,  f,180,  g,
                                           180,180,  g,135,
                                               180,135,  h,
                                                    90, 90,
                                                        90 ];
        this.xInt =    [     0,  2,  l, -2,  0,  2,  l, -2,
                                 l, -1,  m,  0,  n,  1,  l,
                                     1,  1,  o,  2,  3,  l,
                                         1,  3,  5,  l, -3,
                                             l,  l, -5, -2,
                                                 l, -3,  p,
                                                    -1, -1,
                                                        -1 ];  // when y = 2
        this.totSum = new Point(0, 0);
        this.points = [];
        this.sums = [];
        this.mids = [];
    
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length); i++){
            this.points.push(new Point(this.xCoords[i], this.yCoords[i]));
        }
    
        for (let i = 0; i < Math.min(this.xSums.length, this.ySums.length); i++){
            this.sums.push(new Point(this.xSums[i], this.ySums[i]));
        }
    
        for (let i = 0; i < Math.min(this.xMid.length, this.yMid.length); i++){
            this.mids.push(new Point(this.xMid[i], this.yMid[i]));
        }
    });
    
    // Test names are written in plain english, directly explain what the purpose of the test is.

    it('should construct points', function(){
        // constructor (x, y)
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length); i++){
            assert.equal(this.points[i].x, this.xCoords[i], "x is not assigning correctly at index " + i)
            assert.equal(this.points[i].y, this.yCoords[i], "y is not assigning correctly at index " + i)
        }
    });

    it ('should compare two points.', function(){
        // equals(oth)
        assert.isTrue(new Point(0,0).equals(new Point(0, 0)), "Comparison returning false positive.");
        assert.isFalse(new Point(0,0).equals(new Point(1, 0)), "Comparison returning false negative.");
    });

    it ('should sum one or more points', function(){
        // sum(points)
        // one point
        for (let i = 0; i < this.points.length; i++){
            assert.isTrue(Point.sum(this.points.slice(i, i + 1)).equals(this.points[i]),
                "sum of Point(" + this.points[i].x + ", " +  this.points[i].y + ") not returning itself.");
        }
        // two points
        let k = 0; // sums pointer
        for (let i = 0; i < this.points.length; i++){
            for (let j = i; j < this.points.length; j++){
                assert.isTrue(Point.sum([ this.points[i], this.points[j] ]).equals(this.sums[k]),
                    "sum of Point(" + this.points[i].x + ", " +  this.points[i].y + ") " + 
                    "Point(" + this.points[j].x + ", " + this.points[j].y + ") not returning expected sum," + 
                    "Point(" + this.sums[k].x + ", " + this.sums[k].y + ").");
                k++;
            }
        }
        // greater than two points
        assert.isTrue(Point.sum(this.points).equals(this.totSum), "Total sum not being calculated correctly.");

        // false check
        assert.isNotTrue(Point.sum(this.points).equals(new Point(1, 1)), "Total sum not being calculated correctly.");
    });

    it ('should find the distance between two points', function(){
        // distance(pt1, pt2)
        let k = 0; // dist pointer
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i; j < this.points.length; j++) {
                assert.equal(Point.distance(this.points[i], this.points[j]), this.dist[k], 
                    "distance calculated not matching expected.");
                k++;
            }
        }

        // false check
        assert.notEqual(Point.distance(this.points[0], this.points[0]), 1,
            "distance calculated not returning false correctly.");
    });

    it ('should give the angle between two points', function(){
        // angle(pt1, pt2)
        let k = 0; // ang pointer
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                assert.equal(Point.angle(this.points[i], this.points[j]), this.ang[k], 
                    "angle calculated not matching expected.");
                k++;
            }
        }

        // false check
        assert.notEqual(Point.angle(this.points[0], this.points[1]), 1,
            "angle calculated not returning false correctly.");
    });

    it ('should give the angle of a given point', function(){
        // angle(pt1)
        for (let i = 1; i < this.points.length; i++) {
            assert.equal(Point.angle(this.points[i], null), this.ang[i - 1], 
                "absolute angle calculated not matching expected.");
        }

        // false check
        assert.notEqual(Point.angle(this.points[1], null), 1,
            "angle calculated not returning false correctly.");
    });

    it ('should find the X intercept made by the line generated by two points', function(){
        // getXIntercept (l, r, y)
        let y = 2;  // given y value for all cases
        let k = 0; // xInt pointer
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                assert.equal(Point.getXIntercept(this.points[i], this.points[j], y), this.xInt[k], 
                    "intercept calculated not matching expected.");
                k++;
            }
        }

        // false check
        assert.notEqual(Point.getXIntercept(this.points[0], this.points[1], y), 1,
            "intercept calculated not returning false correctly.");
    });

    it ('should find the midpoint between two points', function(){
        // getMidPoint (l, r)
        let k = 0; // mid pointer
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i; j < this.points.length; j++) {
                assert.isTrue(Point.getMidPoint(this.points[i], this.points[j]).equals(this.mids[k]), 
                    "midpoint of Point(" + this.points[i].x + "," + this.points[i].y +
                    ") and Point(" + this.points[j].x + "," + this.points[j].y + 
                    ") should be Point(" + this.mids[k].x + ", " + this.mids[k].y + ")" );
                k++;
            }
        }

        // false check
        assert.notEqual(Point.getMidPoint(this.points[0], this.points[1]), new Point(1,1),
            "midpoint calculated not returning false correctly.");
    });

    it ('should identify the relational positions between two points', function(){
        // NOTE grid is upside down, i.e. y1 > y2 means y1 is BELOW y2
        // isLeft(oth)
        assert.isTrue(this.points[7].isLeft(this.points[3]), "should read pt7 left of pt3");
        assert.isFalse(this.points[3].isLeft(this.points[7]), "should not read pt3 left of pt7");
        // isRight(oth)
        assert.isTrue(this.points[3].isRight(this.points[7]), "should read pt3 right of pt7");
        assert.isFalse(this.points[7].isRight(this.points[3]), "should not read pt7 right of pt3");
        // isAbove(oth)
        assert.isTrue(this.points[5].isAbove(this.points[1]), "should read pt5 above pt1");
        assert.isFalse(this.points[1].isAbove(this.points[5]), "should not read pt1 above pt5");
        // isBelow(oth)
        assert.isTrue(this.points[1].isBelow(this.points[5]), "should read pt1 below pt5");
        assert.isFalse(this.points[5].isBelow(this.points[1]), "should not read pt5 below pt1");
    });
});
