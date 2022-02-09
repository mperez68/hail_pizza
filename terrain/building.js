//
class Building extends Terrain{
	constructor(game, x, y, version) {
        super(game, x, y, 0, 1, PARAMS.GRID_WIDTH, PARAMS.GRID_HEIGHT, 
            new Animator(ASSET_MANAGER.getAsset("./sprites/roof/00-00.png"), 0, 0,
			PARAMS.GRID_WIDTH, PARAMS.GRID_HEIGHT, 1, 1, 0, 0, false, true));
		// Assign Object Variables
        Object.assign(this, { game, version });
    };
}