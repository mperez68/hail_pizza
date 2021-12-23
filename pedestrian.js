// PARENT CLASS //
//class Pedestrian


// CHILD CLASSES //

// Player Pedestrian Entity
class PlayerPed {
	constructor(game, x, y, direction) {
		// Constants
		this.RUN_SPEED = 3;
		this.PIVOT_SPEED = 3;
		this.JUMP_SPEED = 5;
		this.WIDTH = 19;	// Square animation box, HEIGHT == WIDTH
		// Assign Object Variables
		Object.assign(this, { game, x, y, direction });
		this.active = true;
		this.jumpFlag = false;
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/driver.png");
		
		// Initialize bounding box
		this.updateBB();
		
		// Animations
		this.standing = new AngleAnimator(this.spritesheet, 0, 20,
			this.WIDTH, this.WIDTH, 5, 0.3, 1, this.direction, false, true);	// Standing
		this.pizzaStand = new AngleAnimator(this.spritesheet, 0, 60,
			this.WIDTH, this.WIDTH, 5, 0.3, 1, this.direction, false, true);	// Standing w/ Pizza
		this.running = new AngleAnimator(this.spritesheet, 0, 0,
			this.WIDTH, this.WIDTH, 12, 0.05, 1, this.direction, false, true);	// Running
		this.pizzaRun = new AngleAnimator(this.spritesheet, 0, 40,
			this.WIDTH, this.WIDTH, 12, 0.05, 1, this.direction, false, true);	// Running w/ Pizza
		this.jumping = new AngleAnimator(this.spritesheet, 0, 0,
			this.WIDTH, this.WIDTH, 12, 0.7, 1, this.direction, false, true);	// Jumping
		this.deadAnim = new AngleAnimator(this.spritesheet, 100, 60,
			this.WIDTH, this.WIDTH, 1, 1, 1, this.direction, false, true);	// Dead
			
		// Assign initial focus
		this.game.player = this;
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.WIDTH / 2, this.y - this.WIDTH / 2, this.WIDTH, this.WIDTH, this.direction);
		this.nextBB = new BoundingBox(this.x + (this.WIDTH * Math.cos((Math.PI / 180) * this.direction)) - this.WIDTH / 2,
											this.y + (this.WIDTH * Math.sin((Math.PI / 180) * this.direction)) - this.WIDTH / 2,
											this.WIDTH, this.WIDTH, this.direction);
	}
	
	update() {

		var that = this;

		//var isWalking = this.game.forward || this.game.backward || this.game.left || this.game.right;

		/*if (isWalking && this.active) {
			ASSET_MANAGER.adjustVolumeOnPath(.5, "./music/walking.mp3");
			if (ASSET_MANAGER.getAsset("./music/walking.mp3").paused) {
				ASSET_MANAGER.playAsset("./music/walking.mp3");
			}
		} else {
			ASSET_MANAGER.pauseAsset("./music/walking.mp3");
		}*/

		if (this.dead) return;

		if (this.active) {
			// Affirm focus
			this.game.player = this;
			
			// Jumping
			var that = this;
			if (this.game.space && !this.jumpFlag) {
				this.jumpFlag = true;
				setTimeout(function () {	// TODO
					that.jumpFlag = false;
					//console.log('Jump End');
				}, 300)
			}
			
			// Turning
			if (this.game.left && !this.jumpFlag) {
				this.direction -= this.PIVOT_SPEED;
			} else if (this.game.right && !this.jumpFlag) {
				this.direction += this.PIVOT_SPEED;
			}
			// Normalize to range integers 0-359
			this.direction = (Math.floor(this.direction) % 360 + 360) % 360;
			// Movement
			if(this.jumpFlag){
				this.x += (this.JUMP_SPEED * Math.cos((Math.PI / 180) * this.direction));
				this.y += (this.JUMP_SPEED * Math.sin((Math.PI / 180) * this.direction));
			} else if (this.game.forward) {
				this.x += (this.RUN_SPEED * Math.cos((Math.PI / 180) * this.direction));
				this.y += (this.RUN_SPEED * Math.sin((Math.PI / 180) * this.direction));
			} else if (this.game.backward) {
				this.x -= ((this.RUN_SPEED / 2) * Math.cos((Math.PI / 180) * this.direction));
				this.y -= ((this.RUN_SPEED / 2) * Math.sin((Math.PI / 180) * this.direction));
			}
		
			// Update bounding box
			this.updateBB();
		}
		
		/*
		// Handle pushes
		if (this.pushSpeed >= this.DRAG){
			this.pushSpeed -= this.DRAG;
		} else if (this.pushSpeed <= -this.DRAG){
			this.pushSpeed += this.DRAG;
		} else {
			this.pushSpeed = 0;
		}
		this.x += (this.pushSpeed * Math.cos((Math.PI / 180) * this.pushDirection));
		this.y += (this.pushSpeed * Math.sin((Math.PI / 180) * this.pushDirection));
		*/
		
		// Collision
		var that = this;
		var car = null;
		
		/*
		this.game.entities.forEach(function (entity) {
			if (entity !== that && entity.BB && entity.BB.collide(that.BB)) {
				if (entity instanceof Building || entity instanceof ModularBuilding) {	// hit building
					if (entity.BB.top < that.BB.bottom && entity.BB.top > that.y) that.y = entity.BB.top - that.WIDTH / 2;
					if (entity.BB.bottom > that.BB.top && entity.BB.bottom < that.y) that.y = entity.BB.bottom + that.WIDTH / 2;
					if (entity.BB.left < that.BB.right && entity.BB.left > that.x) that.x = entity.BB.left - that.WIDTH / 2;
					if (entity.BB.right > that.BB.left && entity.BB.right < that.x) that.x = entity.BB.right + that.WIDTH / 2;
				}
				if (entity instanceof Pedestrian) {	// push npc
				// TODO
				}
				if (entity instanceof Car && !that.invulnerable) {	// damaged by car
					// Calculate center to center angle
					//let angle = Math.atan( Math.abs(that.y - entity.y) / Math.abs(that.x - entity.x) ) * (180 / Math.PI);
					//if (entity.x - that.x >= 0 && entity.y - that.y >= 0) angle = (angle % 90); //Q1
					//if (entity.x - that.x <  0 && entity.y - that.y >= 0) angle = 180 - (angle % 90); //Q2
					//if (entity.x - that.x <  0 && entity.y - that.y <  0) angle = 180 + (angle % 90); //Q3
					//if (entity.x - that.x >= 0 && entity.y - that.y <  0) angle = 360 + (angle % 90); //Q4
					that.pushSpeed = 10;
					that.pushDirection = entity.direction + 90;
					that.invulnerable = true;
					setTimeout(function () {
						that.invulnerable = false;
					}, 2000)
					
				}
				if (entity instanceof StartMission) {	// start mission
					if (!that.onMission) {
						if (ASSET_MANAGER.getAsset("./music/newMission.mp3").paused) {
							ASSET_MANAGER.adjustVolumeOnPath(0.9, "./music/newMission.mp3");
							ASSET_MANAGER.playAsset("./music/newMission.mp3");
						}
						that.startMission();
					}
				}
				if (entity instanceof GoalPost) {	// end mission
					if (that.onMission && entity.isVisible) {
						console.log("complete goal");
						if (ASSET_MANAGER.getAsset("./music/achievement.mp3").paused) {
							ASSET_MANAGER.adjustVolumeOnPath(.5, "./music/achievement.mp3");
							ASSET_MANAGER.playAsset("./music/achievement.mp3");
						}
						that.theScore += that.mission.value;
						that.game.incrementScore();
						entity.isVisible = false;
						that.goal();
					}
				}
			};
			// nextBB collisions
			if (entity !== that && entity.BB && entity.BB.collide(that.nextBB)) {
				// TODO
			}
		});*/
		
		// Enter Vehicle, switch states
		/*
		if (this.game.keyE && this.active && !this.game.blockExit && this.game.car.canEnter) {	// enter car
			this.game.camera.shopArrowFlag = true;
			if (this.game.camera.tutorialFlag1) {
				this.game.camera.displayText = "FOLLOW THE ARROW. GO TO THE SHOP.";
				this.game.shopArrow.isVisible = true;
			}
			this.game.camera.controlText = "W/Up: Accelerate. S/Down: Reverse. A,D/Left,Right: Turn. E: Exit Vehicle. Space: Brakes. Power Slide for a boost.";
			this.x = -1000;	// arbitrary offmap location
			this.y = -1000;
			this.updateBB();
			this.game.blockExit = true;
			this.active = false;
			this.game.car.active = true;
			setTimeout(function () {
				that.game.blockExit = false;
			}, 500)
		}
		
		// Keep in bounds
		if (this.BB.left < 0) {	// Left
			this.currentSpeed = 0;
			this.x = this.WIDTH;
		}
		if (this.BB.top < 0) {	// Top
			this.currentSpeed = 0;
			this.y = this.WIDTH;
		}
		if (this.BB.right > PARAMS.MAP_WIDTH) {	// Right
			this.currentSpeed = 0;
			this.x = PARAMS.MAP_WIDTH - this.WIDTH;
		}
		if (this.BB.bottom > PARAMS.MAP_HEIGHT) {	// Bottom
			this.currentSpeed = 0;
			this.y = PARAMS.MAP_HEIGHT - this.WIDTH;
		}
		*/
		this.updateBB();
	};

	draw(ctx) {
		if (this.dead) {
			this.deadAnim.drawFrame(this.game.clockTick, this.direction, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
			return;
		}
		
		if ((this.game.forward || this.game.backward) && this.active){
			if (this.onMission) {
				this.pizzaRun.drawFrame(this.game.clockTick, this.direction, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
			} else {
				this.running.drawFrame(this.game.clockTick, this.direction, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
			}
			} else if (this.jumpFlag) {
			this.jumping.drawFrame(this.game.clockTick, this.direction, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1.2);
		} else if (this.active) {
			if (this.onMission) {
				this.pizzaStand.drawFrame(this.game.clockTick, this.direction, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
			} else {
				this.standing.drawFrame(this.game.clockTick, this.direction, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
			}
		}
		
		if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
			ctx.strokeStyle = 'Blue';
			ctx.strokeRect(this.nextBB.x - this.game.camera.x, this.nextBB.y - this.game.camera.y, this.nextBB.width, this.nextBB.height);
        }
	};
};
