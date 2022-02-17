// Spray background
class Target extends Marker {
	constructor(game, x, y) {
        let width = 30;
        let height = width;
        super(game, x, y, 0, 1, width, height,
            new Animator(ASSET_MANAGER.getAsset("./sprites/targetmarker.png"), 0, 0,
            width, height, 8, 0.08, 0, 0, false, true));
    };
}