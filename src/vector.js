// Testing imports
try{ Point = require("./point");} catch {  }

function getRad(deg) {
	return deg * (Math.PI / 180);
};

// magnitude vector object
class Vector {
	constructor(angle, magnitude) {
		Object.assign(this, { angle, magnitude });
		this.color = 'Blue';
	}

    static sum(vectors) {
        let points = [];
        for (let i = 0; i < vectors.length; i++){
            points.push(vectors[i].getHead());
        }
		let newHead = Point.sum(points);
		
		let newAng = (Point.angle(newHead, null) + 360) % 360;
		let newMag = Point.distance(new Point(0, 0), newHead);
		if (Math.abs(newMag) < 0.1) return new Vector(0,0);
		
        return new Vector(newAng, newMag);
    }

	equals(oth) {
		let result = true;
		if (Math.abs(this.angle - oth.angle) > 0.1) result = false;
		if (Math.abs(this.magnitude - oth.magnitude) > 0.1) result = false;
		return result;
	}

	getHead() {
		let x = this.magnitude * Math.cos(getRad(this.angle));
		let y = this.magnitude * Math.sin(getRad(this.angle));
		return new Point(x, y);
	}

	draw(ctx, game, x, y) {
		if (!(game instanceof GameEngine)) {
			throw new Error("Null GameEngine Variable!");
		}
		if (PARAMS.DEBUG) {
			let drawX = x + PARAMS.VECTOR_SCALE * this.magnitude * Math.cos(getRad(this.angle)) - game.camera.x;
			let drawY = y + PARAMS.VECTOR_SCALE * this.magnitude * Math.sin(getRad(this.angle)) - game.camera.y;

			ctx.strokeStyle = this.color;
			// Draw Line
			ctx.beginPath();
			ctx.moveTo(x - game.camera.x, y - game.camera.y);
			ctx.lineTo(drawX, drawY);
			ctx.stroke();

			// Draw Head
			ctx.beginPath();
			ctx.arc(drawX, drawY, 3, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}
}

// Export for testing
try{
	module.exports = Vector;
} catch (e) {
	//Suppress error BECAUSE module is not used in client BUT is required for Mocha unit testing.
}
