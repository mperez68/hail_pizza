// NPC vehicle object
class NeutralVehicle {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.VERSION_COUNT = 1;
		// Assign Object Variables
		Object.assign(this, { game });
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/drivercar.png");

		this.version = randomInt(this.VERSION_COUNT);
		
		this.goalList = [];

		this.goalList.push(new Point(292,56));
		this.goalList.push(new Point(727,61));
		this.goalList.push(new Point(868,536));
		this.goalList.push(new Point(520,709));
		this.goalList.push(new Point(141,525));

		this.goalList.push(new Point(509,377));
		
		// Animations
		this.idle = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// idle
		this.driving = new Animator(spritesheet, 0, 0,
			width, height, 1, 1, 1, direction, false, true);	// driving
		
		// Initialize 'parent' object
		this.vehicle = new Vehicle(game, x, y, direction, width, height, this.idle);
		
		this.vehicle.goal = this.goalList[randomInt(this.goalList.length)];
    }

	setHP(hp) {this.vehicle.setHP(hp); };
	getHP(){ return this.vehicle.getHP(); };

	damage(dmg) { return this.vehicle.damage(dmg) };
	push(a, d) {
		this.vehicle.push(a,d);
	}

	setup() {
		// parent setup
		this.vehicle.setup();
	}

    update() {
		// Reactive decision making for intent
		this.intent();
		
		// Collision
		this.updateCollision();

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
				if (entity instanceof NeutralVehicle) {	
					that.isApproaching = true;
				}
			}
			// Collision cases
			if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof NeutralVehicle) {
					that.isColliding = true;
					entity.isColliding = true;
					
					entity.push( Math.round( getAngle(that.BB, entity.BB)), Math.round(getDistance(that.BB,entity.BB) ) );
				}
				if ( (entity instanceof NeutralPed || entity instanceof PlayerPed) && !entity.dead) {	
					that.isColliding = true;
					entity.isColliding = true;
					
					if (entity.damage(5)) entity.push( Math.round( getAngle(that.BB, entity.BB)), Math.round(getDistance(that.BB,entity.BB) ) );
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
		if (this.vehicle.isDriving) this.vehicle.entity.animation = this.driving;
		else if (!this.dead) this.vehicle.entity.animation = this.idle;

        this.vehicle.draw(ctx);
    }
};