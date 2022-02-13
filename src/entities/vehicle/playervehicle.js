// Player as a Vehicle object
class PlayerVehicle extends Vehicle {
	constructor(game, x, y, direction, width, height) {
		// Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");
		let idle = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// idle
		
		// Initialize
        super(game, x, y, direction, width, height, idle);
		// Assign Object Variables
		Object.assign(this, { idle });
    }

    update() {
		if (this.game.forward || this.game.backward || this.game.left || this.game.right) this.intent(null);
		if (this.getDistanceToGoal() < this.width) this.intent(null);
		
		this.lastClick = this.game.click;

		// Check for keyboard input to determine movement.
        this.controls();

		// Parent update
        super.update();

		this.game.camera.leftText = "x: " + roundDecimals(this.x, 2) + " :: " + "y: " + roundDecimals(this.y, 2);
		this.game.camera.centerText = this.hitPoints + "HP";
	};

	controls() {
		// Forward, Backward or Braking.
		if (this.game.space){
			this.brake();
		} else if (this.game.forward) {
			this.accelerate();
			// Left OR Right, both pressed cancels out.
			if (this.game.left) {
				this.left();
			}
			if (this.game.right) {
				this.right();
			}
		} else if (this.game.backward) {
			this.reverse();
			// Left OR Right, both pressed cancels out.
			if (this.game.left) {
				this.right();
			}
			if (this.game.right) {
				this.left();
			}
		}
	}

	intent(point) {
		// Assign goal
		this.goal = point;
	}
};