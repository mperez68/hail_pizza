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
		
        this.left = new Point (x, y);
        this.top = new Point (x, y);
        this.right = new Point (x, y);
        this.bottom = new Point (x, y);
		
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

		this.newPoints = [];
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
			// Midpoints
			// else if (this.narrowDetection(this.getMidpoint(oth.left, oth.top)) || this.narrowDetection(this.getMidpoint(oth.top, oth.right))
			// 			|| this.narrowDetection(this.getMidpoint(oth.left, oth.bottom)) || this.narrowDetection(this.getMidpoint(oth.bottom, oth.right))) {
			// 	return true;
			// }
		}
		return false;
	};

	// Broad Detection
	broadDetection(oth) {
		return this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top);
	}

	// Narrow Detection
	narrowDetection(oth) {
		let intersect = this.x;
		let pt1 = new Point(oth.x, oth.y);
		// IF TOP LEFT
		if (oth.y <= this.left.y && oth.x <= this.top.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = this.getX(this.left, this.top, oth.y);
			// Debug points
			if (oth.x >= intersect) pt1.color = 'Green';
			this.newPoints.push(pt1);
			// Returns true if past the intersection point.
			return oth.x >= intersect;
		}
		// IF TOP RIGHT
		else if (oth.y <= this.right.y && oth.x >= this.top.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = this.getX(this.top, this.right, oth.y);
			// Debug points
			if (oth.x <= intersect) pt1.color = 'Green';
			this.newPoints.push(pt1);
			// Returns true if past the intersection point.
			return oth.x <= intersect;
		}
		// IF BOT LEFT
		else if (oth.y >= this.left.y && oth.x <= this.bottom.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = this.getX(this.left, this.bottom, oth.y);
			// Debug points
			if (oth.x >= intersect) pt1.color = 'Green';
			this.newPoints.push(pt1);
			// Returns true if past the intersection point.
			return oth.x >= intersect;
		}
		// IF BOT RIGHT
		else if (oth.y >= this.right.y && oth.x >= this.bottom.x) {
			// Determine point on interesection line given the y of the point being passed in for comparison.
			intersect = this.getX(this.bottom, this.right, oth.y);
			// Debug points
			if (oth.x <= intersect) pt1.color = 'Green';
			this.newPoints.push(pt1);
			// Returns true if past the intersection point.
			return oth.x <= intersect;
		}
		// If in dead zone, point is in the center of the entity so we can assume this is true.
		else {
			return true;
		}
	}

	// HELPER FUNCTIONS
	getX(l, r, y) {
		let m = (r.y - l.y) / (r.x - l.x);
		let b = l.y - (m * l.x);
		return (y - b) / m;
	}

	getMidpoint(l, r){
		let x = (l.x + r.x) / 2;
		let y = (l.y + r.y) / 2;

		return new Point(x,y);
	}
};