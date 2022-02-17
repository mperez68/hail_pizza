//const Vector = require("../Vector");

// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale, width, height, animation ) {
		// Constants
		const DRAG = 4;
		// Parameters
		Object.assign(this, { game, x, y, direction, scale, width, height, animation, DRAG });
		this.collidingWith = [];

		
		// Initialize private variables
		this.hitPoints = 5;
		this.timers = new Map();
		this.force = new Vector(0, 0);
		
		this.updateBB();
		this.z = 1;
	};

	setup() {
		// reset flags
		this.isApproaching = false;
		this.isColliding = false;
		this.noClip = false;
	};
	
	update() {
		// Timers
		for(const [key, val] of this.timers) {
			this.timers.set(key, val - 1);	// decrement timer
			if (this.timers.get(key) <= 0) {
				this.timers.delete(key);	// Remove expended timers
			}
		}

		// Collision Detection
		if (!this.dead) this.updateCollision();

		// Forces
		this.addForce(this.force.angle, (-1 * this.force.magnitude * this.DRAG) / 20);

		// Movement
		if (!this.isApproaching || this.noClip){
			this.x += this.force.getHead().x;
			this.y += this.force.getHead().y;
		}

		// Equalize direction
		while (this.direction < 0) this.direction += 360;
		this.direction = this.direction % 360;
		
		this.updateBB();
	};

	updateCollision() {
		// TODO turn into arrays of items approaching/colliding

		// Create global reference to self
		var that = this;
		// Terrain Collision
		this.game.terrain.forEach(function (terrain) {
			// Action predictions
			if (that != terrain && terrain.BB && that.nextBB.collide(terrain.BB)) {
				// Flag Setting
				that.isApproaching = true;
				that.addForce(Point.angle(terrain, that), that.force.magnitude);	// TODO change to be relative angle to normal force, force equal to normal force + spring
			}
			// Collision cases
			if (that != terrain && terrain.BB && that.BB.collide(terrain.BB)) {
				// Flag Setting
				that.isColliding = true;
				terrain.isColliding = true;
				that.move(Point.angle(terrain,that),1);
			}
		});
		// Entities Collision
		this.game.entities.forEach(function (entity) {
			// Action predictions
			if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
				// Flag Setting
				if (that instanceof Pedestrian && !(entity instanceof Pedestrian)) {
					that.isApproaching = true;
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				// Flag Setting
				that.isColliding = true;
				entity.isColliding = true;

				// Vehicle Damage Cases
				if (that instanceof Vehicle) {
					let d = Math.floor(that.force.magnitude);	// TODO tweak later
					that.addForce(Point.angle(entity, that), d / 2);
					entity.addForce(Point.angle(that, entity), d);
					entity.damage(d);
				}

				// Clipping Nudging
				if(that instanceof Pedestrian){	// TODO Change from value 1 to distance just outside of collision
					if (entity instanceof Vehicle) {
						that.move(Point.angle(entity,that),1);
					} else if (entity instanceof Pedestrian) {
						that.move(Point.angle(entity,that),1);
						entity.move(Point.angle(that,entity),1);
					}
				}
			}
		});
		// Markers Collision
		this.game.effects.forEach(function (effect) {
			// Action predictions
			if (that != effect && effect.BB && that.nextBB.collide(effect.BB)) {
				// Flag Setting
				//that.isApproaching = true;
			}
			// Collision cases
			if (that != effect && effect.BB && that.BB.collide(effect.BB)) {
				if (that instanceof PlayerVehicle) {
					//that.game.camera.nextLevel();
					effect.removeFromWorld = true;
				}
				// Flag Setting
				// that.isColliding = true;
				// effect.isColliding = true;
			}
		});
	};
	
	updateBB(){
		let w = this.width * (0.75) * this.scale;
		let h = this.height * (0.75) * this.scale;
		this.BB = new BoundingBox(this.x, this.y, w, h, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + this.force.getHead().x, this.BB.y + this.force.getHead().y, w, h, this.direction);
	};

	damage(dmg) {
		if (!this.timers.has("invulnerable") && dmg > 0){
			this.hitPoints -= dmg;
			this.timers.set("invulnerable", 25);
			return true;
		}
		return false;
	};

	addForce(a, d) {
		this.force = Vector.sum( [new Vector(a, d), this.force] );
	};

	move(a, d) {
		let v = new Vector(a, d);
		this.x += v.getHead().x;
		this.y += v.getHead().y;
	}

	// TODO addSpin(a, d);
	
	draw(ctx) {
		// Animate frame
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			if (this.isApproaching) this.nextBB.draw(ctx, this.game, "Blue");
			else this.nextBB.draw(ctx, this.game, "Orange");

			if (this.isColliding) this.BB.draw(ctx, this.game, "Green");
			else this.BB.draw(ctx, this.game, "Red");

			if (this.timers.has("invulnerable")) {
				ctx.beginPath();
				ctx.arc((this.x - this.game.camera.x) * PARAMS.SCALE, (this.y - this.game.camera.y) * PARAMS.SCALE, 20, 0, 2 * Math.PI);
				ctx.stroke();
			}

			this.force.draw(ctx, this.game, this.x, this.y);
		}
	};
};