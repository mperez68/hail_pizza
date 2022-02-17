// NPC Vehicle object
class NeutralVehicle extends Vehicle {
	constructor(game, x, y, direction) {
		// variables
		let width = 70;
		let height = width;
		// Constants
		const VERSION_COUNT = 6;
		const VERSION = randomInt(VERSION_COUNT);

		// Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npccars.png");
		let idle = new Animator(spritesheet, 0, height * VERSION,
			width, height, 1, 1, 1, direction, false, true);	// idle
		
		// Initialize
        super(game, x, y, direction, width, height, idle);
		// Assign Object Variables
		Object.assign(this, { VERSION, VERSION_COUNT, idle });
		
		this.goalList = [];
    }

    update() {
		// Reactive decision making for intent
		this.intent();

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