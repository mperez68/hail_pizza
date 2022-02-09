// Spray background
class Corpse extends Background {
	constructor(game, x, y, direction, width, height, version) {
        super(game, x, y, direction, 1, width, height, 
            new Animator(ASSET_MANAGER.getAsset("./sprites/npcs.png"), 380, height * version,
			width, height, 1, 1, 0, direction, false, true));
		// Assign Object Variables
        Object.assign(this, { game, version });

        this.game.camera.corpseCount++;
        this.rotTime = 1000;
    };

    update() {
        this.rotTime--;
        if (this.rotTime <= 0) {
            this.removeFromWorld = true;
            this.game.camera.corpseCount--;
        }
        
        super.update();
    }
}