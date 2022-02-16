class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.defaultScale = 1.5;
		this.x = 0;
		this.y = 0;

		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
		
		this.loadMap(null);
	};
	
	loadMap(level) {
		this.playerPed = new PlayerPed(this.game, 0, 0, 0);
		this.playerCar = new PlayerVehicle(this.game, 200, 0, 0);
		this.focus = this.playerPed;

		this.game.addEntity(this.playerPed);
		this.game.addEntity(this.playerCar);

		this.game.addEntity(new NeutralPed(this.game,  + 50,  + 50, 45));
		this.game.addEntity(new NeutralPed(this.game, -50,  + 50, 135));
		this.game.addEntity(new NeutralPed(this.game,  + 50, -50, 315));
		this.game.addEntity(new NeutralPed(this.game, -50, -50, 225));

		this.game.addEntity(new NeutralVehicle(this.game, this.game.surfaceWidth * (3 / 4), this.game.surfaceHeight * (1 / 2), 45));
		
		// Default map
		if (level == null) {
			let gridSize = 30;
			for (let i = 0; i < gridSize; i++){
				for (let j = 0; j < gridSize; j++){
					if (i == 0 || j == 0 || i == gridSize - 1 || j == gridSize - 1) this.game.addTerrain(new Building(this.game, PARAMS.GRID_WIDTH * (i - (gridSize / 2)), PARAMS.GRID_HEIGHT * (j - (gridSize / 2)), 0));
					else this.game.addBackground(new Ground(this.game, PARAMS.GRID_WIDTH * (i - (gridSize / 2)), PARAMS.GRID_HEIGHT * (j - (gridSize / 2)), 0));
				}
			}
		} else {
			// TODO
		}

		// this.game.addBackground(new Ground(this.game, 480, 384, 0));

		// this.game.addBackground(new Road(this.game, 416, 384, 0));

		// this.game.addEffects(new Mission(this.game, 598, 384, 0));

		// this.game.addEffects(new Target(this.game, 598, 354, 0));

		// TEST //
		
		// END TEST //
	};
	
	update() {
		// TEST //
		if (this.game.keyE && this.focus instanceof PlayerPed && !this.focus.timers.has("Switch")) {	// TODO require proximity, animate entering/exiting
			this.focus = this.playerCar;
			this.focus.timers.set("Switch", 50);
		} else if (this.game.keyE && this.focus instanceof PlayerVehicle && !this.focus.timers.has("Switch")) {
			this.focus = this.playerPed;
			this.focus.timers.set("Switch", 50);
		}
		this.leftText = round(PARAMS.SCALE,1);
		// END TEST //
		if (this.focus) {
			this.x = this.focus.x - this.game.surfaceWidth / (2 * PARAMS.SCALE);
			this.y = this.focus.y - this.game.surfaceHeight / (2 * PARAMS.SCALE);

			let s = Math.min(this.defaultScale, Math.pow(this.defaultScale, 5) / (this.focus.force.magnitude + 1));
			PARAMS.SCALE += (s- PARAMS.SCALE) / PARAMS.ZOOM_STEPS;
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
	
	clearEntities() {
        this.game.background = [];
        this.game.terrain = [];
        this.game.entities = [];
        this.game.effects = [];
    };
}