// Player as a pedestrian object
class NeutralPed {
	constructor(game, x, y, direction, width, height) {
		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");
        this.pedestrian = new Pedestrian(game, x, y, direction, width, height, spritesheet);

		this.dead = false;
		
		this.goalList = [];
		this.goalList.push(new Point(100,100));
		this.goalList.push(new Point(924,100));
		this.goalList.push(new Point(100,668));
		this.goalList.push(new Point(924,668));
		
		this.respawns = [];
		this.respawns.push(new Point(-100,-100));
		this.respawns.push(new Point(512,-100));
		this.respawns.push(new Point(1124,-100));
		this.respawns.push(new Point(1124,384));
		this.respawns.push(new Point(-100,868));
		this.respawns.push(new Point(-100,384));
		this.respawns.push(new Point(1124,868));

		this.pedestrian.goal = this.goalList[Math.floor(Math.random() * 4)];
    }

    update() {
		// Reactive decision making for intent
		this.intent();
		
		if (this.dead) {
			let newPt = this.respawns[Math.floor(Math.random() * 4)];
			this.game.addEntity(new NeutralPed(this.game, newPt.x, newPt.y , 0, 19, 19));
			this.removeFromWorld = true;
		} else {
			// Collision
			this.updateCollision();
		}

		// Parent update
        this.pedestrian.update();
	};

	updateCollision(){
		// Update self
		this.BB = this.getBB();
		this.nextBB = this.getNextBB();

		// Collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			// Action predictions
			if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
				if (entity instanceof NeutralPed) {	// collision example
					that.isApproaching = true;
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof NeutralPed && !entity.dead) {	// collision example
					that.isColliding = true;
					entity.isColliding = true;
					entity.dead = true;
					that.game.camera.collideCount++;
				}
			}
		});
		
		// Update parent BB
		this.setBB(this.BB);
		this.setNextBB(this.nextBB);

		// parent updateCollision
		this.pedestrian.updateCollision();
	}

	getBB() { return this.pedestrian.getBB(); };
	getNextBB() { return this.pedestrian.getNextBB(); };

	setBB(bb) { this.pedestrian.setBB(bb); }
	setNextBB(bb) { this.pedestrian.setNextBB(bb); }

	intent() {
		// Assign goal
        if (this.pedestrian.getDistanceToGoal() <= this.pedestrian.entity.width / 2) this.pedestrian.goal = this.goalList[Math.floor(Math.random() * 4)];

        if (this.pedestrian.goal && this.game.space) delete this.pedestrian.goal;

		// if (this.game.click) {
		// 	this.goal = this.game.click;
		// 	this.game.addEntity(new Point(this.goal.x, this.goal.y));
		// }
	}

    draw(ctx) {
        this.pedestrian.draw(ctx);
    }
};