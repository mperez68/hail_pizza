// Spray background
class Mission extends Marker {
	constructor(game, x, y, version) {
        let width = 30;
        let height = width;
        super(game, x, y, 0, 1, width, height, new Animator(
            ASSET_MANAGER.getAsset("./sprites/missionmarker.png"), 0, 0,
			width, height, 8, 0.08, 0, 0, false, true));

		// Assign Object Variables
        Object.assign(this, { version });
    };
}