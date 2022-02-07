var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
// ASSET_MANAGER.queueDownload("./assets/hailpizza.png");

// ASSET_MANAGER.queueDownload("./assets/bgtile00.png");
// ASSET_MANAGER.queueDownload("./assets/bgtile01.png");
// ASSET_MANAGER.queueDownload("./assets/bgtile02.png");
// ASSET_MANAGER.queueDownload("./assets/streetlight.png");
// ASSET_MANAGER.queueDownload("./assets/streetlight02.png");
// ASSET_MANAGER.queueDownload("./assets/fence.png");
// ASSET_MANAGER.queueDownload("./assets/building.png");

// ASSET_MANAGER.queueDownload("./assets/ground.png");

// ASSET_MANAGER.queueDownload("./assets/road/00-00.png");
// ASSET_MANAGER.queueDownload("./assets/road/01-00.png");
// ASSET_MANAGER.queueDownload("./assets/road/01-01.png");
// ASSET_MANAGER.queueDownload("./assets/road/01-02.png");
// ASSET_MANAGER.queueDownload("./assets/road/01-03.png");
// ASSET_MANAGER.queueDownload("./assets/road/01-04.png");
// ASSET_MANAGER.queueDownload("./assets/road/01-05.png");
// ASSET_MANAGER.queueDownload("./assets/road/02-00.png");
// ASSET_MANAGER.queueDownload("./assets/road/02-01.png");
// ASSET_MANAGER.queueDownload("./assets/road/02-02.png");
// ASSET_MANAGER.queueDownload("./assets/road/02-03.png");
// ASSET_MANAGER.queueDownload("./assets/road/03-00.png");
// ASSET_MANAGER.queueDownload("./assets/road/03-01.png");
// ASSET_MANAGER.queueDownload("./assets/road/03-02.png");
// ASSET_MANAGER.queueDownload("./assets/road/03-03.png");

// ASSET_MANAGER.queueDownload("./assets/roof/00-00.png");
// ASSET_MANAGER.queueDownload("./assets/roof/01-00.png");
// ASSET_MANAGER.queueDownload("./assets/roof/01-01.png");
// ASSET_MANAGER.queueDownload("./assets/roof/01-02.png");
// ASSET_MANAGER.queueDownload("./assets/roof/01-03.png");
// ASSET_MANAGER.queueDownload("./assets/roof/01-04.png");
// ASSET_MANAGER.queueDownload("./assets/roof/01-05.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-00.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-01.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-02.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-03.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-04.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-05.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-06.png");
// ASSET_MANAGER.queueDownload("./assets/roof/02-07.png");
// ASSET_MANAGER.queueDownload("./assets/roof/03-00.png");
// ASSET_MANAGER.queueDownload("./assets/roof/03-01.png");
// ASSET_MANAGER.queueDownload("./assets/roof/03-02.png");
// ASSET_MANAGER.queueDownload("./assets/roof/03-03.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-00.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-01.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-02.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-03.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-04.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-05.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-06.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-07.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-08.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-09.png");
// ASSET_MANAGER.queueDownload("./assets/roof/04-10.png");

// ASSET_MANAGER.queueDownload("./assets/npcs.png");
// ASSET_MANAGER.queueDownload("./assets/npccars.png");

// ASSET_MANAGER.queueDownload("./assets/driver.png");
// ASSET_MANAGER.queueDownload("./assets/drivercar.png");

// ASSET_MANAGER.queueDownload("./assets/exhaustflame.png");
// ASSET_MANAGER.queueDownload("./assets/health.PNG");

// ASSET_MANAGER.queueDownload("./assets/exclamation.png");
// ASSET_MANAGER.queueDownload("./assets/goal.png");
// ASSET_MANAGER.queueDownload("./assets/arrow01.png");
// ASSET_MANAGER.queueDownload("./assets/arrow02.png");

// //sound effects
// ASSET_MANAGER.queueDownload("./music/DoorClose.mp3");
// ASSET_MANAGER.queueDownload("./music/driving.mp3");
// ASSET_MANAGER.queueDownload("./music/CarImpact.mp3");
// ASSET_MANAGER.queueDownload("./music/CarImpact2.mp3");
// ASSET_MANAGER.queueDownload("./music/dead.mp3");
// ASSET_MANAGER.queueDownload("./music/walking.mp3");
// ASSET_MANAGER.queueDownload("./music/achievement.mp3");
// ASSET_MANAGER.queueDownload("./music/newMission.mp3");
// ASSET_MANAGER.queueDownload("./music/engine.mp3");

ASSET_MANAGER.downloadAll(function () {

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	// Player
	// gameEngine.addEntity(driver);
	// gameEngine.addEntity(drivercar);
	
	new SceneManager(gameEngine);
	
	gameEngine.start();
});

function getRoadVersion (tile, x, y) {
	let ver = [0,0];	// default
	
	// Count adjacent building tiles
	let adjCount = 0;
	let adjHits = [];
	if (x != 0) 					{ if (tile[x - 1][y] >= 3) {adjCount ++; adjHits.push('T');} };
	if (x != tile.length - 1) 		{ if (tile[x + 1][y] >= 3) {adjCount ++; adjHits.push('B');} };
	if (y != 0) 					{ if (tile[x][y - 1] >= 3) {adjCount ++; adjHits.push('L');} };
	if (y != tile[0].length - 1) 	{ if (tile[x][y + 1] >= 3) {adjCount ++; adjHits.push('R');} };
	// Edge of tile counts towards a hit
	if (x == 0) 					{ adjCount ++; adjHits.push('T'); };
	if (x == tile.length - 1) 		{ adjCount ++; adjHits.push('B'); };
	if (y == 0) 					{ adjCount ++; adjHits.push('L'); };
	if (y == tile[0].length - 1) 	{ adjCount ++; adjHits.push('R'); };
	// Count corner building tiles
	let crnCount = 0;
	let crnHits = [];
	if (x != 0) {
		if (y != 0) 					{ if (tile[x - 1][y - 1] >= 3) {crnCount ++; crnHits.push("TL");} };
		if (y != tile[0].length - 1) 	{ if (tile[x - 1][y + 1] >= 3) {crnCount ++; crnHits.push("TR");} };
	}
	if (x != tile.length - 1) {
		if (y != 0) 					{ if (tile[x + 1][y - 1] >= 3) {crnCount ++; crnHits.push("BL");} };
		if (y != tile[0].length - 1) 	{ if (tile[x + 1][y + 1] >= 3) {crnCount ++; crnHits.push("BR");} };
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

function getBuildingVersion (tile, x, y) {
	let ver = [0,0];	// default
	
	// Count adjacent building tiles
	let adjCount = 0;
	let adjHits = [];
	if (x != 0) 					{ if (tile[x - 1][y] == 1) {adjCount ++; adjHits.push('T');} };
	if (x != tile.length - 1) 		{ if (tile[x + 1][y] == 1) {adjCount ++; adjHits.push('B');} };
	if (y != 0) 					{ if (tile[x][y - 1] == 1) {adjCount ++; adjHits.push('L');} };
	if (y != tile[0].length - 1) 	{ if (tile[x][y + 1] == 1) {adjCount ++; adjHits.push('R');} };
	// Count corner building tiles
	let crnCount = 0;
	let crnHits = [];
	if (x != 0) {
		if (y != 0) 					{ if (tile[x - 1][y - 1] == 1) {crnCount ++; crnHits.push("TL");} };
		if (y != tile[0].length - 1) 	{ if (tile[x - 1][y + 1] == 1) {crnCount ++; crnHits.push("TR");} };
	}
	if (x != tile.length - 1) {
		if (y != 0) 					{ if (tile[x + 1][y - 1] == 1) {crnCount ++; crnHits.push("BL");} };
		if (y != tile[0].length - 1) 	{ if (tile[x + 1][y + 1] == 1) {crnCount ++; crnHits.push("BR");} };
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
