class Vehicle {
	constructor(game, x, y, direction) {
		Object.assign(this, { game, x, y, direction });
	};
	
	updateBB(){
		this.BB = new BoundingBox(this.x - this.WIDTH / 2, this.y - this.WIDTH / 2, this.WIDTH, this.WIDTH);
	};
	
	update() {
		// TODO
	};
	
	draw(ctx) {
		// 
	};
};