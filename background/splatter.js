// Spray background
class Splatter {
	constructor(game, x, y, direction, width, height, version) {
		// Assign Object Variables
        Object.assign(this, { game, version });
        this.rotTime = 100;

        let spritesheet = ASSET_MANAGER.getAsset("./sprites/bloodsmear.png");
        
		let animation = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 0, direction, false, true);

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
        }

        // Parent update
        this.background.update();
    }

    draw(ctx) {
        // Parent draw
        this.background.draw(ctx);
    }
}