// Player as a pedestrian object
class NeutralPed {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.VERSION_COUNT = 2;
		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");

		this.version = Math.floor(Math.random() * this.VERSION_COUNT);
		this.dead = false;
		
		this.goalList = [];
		// this.goalList.push(new Point(100,100));
		// this.goalList.push(new Point(924,100));
		// this.goalList.push(new Point(100,668));
		// this.goalList.push(new Point(924,668));

		this.goalList.push(new Point(292,56));
		this.goalList.push(new Point(520,709));
		this.goalList.push(new Point(727,61));
		this.goalList.push(new Point(141,525));
		this.goalList.push(new Point(868,536));
		
		this.respawns = [];
		this.respawns.push(new Point(-100,-100));
		this.respawns.push(new Point(512,-100));
		this.respawns.push(new Point(1124,-100));
		this.respawns.push(new Point(1124,384));
		this.respawns.push(new Point(-100,868));
		this.respawns.push(new Point(-100,384));
		this.respawns.push(new Point(1124,868));
		
		// Animations
		this.standing = new Animator(spritesheet, 0, height * this.version,
			width, height, 12, 0.2, 0, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 228, height * this.version,
			width, height, 8, 0.08, 0, direction, false, true);	// Walking
		
		// Initialize 'parent' object
		this.pedestrian = new Pedestrian(game, x, y, direction, width, height, this.standing);
		
		this.pedestrian.goal = this.goalList[Math.floor(Math.random() * (this.goalList.length + 1))];
    }

	setup() {
		// Reset walking flag
		this.pedestrian.isWalking = false;

		// parent setup
		this.pedestrian.setup();
	}

    update() {
		// Reactive decision making for intent
		this.intent();
		
		if (this.dead) {
			let newPt = this.respawns[Math.floor(Math.random() * 4)];
			this.game.addEntity(new NeutralPed(this.game, newPt.x, newPt.y , 0, 19, 19));
			this.game.addBackground(new Spray(this.game, this.pedestrian.entity.x, this.pedestrian.entity.y,
					this.pedestrian.entity.direction, this.pedestrian.entity.width, this.pedestrian.entity.height))
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
				if (entity instanceof NeutralPed && !entity.dead) {	// collision example
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
		if (this.game.forward) this.pedestrian.goal = this.goalList[Math.floor(Math.random() * 4)];
		if (this.game.backward) delete this.pedestrian.goal;

		// Assign goal
        if (this.pedestrian.getDistanceToGoal() <= this.pedestrian.entity.width / 2) this.pedestrian.goal = this.goalList[Math.floor(Math.random() * 4)];

		// if (this.game.click) {
		// 	this.goal = this.game.click;
		// 	this.game.addEntity(new Point(this.goal.x, this.goal.y));
		// }
	}

    draw(ctx) {
		if (this.pedestrian.isWalking) this.pedestrian.entity.animation = this.walking;
		else if (!this.dead) this.pedestrian.entity.animation = this.standing;

        this.pedestrian.draw(ctx);
    }
};