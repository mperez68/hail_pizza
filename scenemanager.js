class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.x = 0;
		this.y = 0;	
		
		// TODO remove after testing
		this.collideCount = 0;
		
		this.loadMap();
	};
	
	loadMap() {
		//this.game.addEntity(new PlayerPed(this.game, 1024 / 4, 768 / 4, 0, 19, 19));

		this.game.addEntity(new NeutralPed(this.game, 509, 753, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 760, 56, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 139, 554, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 828, 569, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 267, 27, 0, 19, 19));
		
		this.game.addEntity(new NeutralPed(this.game, 0, 0, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 1024, 0, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 0, 768, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 1024, 768, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 512, 384, 0, 19, 19));
		
		this.game.addEntity(new NeutralPed(this.game, 512, 0, 0, 19, 19));		// TOP
		this.game.addEntity(new NeutralPed(this.game, 1024, 384, 0, 19, 19));	// RIGHT
		this.game.addEntity(new NeutralPed(this.game, 512, 768, 0, 19, 19));	// BOTTOM
		this.game.addEntity(new NeutralPed(this.game, 0, 384, 0, 19, 19));		// LEFT

		this.game.addEntity(new NeutralPed(this.game, -100, -100, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 512, -100, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 1124, -100, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 1124, 384, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, -100, 868, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, -100, 384, 0, 19, 19));
		this.game.addEntity(new NeutralPed(this.game, 1124, 868, 0, 19, 19));

		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
	};
	
	update() {
		// Reset
		if (this.game.space) {
			this.clearEntities();
			this.loadMap();
		}
	};
	
	draw(ctx) {
		// HUD //
		this.centerText = this.collideCount;
		
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