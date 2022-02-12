// Vehicle Entity
class Vehicle {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.MAX_SPEED = 30;
		this.ACCELERATION = 2;
		this.PIVOT_SPEED = 3;
		this.BRAKE_FRICTION = 0.5;
		// Assign Object Variables
		Object.assign(this, { game });
		this.isAccelerating = false;
		this.isDecelerating = false;
		this.currentSpeed = 0;
		
		// Default Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");
		this.idle = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// idle

		// Initialize 'parent' object
		this.entity = new Entity(game, x, y, direction, 1, width, height, this.idle);

		// Override Constants
		this.entity.MAX_SPEED = this.MAX_SPEED;
		this.entity.FRICTION = this.ACCELERATION / 2;
	};

	getTurnRadius() {
		return this.MAX_SPEED / getRad(this.PIVOT_SPEED);
	}

	setHP(hp) {this.entity.setHP(hp); };
	getHP(){ return this.entity.getHP(); };

	damage(dmg) {
		let result = this.entity.damage(dmg);
		//if (result) this.game.addBackground(new Splatter(this.game, this.entity.x, this.entity.y, this.entity.direction, 34, 34, 0));
		return result;
	}
	addForce(a, d) {
		this.entity.addForce(a,d);
	}

	setup() {
		this.isAccelerating = false;
		this.isDecelerating = false;

		// Parent setup
		this.entity.setup();
	}
	
	update() {
		// Collision Cases
		this.updateCollision();

		// Pathfinding
		if (this.goal) this.pathfind();
		//this.updateMovement();

		// Parent update
		this.entity.update();

		this.updateBB();
		//this.entity.forces.push( new ForceVector(this.game, this.entity.BB.x, this.entity.BB.y, this.entity.BB.direction, this.currentSpeed) );
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.game, this.entity.x - (this.entity.width / 2), this.entity.y - (this.entity.height / 2),
											(3 * this.entity.width) / 4, this.entity.height / 2, this.entity.direction);
		this.nextBB = new BoundingBox(this.game, this.BB.x + ((3 * this.entity.width) / 4 * Math.cos((Math.PI / 180) * this.entity.direction)),
											this.BB.y + ((3 * this.entity.height) / 4 * Math.sin((Math.PI / 180) * this.entity.direction)),
											(3 * this.entity.width) / 4, this.entity.height / 2, this.entity.direction);

		this.setBB(this.BB);
		this.setNextBB(this.nextBB);
	};

	updateCollision() {
		// Update self
		this.BB = this.getBB();
		this.nextBB = this.getNextBB();

		// Collision
		// var that = this;
		// this.game.entities.forEach(function (entity) {
		// 	// Action predictions
		// 	if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
		// 		if (entity instanceof NeutralVehicle) {	
		// 			that.isApproaching = true;
		// 		}
		// 	}
		// 	// Collision cases
		// 	if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
		// 		if ( (entity instanceof PlayerPed || entity instanceof NeutralPed) && !entity.dead) {	
		// 			that.isColliding = true;
		// 			entity.isColliding = true;
					
		// 			if (entity.damage(5)) entity.addForce( Math.round( getAngle(that.BB, entity.BB)), Math.round(getDistance(that.BB,entity.BB) ) );
		// 		}
		// 		if ( (entity instanceof NeutralVehicle) && !entity.dead) {	
		// 			that.isColliding = true;
		// 			entity.isColliding = true;

		// 			entity.addForce( Math.round( getAngle(that.BB, entity.BB)), Math.round( 2 ) );
		// 			//entity.addForce( Math.round( getAngle(that.BB, entity.BB)), Math.round(getDistance(that.BB,entity.BB) ) );
		// 		}
		// 	}
		// });

		// Update parent BB
		this.setBB(this.BB);
		this.setNextBB(this.nextBB);

		// Parent updateCollision
		this.entity.updateCollision();
	}

	// Because typical inheritance doesn't work in Javascript in any simple way, we are using getters/setters for protected members.
	// This ensures that while this object is interfacing with protected members in a typical way, only one object is ever being used.
	// Getters
	getBB() { return this.entity.getBB(); };
	getNextBB() { return this.entity.getNextBB(); };

	// Setters
	setBB(bb) { this.entity.setBB(bb); }
	setNextBB(bb) { this.entity.setNextBB(bb); }

	pathfind(){
		// Determine Distance/Angle
		let d = this.getDistanceToGoal();
		let a = this.getAngleToGoal();

		let diff = a - this.entity.direction;
		while (diff < 0) diff += 360;
		diff = diff % 360;

		// Align direction
		if ( diff >= 0 && diff < 180 ) {
			if (this.currentSpeed > 0){
				this.right();
			} else {
				this.left();
			}
		}
		if ( diff >= 180 && diff < 360 ) {
			if (this.currentSpeed > 0){
				this.left();
			} else {
				this.right();
			}
		}
		if ( Math.abs(this.entity.direction - a) <= this.PIVOT_SPEED ) this.entity.direction = a;

		// Move closer
		if ( (d < this.getTurnRadius()) && diff > 30 && diff < 330 ) {
			this.reverse();
		} else {
			if (this.getRollDistance() < this.getDistanceToGoal()) {
				this.accelerate();
			}
		}
	}

	right() {
		// turning only happens when moving TODO fix reverse turning
		if (Math.abs(this.entity.direction - this.entity.netForce.force) > 90) {
			this.entity.direction -= this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
			this.entity.netForce.direction -= this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
		} else {
			this.entity.direction += this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
			this.entity.netForce.direction += this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
		}
	}

	left() {
		// turning only happens when moving
		if (Math.abs(this.entity.direction - this.entity.netForce.force) > 90) {
			this.entity.direction += this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
			this.entity.netForce.direction += this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
		} else {
			this.entity.direction -= this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
			this.entity.netForce.direction -= this.PIVOT_SPEED * (this.entity.netForce.force / this.MAX_SPEED)
		}
	}

	accelerate() {
		// if (this.currentSpeed + this.ACCELERATION < this.MAX_SPEED) {
		// 	this.currentSpeed += this.ACCELERATION;
		// } else {
		// 	this.currentSpeed = this.MAX_SPEED;
		// }
		this.isAccelerating = true;
		this.addForce(this.entity.direction, this.ACCELERATION);
	}

	reverse() {
		// if (this.currentSpeed - (this.ACCELERATION / 2) > -(this.MAX_SPEED / 2)) {
		// 	this.currentSpeed -= this.ACCELERATION;
		// } else {
		// 	this.currentSpeed = -this.MAX_SPEED / 2;
		// }
		this.isDecelerating = true;
		this.addForce(this.entity.direction, - this.ACCELERATION);
	}

	brake() {
		if (this.currentSpeed > this.BRAKE_FRICTION) this.currentSpeed -= this.BRAKE_FRICTION;
		else if (this.currentSpeed < -this.BRAKE_FRICTION) this.currentSpeed += this.BRAKE_FRICTION;
		else this.currentSpeed = 0;
	}

	updateMovement() {
		let xVector = (this.currentSpeed * Math.cos((Math.PI / 180) * this.entity.direction));
		let yVector = (this.currentSpeed * Math.sin((Math.PI / 180) * this.entity.direction));

		// Friction
		if (!this.isAccelerating && this.currentSpeed > 0) this.currentSpeed -= this.entity.FRICTION;
		if (!this.isDecelerating && this.currentSpeed < 0) this.currentSpeed += this.entity.FRICTION;

		// Normalize near 0 values
		if (Math.abs(this.currentSpeed) < this.entity.FRICTION) this.currentSpeed = 0;

		// Move based on speed
		this.entity.x += xVector;
		this.entity.y += yVector;
	}

	getDistanceToGoal() {
		let d = 9999;
		if (this.goal) d = getDistance(this.entity, this.goal);
		return d;
	}

	getAngleToGoal() {
		let a = 0;
		if (this.goal) a = getAngle(this.entity, this.goal);
		return a;
	}

	getRollDistance() {
		return this.getDistanceHelper(this.currentSpeed, this.entity.FRICTION);
	}

	getBrakeDistance() {
		return this.getDistanceHelper(this.currentSpeed, this.BRAKE_FRICTION);
	}

	getDistanceHelper(speed, friction) {
		if (speed <= friction) return Math.max(0, speed);
		return speed + this.getDistanceHelper(speed - friction, friction);
	}

	draw(ctx) {
		// Parent draw
		this.entity.draw(ctx);
	};
};
