// Spray background
class Splatter extends Background {
	constructor(game, x, y, direction, width, height, version) {
        super(game, x, y, direction, 1, width, height, 
            new Animator(ASSET_MANAGER.getAsset("./sprites/bloodsmear.png"), 0, 0,
			width, height, 1, 1, 0, direction, false, true));
		// Assign Object Variables
        Object.assign(this, { game, version });
        this.rotTime = 100;
    };

    update() {
        this.rotTime--;
        if (this.rotTime <= 0) {
            this.removeFromWorld = true;
        }

        // Parent update
        super.update();
    }
}