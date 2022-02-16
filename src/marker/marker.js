// Generic Marker Stub.
class Marker {
    constructor(game, x, y, direction, scale, width, height, animation) {
        // Parameters
        Object.assign(this, { game, x, y, direction, scale, width, height, animation })
		
		this.updateBB();
    }

    setup() {
		// reset flags
        this.isColliding = false;
    }

    update() {
        //
		this.updateBB();
		this.updateCollision();
    }

	updateCollision() {
		//
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x, this.y, this.width, this.height, this.direction);
	};

    draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, null, ctx,
            this.x - this.game.camera.x, this.y - this.game.camera.y, 1);

        // Debug box drawing
        if (PARAMS.DEBUG) {
			if (this.isColliding) this.BB.draw(ctx, this.game, "Green");
			else this.BB.draw(ctx, this.game, "Red");
        }
    }
}