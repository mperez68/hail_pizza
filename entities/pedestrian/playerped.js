// Player as a pedestrian object
class PlayerPed {
	constructor(game, x, y, direction, width, height) {
        // Constants
        this.RUN_SPEED = 4;
        this.PIVOT_SPEED = 3;

		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");

		// Animations
		this.standing = new Animator(spritesheet, 0, height,
			width, height, 5, 0.2, 1, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 0, 0,
			width, height, 12, 0.06, 1, direction, false, true);	// Walking

        this.pedestrian = new Pedestrian(game, x, y, direction, width, height, this.standing);
    }

	setHP(hp) {this.pedestrian.setHP(hp); };
	getHP(){ return this.pedestrian.getHP(); };

	damage(dmg) { return this.pedestrian.damage(dmg) };
	push(a, d) {
		this.pedestrian.push(a,d);
	}

	setup() {
		this.pedestrian.entity.animation = this.standing;

		// parent setup
		this.pedestrian.setup();
	}

    update() {
		// Check for keyboard input to determine movement.
        this.controls();

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
        // temp for entity
        let ent = this.pedestrian.entity;

		// Forward OR Backward, forward taking precedent.
		if (this.game.forward) {
			ent.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * ent.direction));
			ent.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * ent.direction));
			ent.animation = this.walking;	// Update animation to be walking
		} else if (this.game.backward) {
			ent.x -= (this.RUN_SPEED * Math.cos((Math.PI / 180) * ent.direction) * 0.5);
			ent.y -= (this.RUN_SPEED * Math.sin((Math.PI / 180) * ent.direction) * 0.5);
			ent.animation = this.walking;	// Update animation to be walking
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			ent.direction -= this.PIVOT_SPEED;
		}
		if (this.game.right) {
			ent.direction += this.PIVOT_SPEED;
		}
	}

    draw(ctx) {
        this.pedestrian.draw(ctx);
    }
};