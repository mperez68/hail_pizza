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
        return new Vector(angle(sum(points)),
            Point.distance(new Point(0,0), Point.sum(points)));
    }

	getHead() {
		return new Point(this.magnitude * Math.cos(getRad(this.angle)),
			this.magnitude * Math.sin(getRad(this.angle)));
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

module.exports = Vector