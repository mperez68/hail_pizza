// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale) {
		// Parameters
		Object.assign(this, { game, x, y, direction, scale });
		this.width = PARAMS.GRID_WIDTH;
		this.height = PARAMS.GRID_HEIGHT;
		
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
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width, this.direction);
		this.nextBB = new BoundingBox(this.x + (this.width * Math.cos((Math.PI / 180) * this.direction)) - this.width / 2,
											this.y + (this.height * Math.sin((Math.PI / 180) * this.direction)) - this.height / 2,
											this.width, this.height, this.direction);
	};
	
	draw(ctx) {
		this.spritesheet.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			//Draw 4 Bounding Box points to represent corners
			ctx.strokeStyle = 'Red';
			for (var i = 0; i < this.BB.points.length; i++) {
				ctx.beginPath();
				ctx.moveTo(this.BB.points[i].x - this.game.camera.x, this.BB.points[i].y - this.game.camera.y);
				ctx.lineTo(this.BB.points[(i-1 + 4) % 4].x - this.game.camera.x, this.BB.points[(i-1 + 4) % 4].y - this.game.camera.y);
				ctx.stroke();
			}
			ctx.strokeStyle = 'Blue';
			ctx.beginPath();
			ctx.moveTo(this.nextBB.points[0].x - this.game.camera.x, this.nextBB.points[0].y - this.game.camera.y);
			ctx.lineTo(this.nextBB.points[3].x - this.game.camera.x, this.nextBB.points[3].y - this.game.camera.y);
			ctx.stroke();
		}
	};
};