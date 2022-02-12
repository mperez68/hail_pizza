// Generic Entity Stub.
class Entity {
	constructor(game, x, y, direction, scale, width, height, animation ) {
		// Constants
		this.FRICTION = 0;
		this.MAX_SPEED = 9999;
		// Parameters
		Object.assign(this, { game, x, y, direction, scale, width, height, animation });
		
		// Initialize generic members
		this.hitPoints = 5;
		this.invulnerable = 0;
		this.isColliding = false;
		this.isApproaching = false;
		
		this.updateBB();
		this.netForce = new ForceVector(this.game, this.BB.x, this.BB.y, this.direction, 0);
		this.game.addDebug(this.netForce);
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
		// If input is valid, then calculate and insert
		if (a && d) {
			let f = new ForceVector(this.game, this.BB.x, this.BB.y, a, d);
			this.netForce.sumForce(f);
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

		// Enact Forces
		if (this.netForce.force > this.FRICTION) {
			this.netForce.force -= this.FRICTION * (this.netForce.force / this.MAX_SPEED);
		} else if (this.netForce.force < -this.FRICTION) {
			this.netForce.force += this.FRICTION * (this.netForce.force / this.MAX_SPEED);
		} else {
			this.netForce.force = 0;
		}
		this.x += (this.netForce.force * Math.cos((Math.PI / 180) * this.netForce.direction));
		this.y += (this.netForce.force * Math.sin((Math.PI / 180) * this.netForce.direction));
		//if (this.netForce.force > 0) console.log("FORCE: " + this.netForce.force + " pixels @ " + this.netForce.direction + " degrees to (" + this.x + "," + this.y + ")");

		this.updateBB();
		this.netForce.setCoords(this.BB.x, this.BB.y);
	};

	updateCollision() {
		//
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.game, this.x - this.width / 2, this.y - this.width / 2, (3 * this.width) / 4, (3 * this.height) / 4, this.direction);
		this.nextBB = new BoundingBox(this.game, this.BB.x + ((3 * this.width) / 4 * Math.cos((Math.PI / 180) * this.direction)),
											this.BB.y + ((3 * this.height) / 4 * Math.sin((Math.PI / 180) * this.direction)),
												(3 * this.width) / 4, (3 * this.height) / 4, this.direction);
	};

	getBB() { return this.BB; }
	getNextBB() { return this.nextBB; }

	setBB(bb) { this.BB = bb; }
	setNextBB(bb) { this.nextBB = bb; }
	
	draw(ctx) {
		// add new points
		for (var i = 0; i < this.BB.newPoints.length; i++){
			this.game.addDebug(this.BB.newPoints[i]);
		}
		this.BB.newPoints = [];

		// Animate frame
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
		
		// Debug box drawing
		if (PARAMS.DEBUG) {
			//Draw 4 Bounding Box points to represent corners
			ctx.strokeStyle = 'Red';
			if (this.isColliding == true) ctx.strokeStyle = 'Green';
			for (var i = 0; i < this.BB.points.length; i++) {
				let j = (i-1 + 4) % 4;
				ctx.beginPath();
				ctx.moveTo(this.BB.points[i].x - this.game.camera.x, this.BB.points[i].y - this.game.camera.y);
				ctx.lineTo(this.BB.points[j].x - this.game.camera.x, this.BB.points[j].y - this.game.camera.y);
				ctx.stroke();
			}
			// nextBB
			ctx.strokeStyle = 'Blue';
			ctx.beginPath();
			ctx.moveTo(this.nextBB.points[0].x - this.game.camera.x, this.nextBB.points[0].y - this.game.camera.y);
			ctx.lineTo(this.nextBB.points[3].x - this.game.camera.x, this.nextBB.points[3].y - this.game.camera.y);
			ctx.stroke();
			if (this.isApproaching == true) {
				ctx.strokeStyle = 'Red';
				ctx.beginPath();
				ctx.moveTo(this.nextBB.points[0].x - this.game.camera.x, this.nextBB.points[0].y - this.game.camera.y);
				ctx.lineTo(this.nextBB.points[2].x - this.game.camera.x, this.nextBB.points[2].y - this.game.camera.y);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(this.nextBB.points[1].x - this.game.camera.x, this.nextBB.points[1].y - this.game.camera.y);
				ctx.lineTo(this.nextBB.points[3].x - this.game.camera.x, this.nextBB.points[3].y - this.game.camera.y);
				ctx.stroke();
			}
			ctx.font = "12px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("L", this.BB.left.x - this.game.camera.x, this.BB.left.y - this.game.camera.y);
			ctx.fillText("T", this.BB.top.x - this.game.camera.x, this.BB.top.y - this.game.camera.y);
			ctx.fillText("R", this.BB.right.x - this.game.camera.x, this.BB.right.y - this.game.camera.y);
			ctx.fillText("B", this.BB.bottom.x - this.game.camera.x, this.BB.bottom.y - this.game.camera.y);
		}
	};
};