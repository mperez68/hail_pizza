// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale, width, height, animation ) {
		// Constants
		this.FRICTION = 0.1;
		// Parameters
		Object.assign(this, { game, x, y, direction, scale, width, height, animation });
		
		// Initialize generic members
		this.hitPoints = 5;
		this.invulnerable = 0;
		this.isColliding = false;
		this.isApproaching = false;
		
		this.updateBB();
	};

	setup() {
		// reset flags
		this.isApproaching = false;
		this.isColliding = false;
	};
	
	update() {
		// Timers
		if (this.invulnerable >= 0) this.invulnerable--;

		// Equalize direction
		while (this.direction < 0) this.direction += 360;
		this.direction = this.direction % 360;
		
		this.updateBB();

		if (!this.dead) this.updateCollision();
	};

	updateCollision() {
		// TODO turn into arrays of items approaching/colliding

		// Create global reference to self
		var that = this;
		// Terrain Collision
		this.game.terrain.forEach(function (terrain) {
			// Action predictions
			if (that != terrain && terrain.BB && that.nextBB.collide(terrain.BB)) {
				that.isApproaching = true;
			}
			// Collision cases
			if (that != terrain && terrain.BB && that.BB.collide(terrain.BB)) {
				that.isColliding = true;
			}
		});
		// Entities Collision
		this.game.entities.forEach(function (entity) {
			// Action predictions
			if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
				that.isApproaching = true;
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				that.isColliding = true;
			}
		});
		// Markers Collision
		this.game.effects.forEach(function (effect) {
			// Action predictions
			if (that != effect && effect.BB && that.nextBB.collide(effect.BB)) {
				that.isApproaching = true;
			}
			// Collision cases
			if (that != effect && effect.BB && that.BB.collide(effect.BB)) {
				that.isColliding = true;
			}
		});
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, (3 * this.width) / 4, (3 * this.height) / 4, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
												(3 * this.width) / 4, (3 * this.height) / 4, this.direction);
	};

	damage(dmg) {
		if (this.invulnerable <= 0){
			this.hitPoints -= dmg;
			this.invulnerable = 10;
			return true;
		}
		return false;
	};

	addForce(a, d) {
		// If input is valid, then calculate and push
		if (a && d) {
			//console.log("pushing distance " + d + " pixels @ " + a + " degrees");
			this.x += (d * Math.cos((Math.PI / 180) * a));
			this.y += (d * Math.sin((Math.PI / 180) * a));
		}
	}
	
	draw(ctx) {
		// Animate frame
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			if (this.isColliding) this.BB.draw(ctx, this.game, "Green");
			else this.BB.draw(ctx, this.game, "Red");

			if (this.isApproaching) this.nextBB.draw(ctx, this.game, "Blue");
			else this.nextBB.draw(ctx, this.game, "Orange");
		}
	};
};