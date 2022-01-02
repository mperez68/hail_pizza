class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		this.game.camera = this;
		this.x = 0;
		this.y = 0;	
		
		this.loadMap();
	};
	
	loadMap() {
		// this.game.addEntity(new Entity(this.game, 1024 / 2, (768 / 2) - 28, 0));
		// this.game.addEntity(new Entity(this.game, 1024 / 2, (768 / 2) + 28, 0));

		this.game.addEntity(new Entity(this.game, 100, 500, 0));
		this.game.addEntity(new Entity(this.game, 100, 600, 90));

		this.game.addEntity(new Entity(this.game, 200, 500, 90));
		this.game.addEntity(new Entity(this.game, 232, 600, 140));

		this.game.addEntity(new Entity(this.game, 300, 600, 60));
		this.game.addEntity(new Entity(this.game, 300, 510, 90));

		this.game.addEntity(new Entity(this.game, 400, 600, 60));
		this.game.addEntity(new Entity(this.game, 400, 535, 90));

		this.game.addEntity(new Entity(this.game, 500, 600, 45));
		this.game.addEntity(new Entity(this.game, 500, 560, 90));

		this.game.addEntity(new Entity(this.game, 600, 600, 45));
		this.game.addEntity(new Entity(this.game, 600, 600, 90));

		this.game.addEntity(new Entity(this.game, 800, 600, 0));
		this.game.addEntity(new Entity(this.game, 756, 644, 135));
		this.game.addEntity(new Entity(this.game, 756, 558, 225));
		this.game.addEntity(new Entity(this.game, 842, 644, 45));
		this.game.addEntity(new Entity(this.game, 842, 558, 315));

		this.game.addEntity(new Entity(this.game, 800, 300, 0));
		this.game.addEntity(new Entity(this.game, 764, 336, 135));
		this.game.addEntity(new Entity(this.game, 764, 264, 225));
		this.game.addEntity(new Entity(this.game, 836, 336, 45));
		this.game.addEntity(new Entity(this.game, 836, 264, 315));

		this.game.addEntity(new Entity(this.game, 500, 300, 45));
		this.game.addEntity(new Entity(this.game, 464, 336, 90));
		this.game.addEntity(new Entity(this.game, 464, 264, 180));
		this.game.addEntity(new Entity(this.game, 536, 336, 0));
		this.game.addEntity(new Entity(this.game, 536, 264, 270));
	};
	
	update() {
		// TODO
	};
	
	draw(ctx) {
		// HUD //
		
		// LEFT ALIGN TEXT //
		ctx.textAlign  = "left";
		//
		let leftText = "LEFT";
		ctx.font = "30px Impact";
		ctx.strokeStyle = 'White';
		ctx.strokeText(leftText, 50, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(leftText, 50, 50);
		
		// CENTER ALIGN TEXT //
		ctx.textAlign  = "center";
		//
		let centerText = "CENTER";
		ctx.font = "30px Impact";
		ctx.strokeStyle = 'White';
		ctx.strokeText(centerText, this.game.surfaceWidth / 2, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(centerText, this.game.surfaceWidth / 2, 50);
		
		// RIGHT ALIGN TEXT //
		ctx.textAlign  = "right";
		//
		let rightText = "RIGHT";
		ctx.font = "30px Impact";
		ctx.strokeStyle = 'White';
		ctx.strokeText(rightText, this.game.surfaceWidth - 50, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(rightText, this.game.surfaceWidth - 50, 50);
	};
	
	clearEntities() {
        this.game.entities = [];
        this.game.background = [];
    };
}