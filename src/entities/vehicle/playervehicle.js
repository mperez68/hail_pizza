// Player as a Vehicle object
class PlayerVehicle extends Vehicle {
	constructor(game, x, y, direction, width, height) {
        super(game, x, y, direction, width, height);
		// Assign Object Variables
		Object.assign(this, { game });

		// Override Constants
		this.MAX_SPEED = 20;
		//this.ACCELERATION = 0.5;
		this.PIVOT_SPEED = 4;
		
		// Override Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");
		this.idle = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// idle
    }

    update() {
		if (this.game.forward || this.game.backward || this.game.left || this.game.right) this.intent(null);
		if (this.getDistanceToGoal() < this.width) this.intent(null);
		
		this.lastClick = this.game.click;

		// Check for keyboard input to determine movement.
        this.controls();

		// Parent update
        super.update();

		this.game.camera.centerText = this.hitPoints + "HP";
	};

	controls() {
		// Forward, Backward or Braking.
		if (this.game.space){
			this.brake();
		} else if (this.game.forward) {
			this.accelerate();
		} else if (this.game.backward) {
			this.reverse();
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			this.left();
		}
		if (this.game.right) {
			this.right();
		}
	}

	intent(point) {
		// Assign goal
		this.goal = point;
	}
};