// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale, width, height, animation ) {
		// Constants
		this.FRICTION = 0.1;
		// Parameters
		Object.assign(this, { game, x, y, direction, scale, width, height, animation });
		
		// Initialize generic members
		this.hitPoints = 5;
		this.invulnerable = 0;
		this.isColliding = false;
		this.isApproaching = false;
		
		this.updateBB();
	};

	setHP(hp) {this.hitPoints = hp; };
	getHP(){ return this.hitPoints; };

	damage(dmg) {
		if (this.invulnerable <= 0){
			this.hitPoints -= dmg;
			this.invulnerable = 10;
			return true;
		}
		return false;
	};

	addForce(a, d) {
		// If input is valid, then calculate and push
		if (a && d) {
			//console.log("pushing distance " + d + " pixels @ " + a + " degrees");
			this.x += (d * Math.cos((Math.PI / 180) * a));
			this.y += (d * Math.sin((Math.PI / 180) * a));
		}
	}

	setup() {
		// reset flags
		this.isApproaching = false;
		this.isColliding = false;
	};
	
	update() {
		if (this.invulnerable >= 0) this.invulnerable--;

		// Equalize direction
		while (this.direction < 0) this.direction += 360;
		this.direction = this.direction % 360;
		
		this.updateBB();
	};

	updateCollision() {
		//
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.width / 2, this.y - this.width / 2, (3 * this.width) / 4, (3 * this.height) / 4, this.direction);
		this.nextBB = new BoundingBox(this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
												(3 * this.width) / 4, (3 * this.height) / 4, this.direction);
	};
	
	draw(ctx) {
		// Animate frame
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			if (this.isColliding) this.BB.draw(ctx, this.game, "Green");
			else this.BB.draw(ctx, this.game, "Red");

			if (this.isApproaching) this.nextBB.draw(ctx, this.game, "Blue");
			else this.nextBB.draw(ctx, this.game, "Orange");
		}
	};
};