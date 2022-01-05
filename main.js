var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
// Default Square
ASSET_MANAGER.queueDownload("./sprites/default.png");
// Player Sprites
ASSET_MANAGER.queueDownload("./sprites/driver.png");
ASSET_MANAGER.queueDownload("./sprites/drivercar.png");
// NPC's
ASSET_MANAGER.queueDownload("./sprites/npcs.png");
// Background Tiles
ASSET_MANAGER.queueDownload("./sprites/ground.png");
ASSET_MANAGER.queueDownload("./sprites/road/00-00.png");
ASSET_MANAGER.queueDownload("./sprites/bloodsmear.png");
// Buildings
ASSET_MANAGER.queueDownload("./sprites/roof/00-00.png");
// Markers
ASSET_MANAGER.queueDownload("./sprites/missionmarker.png")
ASSET_MANAGER.queueDownload("./sprites/targetmarker.png")

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	
	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});

// Helper function; given a map matrix and the x,y position of the tile being filled, it returns the road sprite version based on its surrounding tiles.
function getRoadVersion (mapMatrix, x, y) {
	let ver = [0,0];	// default
	
	// Count adjacent building tiles
	let adjCount = 0;
	let adjHits = [];
	if (x != 0) 					{ if (mapMatrix[x - 1][y] >= 3) {adjCount ++; adjHits.push('T');} };
	if (x != mapMatrix.length - 1) 		{ if (mapMatrix[x + 1][y] >= 3) {adjCount ++; adjHits.push('B');} };
	if (y != 0) 					{ if (mapMatrix[x][y - 1] >= 3) {adjCount ++; adjHits.push('L');} };
	if (y != mapMatrix[0].length - 1) 	{ if (mapMatrix[x][y + 1] >= 3) {adjCount ++; adjHits.push('R');} };
	// Edge of mapMatrix counts towards a hit
	if (x == 0) 					{ adjCount ++; adjHits.push('T'); };
	if (x == mapMatrix.length - 1) 		{ adjCount ++; adjHits.push('B'); };
	if (y == 0) 					{ adjCount ++; adjHits.push('L'); };
	if (y == mapMatrix[0].length - 1) 	{ adjCount ++; adjHits.push('R'); };
	// Count corner building tiles
	let crnCount = 0;
	let crnHits = [];
	if (x != 0) {
		if (y != 0) 					{ if (mapMatrix[x - 1][y - 1] >= 3) {crnCount ++; crnHits.push("TL");} };
		if (y != mapMatrix[0].length - 1) 	{ if (mapMatrix[x - 1][y + 1] >= 3) {crnCount ++; crnHits.push("TR");} };
	}
	if (x != mapMatrix.length - 1) {
		if (y != 0) 					{ if (mapMatrix[x + 1][y - 1] >= 3) {crnCount ++; crnHits.push("BL");} };
		if (y != mapMatrix[0].length - 1) 	{ if (mapMatrix[x + 1][y + 1] >= 3) {crnCount ++; crnHits.push("BR");} };
	}
	
	if (adjCount == 2) {
		if (adjHits.includes('L') && adjHits.includes('R')) {
			ver = [1,0];
		} else if (adjHits.includes('T') && adjHits.includes('B')) {
			ver = [1,1];
		} else {
			if (adjHits.includes('T') && adjHits.includes('L')) {
				if (crnHits.includes("TL")) {
					ver = [2,0];
				} else {
					ver = [1,1];
				}
			} else if (adjHits.includes('T') && adjHits.includes('R')) {
				if (crnHits.includes("TR")) {
					ver = [2,1];
				} else {
					ver = [1,3];
				}
			} else if (adjHits.includes('B') && adjHits.includes('R')) {
				if (crnHits.includes("BR")) {
					ver = [2,2];
				} else {
					ver = [1,5];
				}
			} else {
				if (crnHits.includes("BL")) {
					ver = [2,3];
				} else {
					ver = [1,4];
				};
			}
		}
	} else if (adjCount == 3) {
		if (!adjHits.includes('R')) {
			ver = [3,1];
		} else if (!adjHits.includes('B')) {
			ver = [3,2];
		} else if (!adjHits.includes('L')) {
			ver = [3,3];
		} else if (!adjHits.includes('T')) {
			ver = [3,0];
		}
	} else if (adjCount == 4) {
		// TODO
	}
	return ver;
}

// Helper function; given a map matrix and the x,y position of the tile being filled, it returns the building sprite version based on its surrounding tiles.
function getBuildingVersion (mapMatrix, x, y) {
	let ver = [0,0];	// default
	
	// Count adjacent building tiles
	let adjCount = 0;
	let adjHits = [];
	if (x != 0) 					{ if (mapMatrix[x - 1][y] == 1) {adjCount ++; adjHits.push('T');} };
	if (x != mapMatrix.length - 1) 		{ if (mapMatrix[x + 1][y] == 1) {adjCount ++; adjHits.push('B');} };
	if (y != 0) 					{ if (mapMatrix[x][y - 1] == 1) {adjCount ++; adjHits.push('L');} };
	if (y != mapMatrix[0].length - 1) 	{ if (mapMatrix[x][y + 1] == 1) {adjCount ++; adjHits.push('R');} };
	// Count corner building tiles
	let crnCount = 0;
	let crnHits = [];
	if (x != 0) {
		if (y != 0) 					{ if (mapMatrix[x - 1][y - 1] == 1) {crnCount ++; crnHits.push("TL");} };
		if (y != mapMatrix[0].length - 1) 	{ if (mapMatrix[x - 1][y + 1] == 1) {crnCount ++; crnHits.push("TR");} };
	}
	if (x != mapMatrix.length - 1) {
		if (y != 0) 					{ if (mapMatrix[x + 1][y - 1] == 1) {crnCount ++; crnHits.push("BL");} };
		if (y != mapMatrix[0].length - 1) 	{ if (mapMatrix[x + 1][y + 1] == 1) {crnCount ++; crnHits.push("BR");} };
	}
	
	if (adjCount == 1) {
		if (adjHits.includes('L')) {
			ver = [1,0];
		} else if (adjHits.includes('T')) {
			ver = [1,1];
		} else if (adjHits.includes('R')) {
			ver = [1,2];
		} else if (adjHits.includes('B')) {
			ver = [1,3];
		};
	} else if (adjCount == 2) {
		if (adjHits.includes('L') && adjHits.includes('R')) {
			ver = [1,4];
		} else if (adjHits.includes('T') && adjHits.includes('B')) {
			ver = [1,5];
		} else {
			if (adjHits.includes('T') && adjHits.includes('L')) {
				if (crnHits.includes("TL")) {
					ver = [2,0];
				} else {
					ver = [2,4];
				}
			} else if (adjHits.includes('T') && adjHits.includes('R')) {
				if (crnHits.includes("TR")) {
					ver = [2,1];
				} else {
					ver = [2,5];
				}
			} else if (adjHits.includes('B') && adjHits.includes('R')) {
				if (crnHits.includes("BR")) {
					ver = [2,2];
				} else {
					ver = [2,6];
				}
			} else {
				if (crnHits.includes("BL")) {
					ver = [2,3];
				} else {
					ver = [2,7];
				};
			}
		}
	} else if (adjCount == 3) {
		if (!adjHits.includes('R')) {
			ver = [3,0];
		} else if (!adjHits.includes('B')) {
			ver = [3,1];
		} else if (!adjHits.includes('L')) {
			ver = [3,2];
		} else if (!adjHits.includes('T')) {
			ver = [3,3];
		}
	} else if (adjCount == 4) {
		// inner corner walls or enclosed wall
		if (crnHits.includes("TL") && crnHits.includes("BL") && crnHits.includes("TR") && crnHits.includes("BR")) {
			// ALL CORNERS
			ver = [4,0];
		} else if (crnHits.includes("BL") && crnHits.includes("TR") && crnHits.includes("BR")) {
			// !TL
			ver = [4,0]; // [4,11]
		} else if (crnHits.includes("TL") && crnHits.includes("TR") && crnHits.includes("BR")) {
			// !BL
			ver = [4,0]; // [4,12]
		} else if (crnHits.includes("TL") && crnHits.includes("BL") && crnHits.includes("BR")) {
			// !TR
			ver = [4,0]; // [4,13]
		} else if (crnHits.includes("TL") && crnHits.includes("BL") && crnHits.includes("TR")) {
			// !BR
			ver = [4,0]; // [4,14]
		} else if (crnHits.includes("BL") && crnHits.includes("BR")) {
			// BL BR
			ver = [4,10];
		} else if (crnHits.includes("TR") && crnHits.includes("BR")) {
			// BR TR
			ver = [4,8];
		} else if (crnHits.includes("TL") && crnHits.includes("TR")) {
			// TR TL
			ver = [4,9];
		} else if (crnHits.includes("TL") && crnHits.includes("BL")) {
			// TL BL
			ver = [4,7];
		} else if (crnHits.includes("TL") && crnHits.includes("BR")) {
			// TL BR
			ver = [4,6];
		} else if (crnHits.includes("BL") && crnHits.includes("TR")) {
			// TR BL
			ver = [4,5];
		} else if (crnHits.includes("TL")) {
			// TL
			ver = [4,1];
		} else if (crnHits.includes("BL")) {
			// BL
			ver = [4,4];
		} else if (crnHits.includes("TR")) {
			// TR
			ver = [4,2];
		} else if (crnHits.includes("BR")) {
			// BR
			ver = [4,3];
		} else {
			ver = [4,0]; // [4,15]
		}
	}
	
	return ver;
}
