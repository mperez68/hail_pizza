class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.defaultScale = 1;
		this.x = 0;
		this.y = 0;
		this.lvl = 1;

		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
		
		this.loadMap(levels[this.lvl]);
	};
	
	loadMap(level) {
		this.clearMap();
		let g = this.game; // Reduces verbosity
		console.log(level);		

		// Build map from level object
		// Background
			// Ground
		if (level.grd){
			for (let i = 0; i < level.grd.length; i++) {
				for (let x = level.grd[i].xs; x <= level.grd[i].xe; x++){
					for (let y = level.grd[i].ys; y <= level.grd[i].ye; y++){
						g.addBackground(new Ground(g, x * PARAMS.GRID_HEIGHT, y * PARAMS.GRID_HEIGHT, 0));	// TODO assign version based on surrounding tiles
						// TODO add tiles to 2d array representation for reference
					}
				}
			}
		}
			// Road
		if (level.road){
			for (let i = 0; i < level.road.length; i++) {
				for (let x = level.road[i].xs; x <= level.road[i].xe; x++){
					for (let y = level.road[i].ys; y <= level.road[i].ye; y++){
						g.addBackground(new Road(g, x * PARAMS.GRID_HEIGHT, y * PARAMS.GRID_HEIGHT, 0));	// TODO assign version based on surrounding tiles
						// TODO add tiles to 2d array representation for reference
					}
				}
			}
		}
		// Entities
			// Player
		if (level.player){
			this.playerCar = new PlayerVehicle(g, level.player.x * PARAMS.GRID_HEIGHT, level.player.y * PARAMS.GRID_HEIGHT, level.player.a);
			g.addEntity(this.playerCar);
		}
			// NPC Pedestrians
		if (level.peds){
			for (let i = 0; i < level.peds.length; i++) {
				g.addEntity(new NeutralPed(g, level.peds[i].x * PARAMS.GRID_HEIGHT, level.peds[i].y * PARAMS.GRID_HEIGHT, level.peds[i].a));
			}
		}
			// NPC Vehicles
		if (level.vehs){
			for (let i = 0; i < level.vehs.length; i++) {
				g.addEntity(new NeutralVehicle(g, level.vehs[i].x * PARAMS.GRID_HEIGHT, level.vehs[i].y * PARAMS.GRID_HEIGHT, level.vehs[i].a));
			}
		}
			// Hostile Pedestrians
		if (level.zmbs){
			for (let i = 0; i < level.zmbs.length; i++) {
				console.log("Zombie:");
				console.log(level.zmbs[i]);
				//g.addEntity(new HostilePed(g, level.zmbs[i].x * PARAMS.GRID_HEIGHT, level.zmbs[i].y * PARAMS.GRID_HEIGHT, level.zmbs[i].a));
			}
		}
			// Hostile Vehicles
		if (level.pigs){
			for (let i = 0; i < level.pigs.length; i++) {
				console.log("Pig:");
				console.log(level.pigs[i]);
				//g.addEntity(new HostileVehicle(g, level.pigs[i].x * PARAMS.GRID_HEIGHT, level.pigs[i].y * PARAMS.GRID_HEIGHT, level.pigs[i].a));
			}
		}
		// Terrain
			// Buildings
		if (level.bldg) {
			for (let i = 0; i < level.bldg.length; i++) {
				for (let x = level.bldg[i].xs; x <= level.bldg[i].xe; x++){
					for (let y = level.bldg[i].ys; y <= level.bldg[i].ye; y++){
						g.addTerrain(new Building(g, x * PARAMS.GRID_HEIGHT, y * PARAMS.GRID_HEIGHT, 0));	// TODO assign version based on surrounding tiles
						// TODO add tiles to 2d array representation for reference
					}
				}
			}
		}
		// Markers
			// Buffs
		if (level.buffs){
			for (let i = 0; i < level.buffs.length; i++) {
				g.addEffects(new Mission(g, level.buffs[i].x * PARAMS.GRID_HEIGHT, level.buffs[i].y * PARAMS.GRID_HEIGHT, level.buffs[i].v));
			}
		}
			// Sidequests
		if (level.sqs){
			for (let i = 0; i < level.sqs.length; i++) {
				g.addEffects(new Mission(g, level.sqs[i].x * PARAMS.GRID_HEIGHT, level.sqs[i].y * PARAMS.GRID_HEIGHT, level.sqs[i].v));
			}
		}
			// End Point
		if (level.end) {
			g.addEffects(new Target(g, level.end.x * PARAMS.GRID_HEIGHT, level.end.y * PARAMS.GRID_HEIGHT));
		}

		// Focus for camera
		if (level.focus) {
			console.log(level.focus);
			this.focus = level.focus;
		} else if (this.playerCar) {
			this.focus = this.playerCar;
		}
	};

	nextLevel() {
		this.lvl++;
		if (levels[this.lvl]) this.loadMap(levels[this.lvl]);
		else this.loadMap(levels.end);
		
	}
	
	update() {
		// TEST //
		this.leftText = round(PARAMS.SCALE,1);
		// END TEST //
		
		if (this.focus) {
			this.x = this.focus.x - this.game.surfaceWidth / (2 * PARAMS.SCALE);
			this.y = this.focus.y - this.game.surfaceHeight / (2 * PARAMS.SCALE);

			PARAMS.SCALE += (this.focus.z - PARAMS.SCALE) / PARAMS.ZOOM_STEPS;
		} else {
			this.x = 0;
			this.y = 0;
			PARAMS.SCALE = this.defaultScale;
		}
	};
	
	draw(ctx) {
		// HUD //

		// DEBUG HUD //
		if (PARAMS.DEBUG) {
			let border = 50;
			let font = 30;
			// LEFT ALIGN TEXT //
			ctx.textAlign  = "left";
			//
			ctx.font = font + "px Impact";
			ctx.strokeStyle = 'White';
			ctx.strokeText(this.leftText, border, this.game.surfaceHeight - border - (font / 2));
			ctx.strokeStyle = 'Black';
			ctx.fillText(this.leftText, border, this.game.surfaceHeight - border - (font / 2));
			
			// CENTER ALIGN TEXT //
			ctx.textAlign  = "center";
			//
			ctx.font = font + "px Impact";
			ctx.strokeStyle = 'White';
			ctx.strokeText(this.centerText, this.game.surfaceWidth / 2, this.game.surfaceHeight - border - (font / 2));
			ctx.strokeStyle = 'Black';
			ctx.fillText(this.centerText, this.game.surfaceWidth / 2, this.game.surfaceHeight - border - (font / 2));
			
			// RIGHT ALIGN TEXT //
			ctx.textAlign  = "right";
			//
			ctx.font = font + "px Impact";
			ctx.strokeStyle = 'White';
			ctx.strokeText(this.rightText, this.game.surfaceWidth - border, this.game.surfaceHeight - border - (font / 2));
			ctx.strokeStyle = 'Black';
			ctx.fillText(this.rightText, this.game.surfaceWidth - border, this.game.surfaceHeight - border - (font / 2));
		}
	};
	
	clearMap() {
        this.game.background = [];
        this.game.terrain = [];
        this.game.entities = [];
        this.game.effects = [];
		this.focus = null;
		this.playerCar = null;
    };
}