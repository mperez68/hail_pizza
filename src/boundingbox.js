// Testing imports
try { const Point = require('../src/point'); } catch {  }

// Improved bounding box, allows 360 degree movement and calculates collisions at odd angles.
class BoundingBox {
    constructor(x, y, width, height, direction) {
        Object.assign(this, { x, y, width, height });

		this.direction = direction + 0.000001;
		
		this.radians = [ (this.direction) * (Math.PI / 180) + Math.atan(this.width / this.height ),
						(this.direction) * (Math.PI / 180) - Math.atan(this.width / this.height ),
						(this.direction - 180) * (Math.PI / 180) + Math.atan(this.width / this.height ),
						(this.direction - 180) * (Math.PI / 180) - Math.atan(this.width / this.height ) ];
			
		this.distance = Math.sqrt( Math.pow( this.width / 2 , 2) + Math.pow( this.height / 2 , 2) );
		
        this.left = new Point(x, y);
        this.top = new Point(x, y);
        this.right = new Point(x, y);
        this.bottom = new Point(x, y);
		
		this.points = [];
		for (var i = 0; i < this.radians.length; i++) {
			let temp = new Point(this.x + (Math.sin(this.radians[i]) * this.distance),
									this.y - (Math.cos(this.radians[i]) * this.distance));
			this.points[i] = temp;
			if (temp.isLeft(this.left)) this.left = temp;
			if (temp.isRight(this.right)) this.right = temp;
			if (temp.isAbove(this.top)) this.top = temp;
			if (temp.isBelow(this.bottom)) this.bottom = temp;
		};
    };

	equals(oth) {
		let result = true;
		if (Math.abs(this.x - oth.x) > 0.001) result = false;
		if (Math.abs(this.y - oth.y) > 0.001) result = false;
		if (Math.abs(this.width - oth.width) > 0.001) result = false;
		if (Math.abs(this.height - oth.height) > 0.001) result = false;
		if (Math.abs(this.direction - oth.direction) > 0.001) result = false;
		return result;
	};
	
	// Collision checking function
    collide(oth) {
		// Broad Detection
		if (this.broadDetection(oth)) {
			// Narrow Detection
			// Corners
			if (this.narrowDetection(oth) || this.narrowDetection(oth.left) || this.narrowDetection(oth.top) || this.narrowDetection(oth.right) || this.narrowDetection(oth.bottom)){
				return true;
			}
		}
		// Check reverse detection
		return oth.revCollide(this);
	};
	
	// Collision checking function, breaks if not detected
    revCollide(oth) {
		// Broad Detection
		if (this.broadDetection(oth)) {
			// Narrow Detection
			// Corners
			if (this.narrowDetection(oth) || this.narrowDetection(oth.left) || this.narrowDetection(oth.top) || this.narrowDetection(oth.right) || this.narrowDetection(oth.bottom)){
				return true;
			}
		}
		// Check reverse detection
		return false;
	};

	// Broad Detection
	broadDetection(oth) {
		return this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top);
	};

	// Narrow Detection
	narrowDetection(oth) {
		let intersect = this.x;
		let pt1 = new Point(oth.x, oth.y);
		// IF TOP LEFT
		if (oth.y <= this.left.y && oth.x <= this.top.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = Point.getXIntercept(this.left, this.top, oth.y);
			// Debug points
			if (oth.x >= intersect) pt1.color = 'Green';
			// Returns true if past the intersection point.
			return oth.x >= intersect;
		}
		// IF TOP RIGHT
		else if (oth.y <= this.right.y && oth.x >= this.top.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = Point.getXIntercept(this.top, this.right, oth.y);
			// Debug points
			if (oth.x <= intersect) pt1.color = 'Green';
			// Returns true if past the intersection point.
			return oth.x <= intersect;
		}
		// IF BOT LEFT
		else if (oth.y >= this.left.y && oth.x <= this.bottom.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = Point.getXIntercept(this.left, this.bottom, oth.y);
			// Debug points
			if (oth.x >= intersect) pt1.color = 'Green';
			// Returns true if past the intersection point.
			return oth.x >= intersect;
		}
		// IF BOT RIGHT
		else if (oth.y >= this.right.y && oth.x >= this.bottom.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = Point.getXIntercept(this.bottom, this.right, oth.y);
			// Debug points
			if (oth.x <= intersect) pt1.color = 'Green';
			// Returns true if past the intersection point.
			return oth.x <= intersect;
		}
		// If in dead zone, point is in the center of the entity so we can assume this is true.
		else {
			// TODO check for thin objects where this is not always true
			return true;
		}
	};

	draw(ctx, game, color) {
		//Draw Outline
		ctx.strokeStyle = 'Black';
		if (color) ctx.strokeStyle = color;
		for (var i = 0; i < this.points.length; i++) {
			// Point
			ctx.beginPath();
			ctx.arc(this.points[i].x - game.camera.x, this.points[i].y - game.camera.y, 7, 0, 2 * Math.PI);
			ctx.stroke();
			// Line
			let j = (i-1 + 4) % 4;
			ctx.beginPath();
			ctx.moveTo(this.points[i].x - game.camera.x, this.points[i].y - game.camera.y);
			ctx.lineTo(this.points[j].x - game.camera.x, this.points[j].y - game.camera.y);
			ctx.stroke();
		}
		// Letter Denotations for Points
		ctx.strokeStyle = 'Black';
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("L", this.left.x - game.camera.x, this.left.y - game.camera.y);
		ctx.fillText("T", this.top.x - game.camera.x, this.top.y - game.camera.y);
		ctx.fillText("R", this.right.x - game.camera.x, this.right.y - game.camera.y);
		ctx.fillText("B", this.bottom.x - game.camera.x, this.bottom.y - game.camera.y);
	};
};

// Export for testing
try{
	module.exports = BoundingBox;
} catch (e) {
	//Suppress error BECAUSE module is not used in client BUT is required for Mocha unit testing.
}