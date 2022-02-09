// Vehicle Entity
class Vehicle extends Entity {
	constructor(game, x, y, direction, width, height) {
		super(game, x, y, direction, 1, width, height,
			new Animator(ASSET_MANAGER.getAsset("./sprites/drivercar.png"), 0, 0,
			width, height, 1, 1, 1, direction, false, true));
		// Constants
		this.MAX_SPEED = 6;
		this.ACCELERATION = 0.25;
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

		// Override Constants
		this.FRICTION = this.ACCELERATION / 2;
	};

	getTurnRadius() {
		return this.MAX_SPEED / getRad(this.PIVOT_SPEED);
	}

	setup() {
		this.isAccelerating = false;
		this.isDecelerating = false;

		// Parent setup
		super.setup();
	}
	
	update() {
		// Collision Cases
		this.updateCollision();

		// Pathfinding
		if (this.goal) this.pathfind();
		this.updateMovement();

		// Parent update
		super.update();
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - (this.width / 2), this.y - (this.height / 2),
											(3 * this.width) / 4, this.height / 2, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
											(3 * this.width) / 4, this.height / 2, this.direction);
	};

	updateCollision() {
		// Collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			// Action predictions
			if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
				if (entity instanceof NeutralVehicle) {	
					that.isApproaching = true;
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				if ( (entity instanceof PlayerPed || entity instanceof NeutralPed) && !entity.dead) {	
					that.isColliding = true;
					entity.isColliding = true;
					
					if (entity.damage(5)) entity.addForce( Math.round( Point.angle(that.BB, entity.BB)), Math.round(Point.distance(that.BB,entity.BB) ) );
				}
				if ( (entity instanceof PlayerVehicle || entity instanceof NeutralVehicle) && !entity.dead && that != entity) {	
					that.isColliding = true;
					entity.isColliding = true;

					entity.addForce( Math.round( Point.angle(that.BB, entity.BB)), Math.round(Point.distance(that.BB,entity.BB) ) );
				}
			}
		});

		// Parent updateCollision
		super.updateCollision();
	}

	pathfind(){
		// Determine Distance/Angle
		let d = this.getDistanceToGoal();
		let a = this.getAngleToGoal();

		let diff = a - this.direction;
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
		if ( Math.abs(this.direction - a) <= this.PIVOT_SPEED ) this.direction = a;

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
		// turning only happens when moving
		this.direction += this.PIVOT_SPEED * (this.currentSpeed / this.MAX_SPEED)
	}

	left() {
		// turning only happens when moving
		this.direction -= this.PIVOT_SPEED * (this.currentSpeed / this.MAX_SPEED)
	}

	accelerate() {
		if (this.currentSpeed + this.ACCELERATION < this.MAX_SPEED) {
			this.currentSpeed += this.ACCELERATION;
		} else {
			this.currentSpeed = this.MAX_SPEED;
		}
		this.isAccelerating = true;
	}

	reverse() {
		if (this.currentSpeed - (this.ACCELERATION / 2) > -(this.MAX_SPEED / 2)) {
			this.currentSpeed -= this.ACCELERATION;
		} else {
			this.currentSpeed = -this.MAX_SPEED / 2;
		}
		this.isDecelerating = true;
	}

	brake() {
		if (this.currentSpeed > this.BRAKE_FRICTION) this.currentSpeed -= this.BRAKE_FRICTION;
		else if (this.currentSpeed < -this.BRAKE_FRICTION) this.currentSpeed += this.BRAKE_FRICTION;
		else this.currentSpeed = 0;
	}

	updateMovement() {
		let xVector = (this.currentSpeed * Math.cos((Math.PI / 180) * this.direction));
		let yVector = (this.currentSpeed * Math.sin((Math.PI / 180) * this.direction));

		// Friction
		if (!this.isAccelerating && this.currentSpeed > 0) this.currentSpeed -= this.FRICTION;
		if (!this.isDecelerating && this.currentSpeed < 0) this.currentSpeed += this.FRICTION;

		// Normalize near 0 values
		if (Math.abs(this.currentSpeed) < this.FRICTION) this.currentSpeed = 0;

		// Move based on speed
		this.x += xVector;
		this.y += yVector;
	}

	getDistanceToGoal() {
		let d = 9999;
		if (this.goal) d = Point.distance(this, this.goal);
		return d;
	}

	getAngleToGoal() {
		let a = 0;
		if (this.goal) a = Point.angle(this, this.goal);
		return a;
	}

	getRollDistance() {
		return this.getDistanceHelper(this.currentSpeed, this.FRICTION);
	}

	getBrakeDistance() {
		return this.getDistanceHelper(this.currentSpeed, this.BRAKE_FRICTION);
	}

	getDistanceHelper(speed, friction) {
		if (speed <= friction) return Math.max(0, speed);
		return speed + this.getDistanceHelper(speed - friction, friction);
	}
};
