class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	isLeft(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.x <= oth.x) returnFlag = true;
		} else {
			if (this.x <= oth) returnFlag = true;
		}
		return returnFlag;
	}
	
	isRight(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.x >= oth.x) returnFlag = true;
		} else {
			if (this.x >= oth) returnFlag = true;
		}
		return returnFlag;
	}
	
	isAbove(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.y <= oth.y) returnFlag = true;
		} else {
			if (this.y <= oth) returnFlag = true;
		}
		return returnFlag;
	}
	
	isBelow(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.y >= oth.y) returnFlag = true;
		} else {
			if (this.y >= oth) returnFlag = true;
		}
		return returnFlag;
	}
}

// Improved bounding box, allows 360 degree movement and calculates collisions at odd angles.
class BoundingBox {
    constructor(x, y, width, height, direction) {
        Object.assign(this, { x, y, width, height });
		
		this.direction = direction;
		
		this.radians = [ (this.direction) * (Math.PI / 180) + Math.atan(this.width / this.height ),
						(this.direction) * (Math.PI / 180) - Math.atan(this.width / this.height ),
						(this.direction - 180) * (Math.PI / 180) + Math.atan(this.width / this.height ),
						(this.direction - 180) * (Math.PI / 180) - Math.atan(this.width / this.height ) ];
			
		this.distance = Math.sqrt( Math.pow( this.width / 2 , 2) + Math.pow( this.height / 2 , 2)  );
		
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
    };

    collide(oth) {
		if (oth instanceof AngleBoundingBox) {
			if (this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top)) return true;
		} else if (oth instanceof Point) {
			if (this.right > oth.x && this.left < oth.x && this.top < oth.y && this.bottom > oth.y) return true;
		} else {
			return this.cornerCollision(oth);
        }
		return false;
	};
    
	cornerCollision(oth) {
		// Broad collision
		if (this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top)) {
			// Narrow detection
			if (this.x > oth.x) {
				// other object is colliding from the RIGHT...
				if (this.y > oth.y) {
					// other object is colliding from TOP RIGHT
					if ( oth.left <= this.getX(this.top, this.right, oth.bottom) ) return true;
				} else if (this.y < oth.y){
					// other object is colliding from BOTTOM RIGHT
					if ( oth.left <= this.getX(this.bottom, this.right, oth.top) ) return true;
				}
			}else if (this.x < oth.x) {
				// other object is colliding from the LEFT...
				if (this.y > oth.y) {
					// other object is colliding from TOP LEFT
					if ( oth.right >= this.getX(this.left, this.top, oth.bottom) ) return true;
				} else if (this.y < oth.y){
					// other object is colliding from BOTTOM LEFT
					if ( oth.right >= this.getX(this.left, this.bottom, oth.top) ) return true;
				}
			}
			
			
		}
		return false;
	}
	
	cornerCollisionAngle(oth) {
		// Broad collision
		if (this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top)) {
			if (this instanceof driver) return true;
			// Edge case, this object is not angled oddly.
			let buffer = 15;
			if (this.direction % 90 < buffer) return true;
			if (this.direction % 90 > 90 - buffer) return true;
			// Narrow detection
			if (this.x < oth.x) {
				// other object is colliding from the RIGHT...
				if (this.y > oth.y) {
					// other object is colliding from TOP RIGHT
					if ( oth.left.x <= this.getX(this.top, this.right, oth.bottom.y) ) return true;
				} else if (this.y < oth.y){
					// other object is colliding from BOTTOM RIGHT
					if ( oth.left.x <= this.getX(this.bottom, this.right, oth.top.y) ) return true;
				}
			}else if (this.x > oth.x) {
				// other object is colliding from the LEFT...
				if (this.y > oth.y) {
					// other object is colliding from TOP LEFT
					if ( oth.right.x >= this.getX(this.left, this.top, oth.bottom.y) ) return true;
				} else if (this.y < oth.y){
					// other object is colliding from BOTTOM LEFT
					if ( oth.right.x >= this.getX(this.left, this.bottom, oth.top.y) ) return true;
				}
			}
		}
		return false;
	}
	
	getY(leftPoint, rightPoint, x) {
		let m = (rightPoint.x - leftPoint.x) / (rightPoint.y - leftPoint.y);
		let b = leftPoint.y - (m * leftPoint.x);
		
		return (m * x) + b;
	}
	
	getX(leftPoint, rightPoint, y) {
		let m = (rightPoint.x - leftPoint.x) / (rightPoint.y - leftPoint.y);
		let b = leftPoint.y - (m * leftPoint.x);
		
		return (y - b) / m;
	}
};