// Pedestrian Entity
class Pedestrian {
	constructor(game, x, y, direction, width, height, animation) {
		// Constants
		this.RUN_SPEED = 5;
		this.PIVOT_SPEED = 5;
		// Assign Object Variables
		Object.assign(this, { game });
		this.isWalking = false;

		// Initialize 'parent' object
		this.entity = new Entity(game, x, y, direction, 1, width, height, animation);
	};

	setup() {
		// Parent setup
		this.entity.setup();
	}
	
	update() {
		// Pathfinding
		if (this.goal) this.pathfind();
		
		this.updateCollision();

		// Parent update
		this.entity.update();
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
		if ( diff >= 0 && diff < 180 ) this.entity.direction += this.PIVOT_SPEED;
		if ( diff >= 180 && diff < 360 ) this.entity.direction -= this.PIVOT_SPEED;
		if ( Math.abs(this.entity.direction - a) <= 2 * this.PIVOT_SPEED ) this.entity.direction = a;
		// Move closer
		if (d > PARAMS.GRID_WIDTH) {
			this.entity.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction));
			this.entity.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction));
			this.isWalking = true;
		} else if (d > this.entity.width / 2) {
			this.entity.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction)) * (d / PARAMS.GRID_WIDTH);
			this.entity.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction)) * (d / PARAMS.GRID_WIDTH);
			this.isWalking = true;
		}
	}

	getDistanceToGoal() {
		let d = 9999;
		if (this.goal) d = Math.sqrt( Math.pow(this.entity.x - this.goal.x, 2) + Math.pow(this.entity.y - this.goal.y, 2) );
		return d;
	}

	getAngleToGoal() {
		let a = Math.atan( (this.goal.y - this.entity.y) / (this.goal.x - this.entity.x) ) * 180 / Math.PI;
		// Normalize for 360 deg calculation
		if (this.goal.x < this.entity.x) a += 180;
		if (a < 0) a += 360;
		return a;
	}

	draw(ctx) {
		// Parent draw
		this.entity.draw(ctx);
	};
};
