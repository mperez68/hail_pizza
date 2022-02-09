// NPC Vehicle object
class NeutralVehicle extends Vehicle {
	constructor(game, x, y, direction, width, height) {
		super(game, x, y, direction, width, height);
		// Constants
		this.VERSION_COUNT = 1;
		// Assign Object Variables
		Object.assign(this, { game });

		this.version = randomInt(this.VERSION_COUNT);
		
		this.goalList = [];
		
		// Override Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");
		this.idle = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// idle
    }

    update() {
		// Reactive decision making for intent
		this.intent();
		
		// Collision
		this.updateCollision();

		// Parent update
        super.update();
	};

	intent() {
		// Assign goal
        if (this.getDistanceToGoal() <= this.width ) {
			let ptr = 0;
			for (var i = 0; i < this.goalList.length; i++){
				if ( (this.goalList[i].x == this.goal.x) && (this.goalList[i].y == this.goal.y) ) ptr = i;
			}
			ptr = (ptr + 1) % this.goalList.length;
			this.goal = this.goalList[ptr];
		}
	}
};