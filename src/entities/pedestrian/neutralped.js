// Player as a Pedestrian object
class NeutralPed extends Pedestrian {
	constructor(game, x, y, direction) {
		// Variables
		let width = 19;
		let height = width;
		super(game, x, y, direction, width, height);
		// Constants
		this.VERSION_COUNT = 2;
		// Assign Object Variables
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");

		this.version = randomInt(this.VERSION_COUNT);

		this.game.camera.dudeCount++;
		
		// Override walking/standing animations
		this.standing = new Animator(spritesheet, 0, height * this.version,
									width, height, 12, 0.2, 0, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 228, height * this.version,
									width, height, 8, 0.08, 0, direction, false, true);	// Walking
		this.walkingBack = new Animator(spritesheet, 228, height,
									width, height, 8, 0.10, 0, direction, true, true);	// Walking Backward
    }

    update() {
		// Reactive decision making for intent
		this.intent();
		
		if (this.dead) {
			// Create Corpse
			this.game.addBackground(new Corpse(this.game, this.x, this.y,
					this.direction, this.width, this.height, this.version))
			// Delete this object
			this.removeFromWorld = true;
		}

		if (this.hitPoints <= 0) this.dead = true;
		// Parent update
        super.update();
	};

	intent() {
		// Assign goal
        if (this.getDistanceToGoal() <= this.width ) {
			// TODO goal queue
		}
	};
};