// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
		this.ITEM_CAP = 250;

		this.background = [];
		this.terrain = [];
        this.entities = [];
		this.effects = [];
		this.debug = [];
        this.ctx = null;
		
		// Mouse Controls
        this.click = null;
        this.mouse = null;
        //this.wheel = null;
		
		// Keyboard Controls
		this.forward = false;
		this.backward = false;
		this.left = false;
		this.right = false;
		this.space = false;
		this.keyE = false;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
		var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    startInput() {
        var that = this;

		// Mouse Controls
        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return { x: x, y: y };
        }
        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("click", function (e) {
            console.log(getXandY(e));
            that.click = getXandY(e);
        }, false);

        // this.ctx.canvas.addEventListener("wheel", function (e) {
        //     //console.log(getXandY(e));
        //     that.wheel = e;
        //     //       console.log(e.wheelDelta);
        //     e.preventDefault();
        // }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            //console.log(getXandY(e));
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);
		
		// Keyboard Controls
		this.ctx.canvas.addEventListener("keydown", function (e) {
			//console.log("KeyDown");
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					that.forward = true;
					break;
				case "KeyS":
				case "ArrowDown":
					that.backward = true;
					break;
				case "KeyA":
				case "ArrowLeft":
					that.left = true;
					break;
				case "KeyD":
				case "ArrowRight":
					that.right = true;
					break;
				case "Space":
					that.space = true;
					e.preventDefault();
					break;
				case "KeyE":
					that.keyE = true;
					break;
			}
		}, false);
		
		this.ctx.canvas.addEventListener("keyup", function (e) {
			//console.log("KeyUp");
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					that.forward = false;
					break;
				case "KeyS":
				case "ArrowDown":
					that.backward = false;
					break;
				case "KeyA":
				case "ArrowLeft":
					that.left = false;
					break;
				case "KeyD":
				case "ArrowRight":
					that.right = false;
					break;
				case "Space":
					that.space = false;
					e.preventDefault();
					break;
				case "KeyE":
					that.keyE = false;
					break;
			}
		}, false);
		
    };

    addBackground(item) {
		this.background.push(item);
		return true;
    }

    addTerrain(item) {
		if (this.terrain.length <= this.ITEM_CAP) {
        	this.terrain.push(item);
			return true;
		}
		console.log("Terrains at item cap: " + this.ITEM_CAP);
		return false;
    };

    addEntity(item) {
		if (this.entities.length <= this.ITEM_CAP) {
			this.entities.push(item);
			return true;
		}
		console.log("Entities at item cap: " + this.ITEM_CAP);
		return false;
    };

    addEffects(item) {
		if (this.effects.length <= this.ITEM_CAP) {
			this.effects.push(item);
			return true;
		}
		console.log("Effects at item cap: " + this.ITEM_CAP);
		return false;
    };

    addDebug(item) {
		this.debug.push(item);
		return true;
    };

	setup() {
		// Setup items in order by layer
		if (!this.camera.title) {
			this.setupIterator(this.background);
			this.setupIterator(this.terrain);
			this.setupIterator(this.entities);
			this.setupIterator(this.effects);
			this.setupIterator(this.debug);
		}
	}

	setupIterator(items) {
        var count = items.length;
		for (var i = 0; i < count; i++) {

			var item = items[i];
			if (!item.removeFromWorld) {
				item.setup();
			}
		}
	}

    update() {
		// Check HTML elements
		if (document.getElementById("myDebug").checked) {
			PARAMS.DEBUG = true;
		} else {
			PARAMS.DEBUG = false;
		}
		if (document.getElementById("myMusic").checked) {
			PARAMS.MUSIC = true;
		} else {
			PARAMS.MUSIC = false;
		}
		if (document.getElementById("myIn1").value) {
			let n = parseFloat(document.getElementById("myIn1").value);
			if (n && n > 0 && (n != PARAMS.SCALE)) {
				PARAMS.SCALE += (n - PARAMS.SCALE) / PARAMS.ZOOM_STEPS;
				PARAMS.SCALE = roundDecimals(PARAMS.SCALE, 3);
			}
		}
		if (document.getElementById("myIn2").value) {
			let m = parseInt(document.getElementById("myIn2").value);
			if (m && m > 0) PARAMS.ZOOM_STEPS = m;
		}
		if (document.getElementById("myIn3").value) {
			//
		}

		// Update items in order by layer
		if (!this.camera.title) {
			this.updateIterator(this.background);
			this.updateIterator(this.terrain);
			this.updateIterator(this.entities);
			this.updateIterator(this.effects);
			this.updateIterator(this.debug);
		}

		this.camera.update();
    };

	updateIterator(items) {
		// updates
		var count = items.length;
		for (var i = 0; i < count; i++) {
			var item = items[i];

			if (!item.removeFromWorld) {
				item.update();
			}
		}
		// removals
		for (var i = items.length - 1; i >= 0; --i) {
			if (items[i].removeFromWorld) {
				items.splice(i, 1);
			}
		}
	}

    draw() {
		// Draw items in order by layer
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.drawIterator(this.background);
		this.drawIterator(this.terrain);
		this.drawIterator(this.entities);
		this.drawIterator(this.effects);
		this.drawIterator(this.debug);
		this.camera.draw(this.ctx);
    };

	drawIterator(items) {
        for (var i = 0; i < items.length; i++) {
			// Draw flag used to only load sprites within the viewport for performance.
			let drawFlag = true;
			//if (Math.abs(this.player.x - items[i].x) > PARAMS.PAGE_WIDTH) drawFlag = false;
			//if (Math.abs(this.player.y - items[i].y) > PARAMS.PAGE_HEIGHT) drawFlag = false;
			//if (items[i] instanceof Driver) drawFlag = true;				// edge case, player
			if (drawFlag) { items[i].draw(this.ctx); };
        }
	}

    loop() {
        this.clockTick = this.timer.tick();
		this.setup();
        this.update();
        this.draw();
    };
};
