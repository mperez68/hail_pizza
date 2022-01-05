//
class Building {
	constructor(game, x, y, version) {
		// Assign Object Variables
        Object.assign(this, { game, version });

        let spritesheet = ASSET_MANAGER.getAsset("./sprites/roof/00-00.png");
        
		let animation = new Animator(spritesheet, 0, 0,
			PARAMS.GRID_WIDTH, PARAMS.GRID_HEIGHT, 1, 1, 0, 0, false, true);	// Tile

        // Initialize 'parent' object
        this.terrain = new Terrain(game, x, y, 0, 1, PARAMS.GRID_WIDTH, PARAMS.GRID_HEIGHT, animation);
    };

    setup(){
        // Parent setup
        this.terrain.setup();
    };

    update() {
        // Parent update
        this.terrain.update();
    }

    draw(ctx) {
        // Parent draw
        this.terrain.draw(ctx);
    }
}