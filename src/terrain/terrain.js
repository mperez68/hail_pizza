// Generic Terrain Stub.
class Terrain {
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
		// TODO turn into arrays of items approaching/colliding

		// Create global reference to self
		var that = this;
		// Terrain Collision
		this.game.terrain.forEach(function (terrain) {
			// Collision cases
			if (that != terrain && terrain.BB && that.BB.collide(terrain.BB)) {
				that.isColliding = true;
			}
		});
		// Entities Collision
		this.game.entities.forEach(function (entity) {
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				that.isColliding = true;
			}
		});
		// Markers Collision
		this.game.effects.forEach(function (effect) {
			// Collision cases
			if (that != effect && effect.BB && that.BB.collide(effect.BB)) {
				that.isColliding = true;
			}
		});
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, this.width, this.height, this.direction);
	};

    draw(ctx) {
		// Animate frame
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			if (this.isColliding) this.BB.draw(ctx, this.game, "Green");
			else this.BB.draw(ctx, this.game, "Red");
		}
    };
}