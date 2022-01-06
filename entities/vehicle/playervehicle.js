// Player as a vehicle object
class PlayerVehicle {
	constructor(game, x, y, direction, width, height) {
        // Constants
        // this.vehicle.RUN_SPEED = 4;
        // this.vehicle.PIVOT_SPEED = 3;

		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");

		// Animations
		this.standing = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// Walking

        this.vehicle = new Vehicle(game, x, y, direction, width, height, this.standing);
    }

	setHP(hp) {this.vehicle.setHP(hp); };
	getHP(){ return this.vehicle.getHP(); };

	damage(dmg) { return this.vehicle.damage(dmg) };
	push(a, d) {
		this.vehicle.push(a,d);
	}

	setup() {
		this.vehicle.entity.animation = this.standing;

		// parent setup
		this.vehicle.setup();
	}

    update() {
		// Check for keyboard input to determine movement.
        this.controls();

		// Collision
		this.updateCollision();

		// Parent update
        this.vehicle.update();
	};

	updateCollision(){
		// Update self
		this.BB = this.getBB();
		this.nextBB = this.getNextBB();
		
		// Update parent BB
		this.setBB(this.BB);
		this.setNextBB(this.nextBB);

		// parent updateCollision
		this.vehicle.updateCollision();
	}

	getBB() { return this.vehicle.getBB(); };
	getNextBB() { return this.vehicle.getNextBB(); };

	setBB(bb) { this.vehicle.setBB(bb); }
	setNextBB(bb) { this.vehicle.setNextBB(bb); }

	controls() {
        // temp for entity
        let ent = this.vehicle.entity;

		// Forward OR Backward, forward taking precedent.
		if (this.game.forward) {
			ent.x += (this.vehicle.RUN_SPEED * Math.cos((Math.PI / 180) * ent.direction));
			ent.y += (this.vehicle.RUN_SPEED * Math.sin((Math.PI / 180) * ent.direction));
			ent.animation = this.walking;	// Update animation to be walking
		} else if (this.game.backward) {
			ent.x -= (this.vehicle.RUN_SPEED * Math.cos((Math.PI / 180) * ent.direction) * 0.5);
			ent.y -= (this.vehicle.RUN_SPEED * Math.sin((Math.PI / 180) * ent.direction) * 0.5);
			ent.animation = this.walking;	// Update animation to be walking
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			ent.direction -= this.vehicle.PIVOT_SPEED;
		}
		if (this.game.right) {
			ent.direction += this.vehicle.PIVOT_SPEED;
		}
	}

    draw(ctx) {
        this.vehicle.draw(ctx);
    }
};