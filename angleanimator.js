class AngleAnimator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, angleStart, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, angleStart, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

        this.cache = [];
		for (var i = 0;i<360;i++){
			this.cache[i] = [];
		}

    };

    drawFrame(tick, angle, ctx, x, y, scale) {

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
	   if (angle < 0 || angle > 359) return;

        if (!this.cache[Math.floor(angle)][frame]) {
           let radians = angle / 360 * 2 * Math.PI;
           let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = this.width;
            offscreenCanvas.height = this.height;
			
            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(this.width / 2, this.height / 2);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-this.width / 2, -this.height / 2);
            offscreenCtx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
            this.width, this.height,
            0, 0,
            this.width * scale,
            this.height * scale);
            offscreenCtx.restore();
            this.cache[Math.floor(angle)][frame] = offscreenCanvas;
        }
        var xOffset = this.width / 2;
        var yOffset = this.height / 2;
	   
	   // Draw to Field
        ctx.drawImage(this.cache[Math.floor(angle)][frame], x - xOffset, y - yOffset);
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};