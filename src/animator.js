class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, angleStart, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, angleStart, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.lastScale = PARAMS.SCALE;

        this.resetCache();
    };

    resetCache() {
        delete this.cache;
        this.cache = [];
		for (var i = 0;i<360;i++){
			this.cache[i] = [];
		}
    }

    drawFrame(tick, angle, ctx, x, y, scale) {
        let w = this.width * scale * PARAMS.SCALE;
        let h = this.height * scale * PARAMS.SCALE;
        if (Math.abs(this.lastScale - PARAMS.SCALE) > 0.1) {
            this.resetCache();
            this.lastScale = PARAMS.SCALE;
        }

		// Animation Tracking
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
		
       // Calculate Angle
	   if (angle < 0 || angle >= 360) return;

       // offsets
       let xOffset = w / 2;
       let yOffset = h / 2;
       function s(input) { return input * PARAMS.SCALE; }
       let drawX = s(x);
       let drawY = s(y);

       // Assume only one direction for this sprite I.E. background tiles
       if (angle == null) {
           ctx.drawImage(this.spritesheet, (drawX - xOffset), (drawY - yOffset), w, h);
           return;
       }

        if (!this.cache[Math.floor(angle)][frame]) {
           let radians = angle / 360 * 2 * Math.PI;
           let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = w;
            offscreenCanvas.height = h;
			
            let offscreenCtx = offscreenCanvas.getContext('2d');

            // Save/Turn/draw/Turn Back/Restore Block
            offscreenCtx.save();
            offscreenCtx.translate(w / 2, h / 2);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-w / 2, -h / 2);
            offscreenCtx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart, this.width, this.height, 0, 0, w, h);
            offscreenCtx.restore();

            // Save into cache
            this.cache[Math.floor(angle)][frame] = offscreenCanvas;
        }
	   
	   // Draw to Field
        ctx.drawImage(this.cache[Math.floor(angle)][frame], (drawX - xOffset), (drawY - yOffset));
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};