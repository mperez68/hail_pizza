class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.x = 0;
		this.y = 0;
		// this.lastRespawn = 0;

		// this.respawns = [];
		// this.respawns.push(new Point(-100,-100));	// TOP LEFT
		// this.respawns.push(new Point(512,-100));	// TOP
		// this.respawns.push(new Point(1124,-100));	// TOP RIGHT
		// this.respawns.push(new Point(1124,384));	// RIGHT
		// this.respawns.push(new Point(1124,868));	// BOTTOM RIGHT
		// this.respawns.push(new Point(512,868));		// BOTTOM
		// this.respawns.push(new Point(-100,868));	// BOTTOM LEFT
		// this.respawns.push(new Point(-100,384));	// LEFT
		
		this.loadMap();
	};
	
	loadMap() {
		this.player = new PlayerPed(this.game, this.game.surfaceWidth / 2, this.game.surfaceHeight / 2, 0, 19, 19);
		// this.player = new PlayerVehicle(this.game, this.game.surfaceWidth / 2, this.game.surfaceHeight / 2, 0, 70, 64);
		this.focus = this.player;

		this.game.addEntity(this.player);

		let ped = new NeutralPed(this.game, this.game.surfaceWidth / 2 - 50, this.game.surfaceHeight / 2, 0, 19, 19);
		this.game.addEntity(ped);

		this.game.addEntity(new NeutralVehicle(this.game, this.game.surfaceWidth * (3 / 4), this.game.surfaceHeight * (1 / 2), 45, 70, 64));
		
		let gridSize = 30;
		for (let i = 0; i < gridSize; i++){
			for (let j = 0; j < gridSize; j++){
				this.game.addBackground(new Ground(this.game, PARAMS.GRID_WIDTH * i, PARAMS.GRID_HEIGHT * j, 0))
			}
		}

		// this.game.addBackground(new Ground(this.game, 480, 384, 0));

		this.game.addBackground(new Road(this.game, 416, 384, 0));

		this.game.addTerrain(new Building(this.game, 544, 344, 0));

		this.game.addEffects(new Mission(this.game, 598, 384, 0));

		this.game.addEffects(new Target(this.game, 598, 354, 0));

		// TEST //
		
		// END TEST //

		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
	};
	
	update() {
		// TEST //
		this.leftText = PARAMS.SCALE;
		// END TEST //
		if (this.focus) {
			this.x = (this.focus.x - this.game.surfaceWidth / 2);
			this.y = (this.focus.y - this.game.surfaceHeight / 2);
		}
	};
	
	draw(ctx) {
		// HUD //
		
		//

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