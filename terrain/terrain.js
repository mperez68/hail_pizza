// Generic Terrain Stub.
class Terrain {
    constructor(game, x, y, direction, scale, width, height, animation) {
        // Parameters
        Object.assign(this, { game, x, y, direction, scale, width, height, animation })
        this.isColliding = false;
		
		this.updateBB();
    }

    setup() {
        //
    }

    update() {
        //
		this.updateBB();
    }
	
	updateBB(){
		this.BB = new BoundingBox(this.game, this.x - this.width / 2, this.y - this.width / 2, this.width, this.height, this.direction);
	};

	getBB() { return this.BB; }

	setBB(bb) { this.BB = bb; }

    draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
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
            
			ctx.font = "12px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("L", this.BB.left.x - this.game.camera.x, this.BB.left.y - this.game.camera.y);
			ctx.fillText("T", this.BB.top.x - this.game.camera.x, this.BB.top.y - this.game.camera.y);
			ctx.fillText("R", this.BB.right.x - this.game.camera.x, this.BB.right.y - this.game.camera.y);
			ctx.fillText("B", this.BB.bottom.x - this.game.camera.x, this.BB.bottom.y - this.game.camera.y);
		}
    }
}