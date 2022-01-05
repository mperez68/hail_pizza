// Player as a pedestrian object
class NeutralPed {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.VERSION_COUNT = 2;
		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");

		this.version = randomInt(this.VERSION_COUNT);
		this.dead = false;

		this.game.camera.dudeCount++;
		
		this.goalList = [];

		this.goalList.push(new Point(292,56));
		this.goalList.push(new Point(727,61));
		this.goalList.push(new Point(868,536));
		this.goalList.push(new Point(520,709));
		this.goalList.push(new Point(141,525));
		
		// Animations
		this.standing = new Animator(spritesheet, 0, height * this.version,
			width, height, 12, 0.2, 0, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 228, height * this.version,
			width, height, 8, 0.08, 0, direction, false, true);	// Walking
		
		// Initialize 'parent' object
		this.pedestrian = new Pedestrian(game, x, y, direction, width, height, this.standing);
		
		this.pedestrian.goal = this.goalList[randomInt(this.goalList.length)];
    }

	setHP(hp) {this.pedestrian.setHP(hp); };
	getHP(){ return this.pedestrian.getHP(); };

	damage(dmg) { return this.pedestrian.damage(dmg) };
	push(a, d) {
		this.pedestrian.push(a,d);
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
			// Statistics
			this.game.camera.dudeCount--;
			this.game.camera.deathCount++;
			// Create Corpse
			this.game.addBackground(new Corpse(this.game, this.pedestrian.entity.x, this.pedestrian.entity.y,
					this.pedestrian.entity.direction, this.pedestrian.entity.width, this.pedestrian.entity.height, this.version))
			// Delete this object
			this.removeFromWorld = true;
		} else {
			// Collision
			this.updateCollision();
		}

		if (this.getHP() <= 0) this.dead = true;
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
				if (entity instanceof NeutralPed && !entity.dead) {	
					that.isApproaching = true;

					if (entity.damage(1)) entity.push( Math.round( getAngle(that.BB, entity.BB)), Math.round(getDistance(that.BB,entity.BB) ) );
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof NeutralPed && !entity.dead) {	

					that.isColliding = true;
					entity.isColliding = true;
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
		if (this.game.forward) this.pedestrian.goal = this.goalList[randomInt(this.goalList.length)];
		if (this.game.backward) delete this.pedestrian.goal;

		// Assign goal
        if (this.pedestrian.getDistanceToGoal() <= this.pedestrian.entity.width ) {
			let ptr = 0;
			for (var i = 0; i < this.goalList.length; i++){
				if ( (this.goalList[i].x == this.pedestrian.goal.x) && (this.goalList[i].y == this.pedestrian.goal.y) ) ptr = i;
			}
			ptr = (ptr + 1) % this.goalList.length;
			this.pedestrian.goal = this.goalList[ptr];
		}

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