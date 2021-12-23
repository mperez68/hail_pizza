// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale) {
		// Parameters
		Object.assign(this, { game, x, y, direction, scale });
		this.width = PARAMS.GRID_WIDTH;
		this.height = PARAMS.GRID_HEIGHT;
		
		this.isColliding = false;
		this.isApproaching = false;
		
		// Animations/Bounding Box
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/default.png");
		// (spritesheet, xStart, yStart,
		//		width, height, frameCount, frameDuration, framePadding, angleStart, reverse, loop)
		this.spritesheet = new Animator(this.spritesheet, 0, 0,
			this.width, this.height, 1, 1, 0, direction, false, true);
		this.updateBB();
	};
	
	update() {
		// TODO

		// Collision
		var that = this;

		this.game.entities.forEach(function (entity) {
			// Action predictions
			if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
				if (entity instanceof Entity) {	// collision example
					that.isApproaching = true;
				} else {
					that.isApproaching = false;
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof Entity) {	// collision example
					that.isColliding = true;
					// if (entity.BB.top < that.BB.bottom && entity.BB.top > that.y) that.y = entity.BB.top - that.WIDTH / 2;
					// if (entity.BB.bottom > that.BB.top && entity.BB.bottom < that.y) that.y = entity.BB.bottom + that.WIDTH / 2;
					// if (entity.BB.left < that.BB.right && entity.BB.left > that.x) that.x = entity.BB.left - that.WIDTH / 2;
					// if (entity.BB.right > that.BB.left && entity.BB.right < that.x) that.x = entity.BB.right + that.WIDTH / 2;
				} else {
					that.isColliding = false;
				}
			}
		});
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, (3 * this.width) / 4, (3 * this.height) / 4, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
											(3 * this.width) / 4, (3 * this.height) / 4, this.direction);
	};
	
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
		}
	};
};