class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.x = 0;
		this.y = 0;
		this.lastRespawn = 0;

		this.respawns = [];
		this.respawns.push(new Point(this.game,-100,-100));	// TOP LEFT
		this.respawns.push(new Point(this.game,512,-100));	// TOP
		this.respawns.push(new Point(this.game,1124,-100));	// TOP RIGHT
		this.respawns.push(new Point(this.game,1124,384));	// RIGHT
		this.respawns.push(new Point(this.game,1124,868));	// BOTTOM RIGHT
		this.respawns.push(new Point(this.game,512,868));		// BOTTOM
		this.respawns.push(new Point(this.game,-100,868));	// BOTTOM LEFT
		this.respawns.push(new Point(this.game,-100,384));	// LEFT
		
		this.loadMap();
	};
	
	loadMap() {
		//let player = new PlayerPed(this.game, this.game.surfaceWidth / 2, this.game.surfaceHeight / 2, 0, 19, 19);
		//this.player = player.pedestrian.entity;
		let player = new PlayerVehicle(this.game, this.game.surfaceWidth / 2, this.game.surfaceHeight / 2, 1, 70, 64);
		this.player = player.vehicle.entity;

		this.game.addEntity(player);

		//this.game.addEntity(new NeutralVehicle(this.game, this.game.surfaceWidth * (3 / 4), this.game.surfaceHeight * (1 / 2), 45, 70, 64));
		// this.game.addEntity(new NeutralVehicle(this.game, this.game.surfaceWidth * (3 / 4), this.game.surfaceHeight * (3 / 4), 0, 70, 64));
		
		this.game.addBackground(new Ground(this.game, 480, 384, 0));
		this.game.addBackground(new Road(this.game, 416, 384, 0));
		this.game.addTerrain(new Building(this.game, 544, 384, 0));
		this.game.addEffects(new Mission(this.game, 598, 384, 0));
		this.game.addEffects(new Target(this.game, 598, 354, 0));
		
		this.game.addEffects(new Mission(this.game, 292,56, 0));
		this.game.addEffects(new Mission(this.game, 727,61, 0));
		this.game.addEffects(new Mission(this.game, 868,536, 0));
		this.game.addEffects(new Mission(this.game, 520,709, 0));
		this.game.addEffects(new Mission(this.game, 141,525, 0));

		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
	};
	
	update() {
		if (this.player) {
			this.x = this.player.x - this.game.surfaceWidth / 2;
			this.y = this.player.y - this.game.surfaceHeight / 2;
		}

		// Add more dudes
		if ((randomInt(this.game.entities.length) / this.game.ITEM_CAP < 0.000001)) {
			let pt = this.respawns[this.lastRespawn];
			this.lastRespawn = (this.lastRespawn + 1) % this.respawns.length;
			// this.game.addEntity(new NeutralPed(this.game, pt.x, pt.y, 0, 19, 19));
			// this.game.addEntity(new NeutralVehicle(this.game, pt.x, pt.y, 0, 70, 64));
		}

		// Reset
		// if (this.game.space) {
		// 	this.clearEntities();
		// 	this.loadMap();
		// }
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