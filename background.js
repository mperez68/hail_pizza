// Generic Background Stub.
class Background {
    constructor(game, x, y, direction, scale, width, height, animation) {
        // Parameters
        Object.assign(this, { game, x, y, direction, scale, width, height, animation })
    }

    setup() {
        //
    }

    update() {
        //
    }

    draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, this.direction, ctx,
										this.x - this.width / 2 - this.game.camera.x, this.y - this.height / 2 - this.game.camera.y, 1);
    }
}