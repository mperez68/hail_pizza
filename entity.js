// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale, width, height, spritesheet) {
		// Parameters
		Object.assign(this, { game, x, y, direction, scale, width, height, spritesheet });
		
		// Initialize generic members
		this.isColliding = false;
		this.isApproaching = false;
		
		this.updateBB();
	};
	
	update() {
		// Equalize direction
		while (this.direction < 0) this.direction += 360;
		this.direction = this.direction % 360;
		
		this.updateBB();
	};

	updateCollision() {
		// add new points
		for (var i = 0; i < this.BB.newPoints.length; i++){
			this.game.addEntity(this.BB.newPoints[i]);
		}
		this.BB.newPoints = [];
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, (3 * this.width) / 4, (3 * this.height) / 4, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
											(3 * this.width) / 4, (3 * this.height) / 4, this.direction);
	};

	getBB() { return this.BB; }
	getNextBB() { return this.nextBB; }

	setBB(bb) { this.BB = bb; }
	setNextBB(bb) { this.nextBB = bb; }
	
	draw(ctx) {
		this.spritesheet.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			//Draw 4 Bounding Box points to represent corners
			ctx.strokeStyle = 'Red';
			if (this.isColliding == true) ctx.strokeStyle = 'Green';
			for (var i = 0; i < this.BB.points.length; i++) {
				let j = (i-1 + 4) % 4;
				ctx.beginPath();
				ctx.moveTo(this.BB.points[i].x - this.game.camera.x, this.BB.points[i].y - this.game.camera.y);
				ctx.lineTo(this.BB.points[j].x - this.game.camera.x, this.BB.points[j].y - this.game.camera.y);
				ctx.stroke();
			}
			// nextBB
			ctx.strokeStyle = 'Blue';
			ctx.beginPath();
			ctx.moveTo(this.nextBB.points[0].x - this.game.camera.x, this.nextBB.points[0].y - this.game.camera.y);
			ctx.lineTo(this.nextBB.points[3].x - this.game.camera.x, this.nextBB.points[3].y - this.game.camera.y);
			ctx.stroke();
			if (this.isApproaching == true) {
				ctx.strokeStyle = 'Red';
				ctx.beginPath();
				ctx.moveTo(this.nextBB.points[0].x - this.game.camera.x, this.nextBB.points[0].y - this.game.camera.y);
				ctx.lineTo(this.nextBB.points[2].x - this.game.camera.x, this.nextBB.points[2].y - this.game.camera.y);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(this.nextBB.points[1].x - this.game.camera.x, this.nextBB.points[1].y - this.game.camera.y);
				ctx.lineTo(this.nextBB.points[3].x - this.game.camera.x, this.nextBB.points[3].y - this.game.camera.y);
				ctx.stroke();
			}
			ctx.font = "12px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("L", this.BB.left.x, this.BB.left.y);
			ctx.fillText("T", this.BB.top.x, this.BB.top.y);
			ctx.fillText("R", this.BB.right.x, this.BB.right.y);
			ctx.fillText("B", this.BB.bottom.x, this.BB.bottom.y);
		}
		this.isApproaching = false;
		this.isColliding = false;
	};
};