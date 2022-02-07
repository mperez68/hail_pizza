// Spray background
class Target {
	constructor(game, x, y, direction, version) {
		// Assign Object Variables
        Object.assign(this, { game, version });
        let width = 30;
        let height = width;

        let spritesheet = ASSET_MANAGER.getAsset("./sprites/targetmarker.png");
        
		let animation = new Animator(spritesheet, 0, 0,
			width, height, 8, 0.08, 0, direction, false, true);

        // Initialize 'parent' object
        this.marker = new Marker(game, x, y, direction, 1, width, height, animation);
    };

    setup(){
        // Parent setup
        this.marker.setup();
    };

    update() {
        // Parent update
        this.marker.update();
    }

    draw(ctx) {
        // Parent draw
        this.marker.draw(ctx);
    }
}