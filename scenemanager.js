class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.x = 0;
		this.y = 0;
		this.lastRespawn = 0;

		this.respawns = [];
		this.respawns.push(new Point(-100,-100));	// TOP LEFT
		this.respawns.push(new Point(512,-100));	// TOP
		this.respawns.push(new Point(1124,-100));	// TOP RIGHT
		this.respawns.push(new Point(1124,384));	// RIGHT
		this.respawns.push(new Point(1124,868));	// BOTTOM RIGHT
		this.respawns.push(new Point(512,868));		// BOTTOM
		this.respawns.push(new Point(-100,868));	// BOTTOM LEFT
		this.respawns.push(new Point(-100,384));	// LEFT
		
		this.loadMap();
	};
	
	loadMap() {

		//this.game.addEntity(new PlayerPed(this.game, 1024 / 4, 768 / 4, 0, 19, 19));
		//this.game.addEntity(new PlayerVehicle(this.game, 1024 / 4, 768 / 4, 0, 70, 64));
		this.game.addEntity(new NeutralVehicle(this.game, 1024 / 4, 768 / 4, 0, 70, 64));
		
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
		// Add more dudes
		if ((randomInt(this.dudeCount) / this.game.ITEM_CAP < 0.000001)) {
			let pt = this.respawns[this.lastRespawn];
			this.lastRespawn = (this.lastRespawn + 1) % this.respawns.length;
			//this.game.addEntity(new NeutralPed(this.game, pt.x, pt.y, 0, 19, 19));
			//this.game.addEntity(new NeutralVehicle(this.game, pt.x, pt.y, 0, 70, 64));
		}

		// Reset
		if (this.game.space) {
			this.clearEntities();
			this.loadMap();
		}
	};
	
	draw(ctx) {
		// HUD //
		// this.leftText = "LEFT";
		// this.centerText = "CENTER";
		// this.rightText = "RIGHT";
		
		// LEFT ALIGN TEXT //
		ctx.textAlign  = "left";
		//
		ctx.font = "30px Impact";
		ctx.strokeStyle = 'White';
		ctx.strokeText(this.leftText, 50, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(this.leftText, 50, 50);
		
		// CENTER ALIGN TEXT //
		ctx.textAlign  = "center";
		//
		ctx.font = "30px Impact";
		ctx.strokeStyle = 'White';
		ctx.strokeText(this.centerText, this.game.surfaceWidth / 2, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(this.centerText, this.game.surfaceWidth / 2, 50);
		
		// RIGHT ALIGN TEXT //
		ctx.textAlign  = "right";
		//
		ctx.font = "30px Impact";
		ctx.strokeStyle = 'White';
		ctx.strokeText(this.rightText, this.game.surfaceWidth - 50, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(this.rightText, this.game.surfaceWidth - 50, 50);
	};
	
	clearEntities() {
        this.game.background = [];
        this.game.terrain = [];
        this.game.entities = [];
        this.game.effects = [];
    };
}