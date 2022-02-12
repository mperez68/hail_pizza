// Spray background
class Target extends Marker {
	constructor(game, x, y, direction, version) {
        let width = 30;
        let height = width;
        super(game, x, y, direction, 1, width, height,
            new Animator(ASSET_MANAGER.getAsset("./sprites/targetmarker.png"), 0, 0,
            width, height, 8, 0.08, 0, direction, false, true));
        // Assign Object Variables
        Object.assign(this, { game, version });
    };
}