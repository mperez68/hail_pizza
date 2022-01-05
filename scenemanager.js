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
		// TODO remove after testing
		this.dudeCount = 0;
		this.deathCount = 0;
		this.corpseCount = 0;

		//this.game.addEntity(new PlayerPed(this.game, 1024 / 4, 768 / 4, 0, 19, 19));
		
		this.game.addBackground(new Ground(this.game, 480, 384, 0));
		this.game.addBackground(new Road(this.game, 416, 384, 0));

		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
	};
	
	update() {
		this.dudeCount = Math.min(this.dudeCount, this.game.ITEM_CAP);
		this.corpseCount = Math.min(this.corpseCount, this.game.ITEM_CAP);

		// Add more dudes
		if ((randomInt(this.dudeCount) / this.game.ITEM_CAP < 0.000001)) {
			let pt = this.respawns[this.lastRespawn];
			this.lastRespawn = (this.lastRespawn + 1) % this.respawns.length;
			this.game.addEntity(new NeutralPed(this.game, pt.x, pt.y, 0, 19, 19));
		}

		// Reset
		if (this.game.space) {
			this.clearEntities();
			this.loadMap();
		}
	};
	
	draw(ctx) {
		// HUD //
		this.leftText = this.dudeCount + " Dudes";
		this.centerText = this.deathCount + " Deaths";
		this.rightText = this.corpseCount + " Corpses";
		
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
        this.game.entities = [];
        this.game.background = [];
    };
}