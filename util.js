// // returns a random integer between 0 and n-1
// function randomInt(n) {
//     return Math.floor(Math.random() * n);
// };

// // returns a string that can be used as a rgb web color
// function rgb(r, g, b) {
//     return "rgb(" + r + "," + g + "," + b + ")";
// };

// // returns a string that can be used as a hsl web color
// function hsl(h, s, l) {
//     return "hsl(" + h + "," + s + "%," + l + "%)";
// };

// returns angle in radians given degrees
function getRad(deg) {
	return deg * (Math.PI / 180);
}

// returns angle in degrees given radians 
function getDeg(rad) {
	return deg * (180 / Math.PI);
}

function roundDecimals(num, dec) {
	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// returns distance between two points
function getDistance(pt1, pt2) {
	return Math.sqrt( Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2) );
}

// returns angle between two points
function getAngle(pt1, pt2) {
	let a = Math.atan( (pt2.y - pt1.y) / (pt2.x - pt1.x) ) * 180 / Math.PI;
	// Normalize for 360 deg calculation
	if (pt2.x < pt1.x) a += 180;
	if (a < 0) a += 360;
	return a;
}

// creates an alias for requestAnimationFrame for backwards compatibility
// window.requestAnimFrame = (function () {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         function (/* function */ callback, /* DOMElement */ element) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();


// ----- ----- ----- Objects ----- ----- ----- //

// Point object
class Point {
	constructor(game, x, y) {
		Object.assign( this, {game, x, y} )
		this.isDrawn = false;
		this.color = 'Red';
		this.removeFromWorld = false;
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

	setup() {
		//
	}

	update(){
		if (this.isDrawn) this.removeFromWorld = true;
	}

	draw(ctx){
		if (PARAMS.DEBUG) {
			ctx.strokeStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x - this.game.camera.x, this.y - this.game.camera.y, 6, 0, 2 * Math.PI);
			ctx.stroke();
		}
		this.isDrawn = true;
	}
}

// Force vector object
class ForceVector {
	constructor(game, x, y, direction, force) {
		Object.assign (this, { game, x, y, direction, force });
		this.isDrawn = false;
		this.color = 'Blue';
		this.removeFromWorld = false;
	}

	setup() {
		//
	}

	update(){
		if (this.isDrawn) this.removeFromWorld = true;
	}

	getHead() {
		return new Point (this.getHeadX(), this.getHeadY());
	}

	getHeadX() {
		return this.x + this.force * Math.cos(getRad(this.direction));
	}

	getHeadY() {
		return this.y + this.force * Math.sin(getRad(this.direction));
	}

	draw(ctx){
		if (PARAMS.DEBUG) {
			let drawX = this.x + PARAMS.VECTOR_SCALE * this.force * Math.cos(getRad(this.direction)) - this.game.camera.x;
			let drawY = this.y + PARAMS.VECTOR_SCALE * this.force * Math.sin(getRad(this.direction)) - this.game.camera.y;

			ctx.strokeStyle = this.color;
			// Draw Line
			ctx.beginPath();
			ctx.moveTo(this.x - this.game.camera.x, this.y - this.game.camera.y);
			ctx.lineTo(drawX, drawY);
			ctx.stroke();

			// Draw Head
			ctx.beginPath();
			ctx.arc(drawX, drawY, 3, 0, 2 * Math.PI);
			ctx.stroke();
		}
		this.isDrawn = true;
	}
}

// ----- ----- ----- global parameters ----- ----- ----- //
const PARAMS = {
	DEBUG: false,
	MUSIC: true,
	MAP_WIDTH: 6400,
	MAP_HEIGHT: 6400,
	GRID_WIDTH: 64,
	GRID_HEIGHT: 64,
	VECTOR_SCALE: 5,
	SCALE: 1
};
