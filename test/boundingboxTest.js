const assert = require('chai').assert;
const BoundingBox = require('../src/boundingbox');
const Point = require('../src/point');

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
        this.width = 4;
        this.angWidth = Math.sqrt(18);  // 4.24...
        this.xCoords = [ 0, 3, 6, 10, 10 ];
        this.yCoords = [ 0, 1, 0,  0,  4 ];
        this.brdRes =  [  true,  true, false, false, false,
                                 true,  true, false, false,
                                        true,  true,  true,
                                               true,  true,
                                                      true ];
        this.trueRes = [  true,  true, false, false, false,
                                 true,  true, false, false,
                                        true,  true, false,
                                               true,  true,
                                                      true ];
        this.xPtCoords = [ 1, 3, 8, 8 ];
        this.yPtCoords = [ 1, 3, 2, 0 ];
        // Pts vs. bb[0] & bb[3]
        this.nrw0Res = [ true, false, false, false ];
        this.nrw3Res = [ false, false, false, true ];

        this.BBs = [];
        this.points = [];
        
        // Upright bounding boxes
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length) - 2; i++){
            this.BBs.push(new BoundingBox(this.xCoords[i], this.yCoords[i], this.width, this.width, 0));
        }
        // angled bounding boxes
        this.BBs.push(new BoundingBox(this.xCoords[3], this.yCoords[3], this.angWidth, this.angWidth, 45));
        this.BBs.push(new BoundingBox(this.xCoords[4], this.yCoords[4], this.angWidth, this.angWidth, 45));
        // Points
        for (let i = 0; i < Math.min(this.xPtCoords.length, this.yPtCoords.length); i++){
            this.points.push(new Point(this.xPtCoords[i], this.yPtCoords[i]));
        }
    });
    
    // Test names are written in plain english, directly explain what the purpose of the test is.

    it ('should construct bounding boxes', function(){
        // * constructor (x, y, width, height, direction)
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length) - 2; i++){
            assert.isTrue((this.BBs[i].x - this.xCoords[i]) < 0.001, "BB not assigning x @ " + i);
            assert.isTrue((this.BBs[i].y - this.yCoords[i]) < 0.001, "BB not assigning y @ " + i);
            assert.isTrue((this.BBs[i].width - this.width) < 0.001, "BB not assigning width @ " + i);
            assert.isTrue((this.BBs[i].height - this.width) < 0.001, "BB not assigning width @ " + i);
            assert.isTrue((this.BBs[i].direction - 0) < 0.001, "BB not assigning direction @ " + i);
        }
        assert.isTrue((this.BBs[3].x - this.xCoords[3]) < 0.001, "BB not assigning x @ 3");
        assert.isTrue((this.BBs[3].y - this.yCoords[3]) < 0.001, "BB not assigning y @ 3");
        assert.isTrue((this.BBs[3].width - this.angWidth) < 0.001, "BB not assigning width @ 3");
        assert.isTrue((this.BBs[3].height - this.angWidth) < 0.001, "BB not assigning width @ 3");
        assert.isTrue((this.BBs[3].direction - 45) < 0.001, "BB not assigning direction @ 3");
    });

    it ('should compare two bounding boxes', function(){
        // equals (oth)
        for (let i = 0; i < Math.min(this.xCoords.length, this.yCoords.length) - 2; i++){
            assert.isTrue(this.BBs[i].equals(new BoundingBox(this.xCoords[i], this.yCoords[i], this.width, this.width, 0)),
                "BB not correctly comparing at index " + i);
        }
        assert.isTrue(this.BBs[3].equals(new BoundingBox(this.xCoords[3], this.yCoords[3], this.angWidth, this.angWidth, 45)),
            "BB not correctly comparing at index 3");
    });

    it ('should broadly detect if another bounding box is colliding', function(){
        // * broadDetection (oth)
        let k = 0;  // collide results pointer
        for (let i = 0; i < this.BBs.length; i++){
            for (let j = i; j < this.BBs.length; j++){
                assert.equal(this.BBs[i].broadDetection(this.BBs[j]), this.brdRes[k], "collision not detected correctly @ k=" + k);
                k++;
            }
        }
    });

    it ('should narrowly detect if a point is colliding', function(){
        // * narrowDetection (oth)
        
        for (let i = 0; i < this.points.length; i++){
            assert.equal(this.BBs[0].narrowDetection(this.points[i]), this.nrw0Res[i], "bb0 collision not detected correctly @ i=" + i);
            assert.equal(this.BBs[3].narrowDetection(this.points[i]), this.nrw3Res[i], "bb3 collision not detected correctly @ i=" + i);
            
        }
    });

    it ('should detect if it is colliding with another bounding box', function(){
        // * collide (oth)
        let k = 0;  // collide results pointer
        for (let i = 0; i < this.BBs.length; i++){
            for (let j = i; j < this.BBs.length; j++){
                assert.equal(this.BBs[i].collide(this.BBs[j]), this.trueRes[k], "collision not detected correctly @ k=" + k);
                k++;
            }
        }
    });
});