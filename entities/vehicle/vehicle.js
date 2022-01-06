// Vehicle Entity
class Vehicle {
	constructor(game, x, y, direction, width, height, animation) {
		// Constants
		this.MAX_SPEED = 6;
		this.ACCELERATION = 0.25;
		this.PIVOT_SPEED = 3;
		// Assign Object Variables
		Object.assign(this, { game });
		this.isAccelerating = false;
		this.isDecelerating = false;
		this.currentSpeed = 0;
		this.isReorienting = 0;

		// Initialize 'parent' object
		this.entity = new Entity(game, x, y, direction, 1, width, height, animation);
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
	push(a, d) {
		this.entity.push(a,d);
	}

	setup() {
		this.isAccelerating = false;
		this.isDecelerating = false;

		if (this.game.slider) this.PIVOT_SPEED = this.game.slider;

		// Parent setup
		this.entity.setup();
	}
	
	update() {
		// Pathfinding
		if (this.goal) this.pathfind();

		this.game.camera.rightText = "Turn Radius: " + roundDecimals(this.getTurnRadius(), 2);

		if (!this.isAccelerating && this.currentSpeed > 0) this.currentSpeed -= this.ACCELERATION / 2;
		
		this.updateCollision();

		// Move based on speed
		this.entity.x += (this.currentSpeed * Math.cos((Math.PI / 180) * this.entity.direction));
		this.entity.y += (this.currentSpeed * Math.sin((Math.PI / 180) * this.entity.direction));

		// Parent update
		this.entity.update();

		this.updateBB();
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.entity.x - (this.entity.width / 2), this.entity.y - (this.entity.height / 2),
											(3 * this.entity.width) / 4, this.entity.height / 2, this.entity.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.entity.width) / 4 * Math.cos((Math.PI / 180) * this.entity.direction)),
											this.BB.y + ((3 * this.entity.height) / 4 * Math.sin((Math.PI / 180) * this.entity.direction)),
											(3 * this.entity.width) / 4, this.entity.height / 2, this.entity.direction);

		this.setBB(this.BB);
		this.setNextBB(this.nextBB);
	};

	updateCollision() {
		// Update self
		this.BB = this.getBB();
		this.nextBB = this.getNextBB();

		// This objects collision cases go here

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
		if ( diff >= 0 && diff < 180 ) this.left();
		if ( diff >= 180 && diff < 360 ) this.right();
		if ( Math.abs(this.entity.direction - a) <= this.PIVOT_SPEED ) this.entity.direction = a;

		// Move closer
		if ( (d < this.getTurnRadius()) && diff > 30 && diff < 330 ) {
			this.isReorienting = true;
			this.decelerate();
		} else {
			this.isReorienting = false;
			this.accelerate();
		}
	}

	right() {
		// turning only happens when moving
		this.entity.direction -= this.PIVOT_SPEED * (Math.abs(this.currentSpeed) / this.MAX_SPEED)
	}

	left() {
		// turning only happens when moving
		this.entity.direction += this.PIVOT_SPEED * (Math.abs(this.currentSpeed) / this.MAX_SPEED)
	}

	accelerate() {
		if (this.currentSpeed + this.ACCELERATION < this.MAX_SPEED) {
			this.currentSpeed += this.ACCELERATION;
		} else {
			this.currentSpeed = this.MAX_SPEED;
		}
		this.isAccelerating = true;
	}

	decelerate() {
		if (this.currentSpeed - (this.ACCELERATION / 2) > -(this.MAX_SPEED / 2)) {
			this.currentSpeed -= this.ACCELERATION;
		} else {
			this.currentSpeed = -this.MAX_SPEED / 2;
		}
		this.isDecelerating = true;
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

	draw(ctx) {
		// Parent draw
		this.entity.draw(ctx);
	};
};
