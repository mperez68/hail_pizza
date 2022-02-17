// Player as a Pedestrian object
class PlayerPed extends Pedestrian {
	constructor(game, x, y, direction) {
		// Variables
		let width = 19;
		let height = width;
		super(game, x, y, direction, width, height);
		// Assign Object Variables
		Object.assign(this, { game });
		this.enterDistance = 100;

		// Override walking/standing animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");
		this.standing = new Animator(spritesheet, 0, height,
										width, height, 5, 0.2, 1, direction, false, true);		// Standing
		this.walking = new Animator(spritesheet, 0, 0,
										width, height, 12, 0.08, 1, direction, false, true);	// Walking
		this.walkingBack = new Animator(spritesheet, 0, 0,
										width, height, 12, 0.10, 1, direction, true, true);		// Walking Backwards
    }

    update() {
		// Break intent if button pressed, otherwise check against goal
		if (this.game.forward || this.game.backward || this.game.left || this.game.right) this.intent(null);
		if (this.getDistanceToGoal() < this.width) this.intent(null);

		// Check for keyboard input to determine movement.
        if (!this.goal && this.game.camera.focus == this) this.controls();

		// Parent update
        super.update();
	};

	controls() {
		// Forward OR Backward, forward taking precedent.
		if (this.game.forward) {
			this.forward();
		} else if (this.game.backward) {
			this.backward();
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			this.left();
		}
		if (this.game.right) {
			this.right();
		}
		if (this.game.keyE && !this.timers.has("Switch") && (Point.distance(this, this.game.camera.playerCar) < this.enterDistance)) {
			// create playerPed, set focus	// TODO animate, pathfind to door before entering
			this.removeFromWorld = true;
			this.game.camera.focus = this.game.camera.playerCar;
			this.game.camera.playerCar.timers.set("Switch", 50);
		}
	}

	intent(point) {
		// Assign goal
		this.goal = point;
	}
};