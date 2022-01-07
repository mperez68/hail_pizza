// Pedestrian Entity
class Pedestrian {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.RUN_SPEED = 3;
		this.PIVOT_SPEED = 3;
		// Assign Object Variables
		Object.assign(this, { game });
		this.isWalking = false;
		
		// Default Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");

		this.standing = new Animator(spritesheet, 0, height,
			width, height, 12, 0.2, 0, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 228, height,
			width, height, 8, 0.08, 0, direction, false, true);	// Walking
		this.walkingBack = new Animator(spritesheet, 228, height,
			width, height, 8, 0.10, 0, direction, true, true);	// Walking Backward

		// Initialize 'parent' object
		this.entity = new Entity(game, x, y, direction, 1, width, height, this.standing);
	};

	getTurnRadius() {
		return this.RUN_SPEED / getRad(this.PIVOT_SPEED);
	}

	setHP(hp) {this.entity.setHP(hp); };
	getHP(){ return this.entity.getHP(); };

	damage(dmg) {
		let result = this.entity.damage(dmg);
		if (result) this.game.addBackground(new Splatter(this.game, this.entity.x, this.entity.y, this.entity.direction, 34, 34, 0));
		return result;
	}
	push(a, d) {
		this.entity.push(a,d);
	}

	setup() {
		this.walkingVector = 0;

		// Parent setup
		this.entity.setup();
	}
	
	update() {
		// Collision Cases
		this.updateCollision();

		// Pathfinding
		if (this.goal) this.pathfind();

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
		if ( diff >= 0 && diff < 180 ) this.right(1);
		if ( diff >= 180 && diff < 360 ) this.left(1);
		if ( Math.abs(this.entity.direction - a) <= 2 * this.PIVOT_SPEED ) this.entity.direction = a;
		// Move closer
		if ( (d < this.getTurnRadius()) && diff > 30 && diff < 330 ) {
			this.backward(0.2);
		} else {
			this.forward(1);
		}
	}

	forward(scale) {
		this.walkingVector = 1;

		this.entity.x += this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction) * scale;
		this.entity.y += this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction) * scale;
	}

	backward(scale) {	
		this.walkingVector = -0.5;

		this.entity.x -= (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction) * scale) / 2;
		this.entity.y -= (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction) * scale) / 2;
	}

	left(scale) {
		this.entity.direction -= this.PIVOT_SPEED * scale;
	}

	right(scale) {
		this.entity.direction += this.PIVOT_SPEED * scale;
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
		// Update animation
		this.entity.animation = this.standing;	// init
		if (this.walkingVector > 0) this.entity.animation = this.walking;
		if (this.walkingVector < 0) this.entity.animation = this.walkingBack;

		// Update debug walking vector
		this.entity.newForces.push( new ForceVector(this.game, this.entity.BB.x, this.entity.BB.y, this.entity.BB.direction, this.walkingVector * this.RUN_SPEED) );

		// Parent draw
		this.entity.draw(ctx);
	};
};
