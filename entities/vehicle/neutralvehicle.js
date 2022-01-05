// NPC vehicle object
class NeutralVehicle {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.VERSION_COUNT = 1;
		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");

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
		this.standing = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// Walking
		
		// Initialize 'parent' object
		this.vehicle = new Vehicle(game, x, y, direction, width, height, this.standing);
		
		this.vehicle.goal = this.goalList[randomInt(this.goalList.length)];
    }

	setHP(hp) {this.vehicle.setHP(hp); };
	getHP(){ return this.vehicle.getHP(); };

	damage(dmg) { return this.vehicle.damage(dmg) };
	push(a, d) {
		this.vehicle.push(a,d);
	}

	setup() {
		// Reset walking flag
		this.vehicle.isWalking = false;

		// parent setup
		this.vehicle.setup();
	}

    update() {
		// Reactive decision making for intent
		this.intent();
		
		if (this.dead) {
			// Statistics
			this.game.camera.dudeCount--;
			this.game.camera.deathCount++;
			// Create Corpse
			this.game.addBackground(new Corpse(this.game, this.vehicle.entity.x, this.vehicle.entity.y,
					this.vehicle.entity.direction, this.vehicle.entity.width, this.vehicle.entity.height, this.version))
			// Delete this object
			this.removeFromWorld = true;
		} else {
			// Collision
			this.updateCollision();
		}

		if (this.getHP() <= 0) this.dead = true;
		// Parent update
        this.vehicle.update();
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
				if (entity instanceof NeutralVehicle && !entity.dead) {	
					that.isApproaching = true;

					if (entity.damage(1)) entity.push( Math.round( getAngle(that.BB, entity.BB)), Math.round(getDistance(that.BB,entity.BB) ) );
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof NeutralVehicle && !entity.dead) {	

					that.isColliding = true;
					entity.isColliding = true;
				}
			}
		});
		
		// Update parent BB
		this.setBB(this.BB);
		this.setNextBB(this.nextBB);

		// parent updateCollision
		this.vehicle.updateCollision();
	}

	getBB() { return this.vehicle.getBB(); };
	getNextBB() { return this.vehicle.getNextBB(); };

	setBB(bb) { this.vehicle.setBB(bb); }
	setNextBB(bb) { this.vehicle.setNextBB(bb); }

	intent() {
		// if (this.game.forward) this.vehicle.goal = this.goalList[randomInt(this.goalList.length)];
		// if (this.game.backward) delete this.vehicle.goal;

		// Assign goal
        if (this.vehicle.getDistanceToGoal() <= this.vehicle.entity.width ) {
			let ptr = 0;
			for (var i = 0; i < this.goalList.length; i++){
				if ( (this.goalList[i].x == this.vehicle.goal.x) && (this.goalList[i].y == this.vehicle.goal.y) ) ptr = i;
			}
			ptr = (ptr + 1) % this.goalList.length;
			this.vehicle.goal = this.goalList[ptr];
		}

		// if (this.game.click) {
		// 	this.goal = this.game.click;
		// 	this.game.addEntity(new Point(this.goal.x, this.goal.y));
		// }
	}

    draw(ctx) {
		if (this.vehicle.isWalking) this.vehicle.entity.animation = this.walking;
		else if (!this.dead) this.vehicle.entity.animation = this.standing;

        this.vehicle.draw(ctx);
    }
};