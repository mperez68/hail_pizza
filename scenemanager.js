class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.x = 0;
		this.y = 0;	
		
		this.loadMap();
	};
	
	loadMap() {
		this.game.addEntity(new Pedestrian(this.game, 1024 / 2, 768 / 2, 0, 19, 19));
		this.leftText = "LEFT";
		this.centerText = "CENTER";
		this.rightText = "RIGHT";
	};
	
	update() {
		// TODO
	};
	
	draw(ctx) {
		// HUD //
		
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