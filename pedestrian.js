// Pedestrian Entity
class Pedestrian {
	constructor(game, x, y, direction, width, height) {
		// Constants
		this.RUN_SPEED = 3;
		this.PIVOT_SPEED = 3;
		// Assign Object Variables
		Object.assign(this, { game });
		
		this.goalList = [];
		this.goalList.push(new Point(100,100));
		this.goalList.push(new Point(924,100));
		this.goalList.push(new Point(100,668));
		this.goalList.push(new Point(924,668));

		this.goal = this.goalList[Math.floor(Math.random() * 4)];
		
		// Animations
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");
		this.standing = new Animator(this.spritesheet, 0, 20,
			width, height, 5, 0.3, 1, direction, false, true);	// Standing
		this.walking = new Animator(this.spritesheet, 0, 0,
			width, height, 12, 0.05, 1, direction, false, true);	// Walking

		// Initialize 'parent' object
		this.entity = new Entity(game, x, y, direction, 1, width, height, this.standing);
	};
	
	update() {
		// Reactive decision making for intent
		this.intent();

		// Pathfinding
		if (this.goal) this.pathfind();

		// Parent update, Collision
		this.entity.update();
	};

	intent() {
		// Assign goal


		// if (this.game.click) {
		// 	this.goal = this.game.click;
		// 	this.game.addEntity(new Point(this.goal.x, this.goal.y));
		// }
	}

	pathfind(){
		// Determine Distance/Angle
		let d = Math.sqrt( Math.pow(this.entity.x - this.goal.x, 2) + Math.pow(this.entity.y - this.goal.y, 2) );
		let a = Math.atan( (this.goal.y - this.entity.y) / (this.goal.x - this.entity.x) ) * 180 / Math.PI;
		// Normalize for 360 deg calculation
		if (this.goal.x < this.entity.x) a += 180;
		if (a < 0) a += 360;

		let diff = a - this.entity.direction;
		while (diff < 0) diff += 360;
		diff = diff % 360;

		// Align direction
		if ( diff >= 0 && diff < 180 ) this.entity.direction += this.PIVOT_SPEED;
		if ( diff >= 180 && diff < 360 ) this.entity.direction -= this.PIVOT_SPEED;
		if ( Math.abs(this.entity.direction - a) <= 2 * this.PIVOT_SPEED ) this.entity.direction = a;

		// Initialize animation to standing
		this.entity.spritesheet = this.standing;
		// Move closer
		if (d > PARAMS.GRID_WIDTH) {
			this.entity.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction));
			this.entity.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction));
			this.entity.spritesheet = this.walking;	// Update animation to be walking
		} else if (d > this.entity.width / 2) {
			this.entity.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction)) * (d / PARAMS.GRID_WIDTH);
			this.entity.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction)) * (d / PARAMS.GRID_WIDTH);
			this.entity.spritesheet = this.walking;	// Update animation to be walking
		} else {
			this.goal = this.goalList[Math.floor(Math.random() * 4)];
		}
	}

	controls() {
		// Initialize animation to standing
		this.entity.spritesheet = this.standing;
		// Forward OR Backward, forward taking precedent.
		if (this.game.forward) {
			this.entity.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction));
			this.entity.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction));
			this.entity.spritesheet = this.walking;	// Update animation to be walking
		} else if (this.game.backward) {
			this.entity.x -= (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.entity.direction) * 0.5);
			this.entity.y -= (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.entity.direction) * 0.5);
			this.entity.spritesheet = this.walking;	// Update animation to be walking
		}
		// Left OR Right, both pressed cancels out.
		if (this.game.left) {
			this.entity.direction -= this.PIVOT_SPEED;
		}
		if (this.game.right) {
			this.entity.direction += this.PIVOT_SPEED;
		}
	}

	draw(ctx) {
		// Parent draw
		this.entity.draw(ctx);
	};
};
