// Spray background
class Spray {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.VERSION_COUNT = 2;
		// Assign Object Variables
        Object.assign(this, { game });
        this.game.camera.corpseCount++;
        this.rotTime = 1000;

        let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");
        
		this.version = Math.floor(randomInt(this.VERSION_COUNT));
        
		let animation = new Animator(spritesheet, 380, height * this.version,
			width, height, 1, 1, 0, direction, false, true);	// Dead

        // Initialize 'parent' object
        this.background = new Background(game, x, y, direction, 1, width, height, animation);
    };

    setup(){
        // Parent setup
        this.background.setup();
    };

    update() {
        this.rotTime--;
        if (this.rotTime <= 0) {
            this.removeFromWorld = true;
            this.game.camera.corpseCount--;
        }

        // Parent update
        this.background.update();
    }

    draw(ctx) {
        // Parent draw
        this.background.draw(ctx);
    }
}