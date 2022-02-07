// // returns a random integer between 0 and n-1
// function randomInt(n) {
//     return Math.floor(Math.random() * n);
// };

// // returns a string that can be used as a rgb web color
// function rgb(r, g, b) {
//     return "rgb(" + r + "," + g + "," + b + ")";
// };

// // returns a string that can be used as a hsl web color
// function hsl(h, s, l) {
//     return "hsl(" + h + "," + s + "%," + l + "%)";
// };

// creates an alias for requestAnimationFrame for backwards compatibility
// window.requestAnimFrame = (function () {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         function (/* function */ callback, /* DOMElement */ element) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();

// Collision Sub-Fuctions
function vehicleToBuilding(vehicle, building) {
	let buffer = 4;
	let angle = 0;
	let top = false, left = false, bottom = false, right = false;
	let vertOffset = Math.abs(vehicle.BB.bottom.y - vehicle.BB.top.y) / 2 + buffer;
	let horiOffset = Math.abs(vehicle.BB.right.x - vehicle.BB.left.x) / 2 + buffer;
	if (building.BB.top < vehicle.BB.bottom.y && building.BB.top > vehicle.y) {
		top = true;
		vehicle.y = building.BB.top - vertOffset;
		if ( vehicle.x < building.x ) vehicle.spinSpeed = -vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
		if ( vehicle.x > building.x ) vehicle.spinSpeed = vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
	};
	if (building.BB.bottom > vehicle.BB.top.y && building.BB.bottom < vehicle.y) {
		bottom = true;
		vehicle.y = building.BB.bottom + vertOffset;
		if ( vehicle.x < building.x ) vehicle.spinSpeed = -vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
		if ( vehicle.x > building.x ) vehicle.spinSpeed = vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
	};
	if (building.BB.left < vehicle.BB.right.x && building.BB.left > vehicle.x) {
		left = true;
		vehicle.x = building.BB.left - horiOffset;
		if ( vehicle.y > building.y ) vehicle.spinSpeed = -vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
		if ( vehicle.y < building.y ) vehicle.spinSpeed = vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
	};
	if (building.BB.right > vehicle.BB.left.x && building.BB.right < vehicle.x) {
		right = true;
		vehicle.x = building.BB.right + horiOffset;
		if ( vehicle.y > building.y ) vehicle.spinSpeed = -vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
		if ( vehicle.y < building.y ) vehicle.spinSpeed = vehicle.MAX_SPIN_SPEED * (vehicle.currentSpeed / vehicle.MAX_SPEED);
	};
	
	// Determine angle based on which ends are colliding
	if (top) {
		angle = 270;
		if (left) {
			angle -= 45;
		} else if (right) {
			angle += 45;
		}
	}
	if (left) {
		angle = 180;
		if (bottom) {
			angle -= 45;
		} else if (top) {
			angle += 45;
		}
	}
	if (bottom) {
		angle = 90;
		if (right) {
			angle -= 45;
		} else if (left) {
			angle += 45;
		}
	}
	if (right) {
		angle = 0;
		if (top) {
			angle = 315;
		} else if (bottom) {
			angle += 45;
		}
	}
	// Push
	if (vehicle.pushed || vehicle.pushSpeed != 0) {
		vehicle.pushed = false;
		vehicle.pushSpeed = 0;
		return;
	}
	vehicle.pushSpeed = Math.max(vehicle.currentSpeed / 2, vehicle.MAX_SPEED / 4);
	vehicle.pushDirection = angle;
	vehicle.pushed = true;
	// Halt movement
	vehicle.currentSpeed = 0;
	vehicle.driftSpeed = 0;
}

function vehicleToVehicle(vehicle, oth) {
	// Calculate center to center angle
		let angle = Math.atan( Math.abs(oth.y - vehicle.y) / Math.abs(oth.x - vehicle.x) ) * (180 / Math.PI);
		let spin = 3;
		if (Math.abs(angle) < 30) spin = 1;
		if (oth.x - vehicle.x >= 0 && oth.y - vehicle.y >= 0) angle = (angle % 90); //Q1
		if (oth.x - vehicle.x <  0 && oth.y - vehicle.y >= 0) {angle = 180 - (angle % 90); //Q2
			spin = -spin;}
		if (oth.x - vehicle.x <  0 && oth.y - vehicle.y <  0) angle = 180 + (angle % 90); //Q3
		if (oth.x - vehicle.x >= 0 && oth.y - vehicle.y <  0) {angle = 360 - (angle % 90); //Q4
			spin = -spin;}
		// Stop drivercar
		vehicle.currentSpeed = 0;
		vehicle.driftSpeed = 0;
		// push car
		oth.pushSpeed = Math.max(vehicle.currentSpeed, 10 * vehicle.DRAG) / 2;
		oth.pushDirection = angle;
		oth.spinSpeed = spin;
}

// global parameters
const PARAMS = {
	DEBUG: true,
	AUDIO: true,
	PAGE_WIDTH: 1024,
	PAGE_HEIGHT: 768,
	TILE_WIDTH: 1280,
	MAP_WIDTH: 6400,
	MAP_HEIGHT: 6400,
	X_AXIS: 0,
	Y_AXIS: 270,
	GRID_WIDTH: 64
};
