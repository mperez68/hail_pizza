// Generic Marker Stub.
class Marker {
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
    }
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, this.width, this.height, this.direction);
	};

    draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
            this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);

        // Debug box drawing
        if (PARAMS.DEBUG) {
            this.BB.draw(ctx, this.game, "Red");
        }
    }
}