// Point object
class Point {
	constructor(x, y) {
		Object.assign(this, { x, y });
		this.color = 'Red';
	}

	static sum(points) {
		let result = new Point(0,0);
		for (let i = 0; i < points.length; i++)  {
			result.x = result.x + points[i].x;
			result.y = result.y + points[i].y;
		}
		return result;
	}

	static distance(pt1, pt2) {
		return Math.sqrt( Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2) );
	}

	// returns angle between two points
	static angle(pt1, pt2) {
		let a = Math.atan( (pt2.y - pt1.y) / (pt2.x - pt1.x) ) * 180 / Math.PI;
		// Normalize for 360 deg calculation
		if (pt2.x < pt1.x) a += 180;
		if (a < 0) a += 360;
		return a;
	}

	isLeft(oth) {
		var returnFlag = false;
		if (this.x <= oth.x)
			returnFlag = true;
		return returnFlag;
	}

	isRight(oth) {
		var returnFlag = false;
		if (this.x >= oth.x)
			returnFlag = true;
		return returnFlag;
	}

	isAbove(oth) {
		var returnFlag = false;
		if (this.y <= oth.y)
			returnFlag = true;
		return returnFlag;
	}

	isBelow(oth) {
		var returnFlag = false;
		if (this.y >= oth.y)
			returnFlag = true;
		return returnFlag;
	}

	draw(ctx, game) {
		if (!(game instanceof GameEngine)) {
			throw new Error("Null GameEngine Variable!");
		}
		if (PARAMS.DEBUG) {
			ctx.strokeStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x - game.camera.x, this.y - game.camera.y, 6, 0, 2 * Math.PI);
			ctx.stroke();
		}
		this.isDrawn = true;
	}
}
