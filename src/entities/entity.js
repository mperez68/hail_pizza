// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale, width, height, animation ) {
		// Parameters
		Object.assign(this, { game, x, y, direction, scale, width, height, animation });
		
		// Initialize private variables
		this.hitPoints = 5;
		this.timers = new Map();
		this.force = new Vector(0, 0);

		if (this instanceof PlayerVehicle) {
			this.addForce(180,25);
			this.damage(1);
			var that = this;
			setTimeout(() => {that.addForce(0, 25)}, 200);
			setTimeout(() => {that.addForce(90, 25)}, 300);
			setTimeout(() => {that.addForce(270, 25)}, 400);
			setTimeout(() => {that.addForce(315, 25)}, 600);
		}
		
		this.updateBB();
	};

	setup() {
		// reset flags
		this.isApproaching = false;
		this.isColliding = false;
	};
	
	update() {
		// Timers
		for(const [key, val] of this.timers) {
			this.timers.set(key, val - 1);	// decrement timer
			if (this.timers.get(key) <= 0) {
				this.timers.delete(key);	// Remove expended timers
			}
		}

		// Forces
		this.x += this.force.getHead().x;
		this.y += this.force.getHead().y;
		// Friction/Drag
		if (this.force.magnitude > 1) {
			this.force.magnitude--;
		} else {
			this.force.magnitude = 0;
		}

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
		if (!this.timers.has("invulnerable")){
			this.hitPoints -= dmg;
			this.timers.set("invulnerable", 25);
			return true;
		}
		return false;
	};

	addForce(a, d) {
		this.force = Vector.sum( [new Vector(a, d), this.force] );
	}

	// TODO addSpin(a, d);
	
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

			if (this.timers.has("invulnerable")) {
				ctx.beginPath();
				ctx.arc(this.x - this.game.camera.x, this.y - this.game.camera.y, 20, 0, 2 * Math.PI);
				ctx.stroke();
			}
		}
	};
};