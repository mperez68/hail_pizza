// Vehicle Entity
class Vehicle extends Entity {
	constructor(game, x, y, direction, width, height, animation) {

		super(game, x, y, direction, 1, width, height, animation);

		// local variables
		let acceleration = 2;
		let pivotSpeed = 0.15;
		Object.assign( this, { acceleration, pivotSpeed } );
	};

	setup() {
		this.isAccelerating = false;
		this.isDecelerating = false;

		// Parent setup
		super.setup();
	};
	
	update() {
		// Pathfinding
		if (this.goal) this.pathfind();

		// Parent update
		super.update();
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x, this.y, (3 * this.width) / 4, this.height / 2, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
											(3 * this.width) / 4, this.height / 2, this.direction);
	};

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
		if ( Math.abs(this.direction - a) <= this.pivotSpeed ) this.direction = a;

		// Move closer
		if ( (d < this.getTurnRadius()) && diff > 30 && diff < 330 ) {
			this.reverse();
		} else {
			if (this.getRollDistance() < this.getDistanceToGoal()) {
				this.accelerate();
			}
		}
	};

	right() {
		this.direction += this.forwardVec() * this.pivotSpeed * (this.drivingVector().magnitude / this.maxSpeed());
	}

	left() {
		this.direction -= this.forwardVec() * this.pivotSpeed * (this.drivingVector().magnitude / this.maxSpeed());
	}

	//returns 1 if moving forward, -1 if moving backward
	forwardVec() {
		let compAngle = (this.force.angle - this.direction + 360) % 360
		let result = 1;	// Default is Forward
		if ( (compAngle < 270) && (compAngle > 90) ) result = -1;	// Reverse case
		return result;
	}

	accelerate() {
		this.addForce(this.direction, this.acceleration);
	}

	reverse() {
		this.addForce(this.direction, - this.acceleration * 0.5);
	}

	brake() {
		this.addForce(this.force.angle, -this.drivingVector().magnitude * 0.1 );
	}

	// determine relative vector from general force to direction
	drivingVector() {
		let diff = Math.abs(this.direction - this.force.angle);
		let driveMag = this.force.magnitude * Math.cos(getRad(diff)); // Magnitude in direction of vehicle facing
		return new Vector(this.direction, driveMag);
	}

	perpendicularVector() {
		let diff = this.direction - this.force.angle;
		let perpMag = this.force.magnitude * Math.sin(getRad(Math.abs(diff))); // Magnitude in direction perpendicular from vehicle facing
		return new Vector(this.direction + diff, perpMag);
	}

	maxSpeed() {
		return this.acceleration / this.DRAG;
	}

	getTurnRadius() {
		return this.MAX_SPEED / getRad(this.pivotSpeed);
	};

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
