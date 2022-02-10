// Player as a Pedestrian object
class PlayerPed extends Pedestrian {
	constructor(game, x, y, direction, width, height) {
		super(game, x, y, direction, width, height);
		// Assign Object Variables
		Object.assign(this, { game });

		// Override walking/standing animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");
		this.standing = new Animator(spritesheet, 0, height,
										width, height, 5, 0.2, 1, direction, false, true);		// Standing
		this.walking = new Animator(spritesheet, 0, 0,
										width, height, 12, 0.08, 1, direction, false, true);	// Walking
		this.walkingBack = new Animator(spritesheet, 0, 0,
										width, height, 12, 0.10, 1, direction, true, true);		// Walking Backwards
        // Override Constants
        this.RUN_SPEED = 4;
        this.PIVOT_SPEED = 3;
    }

	setup() {
		this.isWalking = false;

		// parent setup
		super.setup();
	}

    update() {
		if (this.game.forward || this.game.backward || this.game.left || this.game.right) this.intent(null);
		if (this.getDistanceToGoal() < this.width) this.intent(null);

		if (this.game.click != this.lastClick) this.intent(this.game.click);
		this.lastClick = this.game.click;

		// Check for keyboard input to determine movement.
        if (!this.goal) this.controls();

		// Collision
		this.updateCollision();

		// Parent update
        super.update();
	};

	controls() {
		// Forward OR Backward, forward taking precedent.
		if (this.game.forward) {
			this.forward(1);
		} else if (this.game.backward) {
			this.backward(1);
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			this.left(1);
		}
		if (this.game.right) {
			this.right(1);
		}
	}

	intent(point) {
		// Assign goal
		this.goal = point;
	}
};