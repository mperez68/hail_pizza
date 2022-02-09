// Player as a pedestrian object
class PlayerPed {
	constructor(game, x, y, direction, width, height) {
		// Assign Object Variables
		Object.assign(this, { game });

        this.pedestrian = new Pedestrian(game, x, y, direction, width, height);

		// Override walking/standing animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");
		this.pedestrian.standing = new Animator(spritesheet, 0, height,
										width, height, 5, 0.2, 1, direction, false, true);		// Standing
		this.pedestrian.walking = new Animator(spritesheet, 0, 0,
										width, height, 12, 0.08, 1, direction, false, true);	// Walking
		this.pedestrian.walkingBack = new Animator(spritesheet, 0, 0,
										width, height, 12, 0.10, 1, direction, true, true);		// Walking Backwards
        // Override Constants
        this.pedestrian.RUN_SPEED = 4;
        this.pedestrian.PIVOT_SPEED = 3;
    }

	setHP(hp) {this.pedestrian.setHP(hp); };
	getHP(){ return this.pedestrian.getHP(); };

	damage(dmg) { return this.pedestrian.damage(dmg) };
	addForce(a, d) {
		this.pedestrian.addForce(a,d);
	}

	setup() {
		this.pedestrian.isWalking = false;

		// parent setup
		this.pedestrian.setup();
	}

    update() {
		if (this.game.forward || this.game.backward || this.game.left || this.game.right) this.intent(null);
		if (this.pedestrian.getDistanceToGoal() < this.pedestrian.entity.width) this.intent(null);

		if (this.game.click != this.lastClick) this.intent(this.game.click);
		this.lastClick = this.game.click;

		// Check for keyboard input to determine movement.
        if (!this.pedestrian.goal) this.controls();

		// Collision
		this.updateCollision();

		// Parent update
        this.pedestrian.update();
	};

	updateCollision(){
		// Update self
		this.BB = this.getBB();
		this.nextBB = this.getNextBB();
		
		// Update parent BB
		this.setBB(this.BB);
		this.setNextBB(this.nextBB);

		// parent updateCollision
		this.pedestrian.updateCollision();
	}

	getBB() { return this.pedestrian.getBB(); };
	getNextBB() { return this.pedestrian.getNextBB(); };

	setBB(bb) { this.pedestrian.setBB(bb); }
	setNextBB(bb) { this.pedestrian.setNextBB(bb); }

	controls() {
		// Forward OR Backward, forward taking precedent.
		if (this.game.forward) {
			this.pedestrian.forward(1);
		} else if (this.game.backward) {
			this.pedestrian.backward(1);
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			this.pedestrian.left(1);
		}
		if (this.game.right) {
			this.pedestrian.right(1);
		}
	}

	intent(point) {
		// Assign goal
		this.pedestrian.goal = point;
	}

    draw(ctx) {
        this.pedestrian.draw(ctx);
    }
};