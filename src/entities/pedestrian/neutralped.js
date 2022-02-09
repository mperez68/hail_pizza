// Player as a Pedestrian object
class NeutralPed extends Pedestrian {
	constructor(game, x, y, direction, width, height) {
		super(game, x, y, direction, width, height);
		// Constants
		this.VERSION_COUNT = 2;
		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");

		this.version = randomInt(this.VERSION_COUNT);
		this.dead = false;

		this.game.camera.dudeCount++;
		
		// Override walking/standing animations
		this.standing = new Animator(spritesheet, 0, height * this.version,
									width, height, 12, 0.2, 0, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 228, height * this.version,
									width, height, 8, 0.08, 0, direction, false, true);	// Walking
		this.walkingBack = new Animator(spritesheet, 228, height,
									width, height, 8, 0.10, 0, direction, true, true);	// Walking Backward
    }

	setup() {
		// Reset walking flag
		this.isWalking = false;

		// parent setup
		super.setup();
	}

    update() {
		// Reactive decision making for intent
		this.intent();
		
		if (this.dead) {
			// Statistics
			this.game.camera.dudeCount--;
			this.game.camera.deathCount++;
			// Create Corpse
			this.game.addBackground(new Corpse(this.game, this.x, this.y,
					this.direction, this.width, this.height, this.version))
			// Delete this object
			this.removeFromWorld = true;
		} else {
			// Collision
			this.updateCollision();
		}

		if (this.getHP() <= 0) this.dead = true;
		// Parent update
        super.update();
	};

	updateCollision(){
		// Collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			// Action predictions
			if (that != entity && entity.BB && that.nextBB.collide(entity.BB)) {
				if (entity instanceof NeutralPed && !entity.dead) {	
					that.isApproaching = true;

					if (entity.damage(1)) entity.addForce( Math.round( Point.angle(that.BB, entity.BB)), Math.round(Point.distance(that.BB,entity.BB) ) );
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

		// parent updateCollision
		super.updateCollision();
	}

	intent() {
		// Assign goal
        if (this.getDistanceToGoal() <= this.width ) {
			// TODO goal queue
		}
	}

    draw(ctx) {
		super.draw(ctx);
    }
};