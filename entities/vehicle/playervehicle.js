// Player as a vehicle object
class PlayerVehicle {
	constructor(game, x, y, direction, width, height) {
		// Assign Object Variables
		Object.assign(this, { game });

		// Initialize 'parent' object
        this.vehicle = new Vehicle(game, x, y, direction, width, height);

		// Override Constants
		this.vehicle.MAX_SPEED = 20;
		//this.vehicle.ACCELERATION = 0.5;
		this.vehicle.PIVOT_SPEED = 4;
		
		// Override Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");
		this.vehicle.idle = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// idle
    }

	setHP(hp) {this.vehicle.setHP(hp); };
	getHP(){ return this.vehicle.getHP(); };

	damage(dmg) { return this.vehicle.damage(dmg) };

	addForce(a, d) {
		this.vehicle.addForce(a,d);
	}

	setup() {
		// parent setup
		this.vehicle.setup();
	}

    update() {
		// Clear auto-pilot
		if (this.game.forward || this.game.backward || this.game.left || this.game.right) this.intent(null);
		if (this.vehicle.getDistanceToGoal() < this.vehicle.entity.width) this.intent(null);
		
		// let dest = null;
		// if (this.game.click) dest = new Point(this.game, this.game.click.x + this.game.camera.x, this.game.click.y + this.game.camera.y);
		// if (this.game.click != this.lastClick) this.intent(dest);
		// this.lastClick = this.game.click;

		// Check for keyboard input to determine movement.
        this.controls();

		// Collision
		this.updateCollision();

		// Parent update
        this.vehicle.update();

		this.game.camera.centerText = this.getHP() + "HP";
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
		// Forward, Backward or Braking.
		if (this.game.space){
			this.vehicle.brake();
		} else if (this.game.forward) {
			this.vehicle.accelerate();
		} else if (this.game.backward) {
			this.vehicle.reverse();
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			this.vehicle.left();
		}
		if (this.game.right) {
			this.vehicle.right();
		}
	}

	intent(point) {
		// Assign goal
		this.vehicle.goal = point;
	}

    draw(ctx) {
		// this.game.camera.leftText = Math.round(this.vehicle.getBrakeDistance());
		// this.game.camera.rightText = Math.round(this.vehicle.getRollDistance());
		this.game.camera.leftText = roundDecimals(this.vehicle.entity.netForce.force, 2);

		// Call parent draw
        this.vehicle.draw(ctx);
    }
};