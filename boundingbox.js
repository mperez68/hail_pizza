class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.isDrawn = false;
		this.color = 'Red';
	}
	
	isLeft(oth) {
		var returnFlag = false;
		if (this.x <= oth.x) returnFlag = true;
		return returnFlag;
	}
	
	isRight(oth) {
		var returnFlag = false;
		if (this.x >= oth.x) returnFlag = true;
		return returnFlag;
	}
	
	isAbove(oth) {
		var returnFlag = false;
		if (this.y <= oth.y) returnFlag = true;
		return returnFlag;
	}
	
	isBelow(oth) {
		var returnFlag = false;
		if (this.y >= oth.y) returnFlag = true;
		return returnFlag;
	}

	update(){
		//
	}

	draw(ctx){
		// if (PARAMS.DEBUG && !this.isDrawn) {
		// 	this.isDrawn = true;
		// 	ctx.strokeStyle = this.color;
		// 	ctx.beginPath();
		// 	ctx.arc(this.x, this.y, 6, 0, 2 * Math.PI);
		// 	ctx.stroke();
		// }
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

		this.newPoints = [];
    };

    collide(oth) {
		// Broad Detection
		if (this.broadDetection(oth)) {
			// Narrow Detection
			// Corners
			if (this.narrowDetection(oth.left) || this.narrowDetection(oth.top) || this.narrowDetection(oth.right) || this.narrowDetection(oth.bottom)){
				return true;
			} 
			// Midpoints
			else if (this.narrowDetection(this.getMidpoint(oth.left, oth.top) || (this.getMidpoint(oth.top, oth.right))
						|| (this.getMidpoint(oth.left, oth.bottom)) || (this.getMidpoint(oth.bottom, oth.right)))) {
				return true;
			}

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
		if (oth.y < this.left.y && oth.x < this.top.x) {
			intersect = this.getX(this.left, this.top, oth.y);
			let pt2 = new Point(intersect, oth.y);
			if (oth.x > intersect) pt2.color = 'Green'; else pt2.color = 'Blue';
			this.newPoints.push(pt2);
			return oth.x > intersect;
		}
		// IF TOP RIGHT
		if (oth.y < this.right.y & oth.x > this.top.x) {
			intersect = this.getX(this.top, this.right, oth.y);
			this.newPoints.push(pt1);
			let pt2 = new Point(intersect, oth.y);
			if (oth.x > intersect) pt2.color = 'Green'; else pt2.color = 'Blue';
			this.newPoints.push(pt2);
			return oth.x < intersect;
		}
		// IF BOT LEFT
		if (oth.y > this.left.y && oth.x < this.bottom.x) {
			intersect = this.getX(this.left, this.bottom, oth.y);
			this.newPoints.push(pt1);
			let pt2 = new Point(intersect, oth.y);
			if (oth.x > intersect) pt2.color = 'Green'; else pt2.color = 'Blue';
			this.newPoints.push(pt2);
			return oth.x > intersect;
		}
		// IF BOT RIGHT
		if (oth.y > this.right.y && oth.x > this.bottom.x) {
			intersect = this.getX(this.bottom, this.right, oth.y);
			this.newPoints.push(pt1);
			let pt2 = new Point(intersect, oth.y);
			if (oth.x < intersect) pt2.color = 'Green'; else pt2.color = 'Blue';
			this.newPoints.push(pt2);
			return oth.x < intersect;
		}
	}

	// narrowDetection(oth) {
	// 	// Find quadrant, create point
	// 	let intersect1 = this.left.x;
	// 	let intersect2 = this.right.x;
	// 	// IF TOP LEFT
	// 	if (oth.y < this.left.y & oth.x < this.top.x) {
	// 		intersect1 = this.getX(this.left, this.top, oth.y);
	// 		intersect2 = this.getX(this.top, this.right, oth.y);
	// 	}
	// 	// IF TOP RIGHT
	// 	else if (oth.y < this.right.y & oth.x > this.top.x) {
	// 		intersect1 = this.getX(this.left, this.top, oth.y);
	// 		intersect2 = this.getX(this.top, this.right, oth.y);
	// 	}
	// 	// IF BOT LEFT
	// 	else if (oth.y > this.left.y & oth.x < this.bottom.x) {
	// 		intersect1 = this.getX(this.left, this.bottom, oth.y);
	// 		intersect2 = this.getX(this.bottom, this.right, oth.y);
	// 	}
	// 	// IF BOT RIGHT
	// 	else if (oth.y > this.right.y & oth.x > this.bottom.x) {
	// 		intersect1 = this.getX(this.left, this.bottom, oth.y);
	// 		intersect2 = this.getX(this.bottom, this.right, oth.y);
	// 	} else {
	// 		this.newPoints.push(new Point(oth.x, oth.y));
	// 		return true;
	// 	}
		
	// 	if (oth.x > intersect1 && oth.x < intersect2) {
	// 		let pt = new Point(oth.x, oth.y);
	// 		pt.color = 'Green';
	// 		this.newPoints.push(pt);
	// 	}
	// 	this.newPoints.push(new Point(intersect1, oth.y));
	// 	this.newPoints.push(new Point(intersect2, oth.y));

	// 	// Return if it's between two intersects.
	// 	return (oth.x > intersect1 && oth.x < intersect2);
	// }
    
	// cornerCollision(oth) {
	// 	// Broad collision
	// 	if (this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top)) {
	// 		// Narrow detection
	// 		if (this.x < oth.x) {
	// 			// other object is colliding from the RIGHT...
	// 			if (this.y > oth.y) {
	// 				// other object is colliding from TOP RIGHT
	// 				if ( oth.left <= this.getX(this.top, this.right, oth.bottom) ) return true;
	// 			} else {// if (this.y < oth.y){
	// 				// other object is colliding from BOTTOM RIGHT
	// 				if ( oth.left <= this.getX(this.bottom, this.right, oth.top) ) return true;
	// 			}
	// 		}else {//if (this.x < oth.x) {
	// 			// other object is colliding from the LEFT...
	// 			if (this.y > oth.y) {
	// 				// other object is colliding from TOP LEFT
	// 				if ( oth.right >= this.getX(this.left, this.top, oth.bottom) ) return true;
	// 			} else {// if (this.y < oth.y){
	// 				// other object is colliding from BOTTOM LEFT
	// 				if ( oth.right >= this.getX(this.left, this.bottom, oth.top) ) return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }

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