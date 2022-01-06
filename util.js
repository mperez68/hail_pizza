// returns a random integer between 0 and n-1
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

// returns a string that can be used as a rgb web color
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
};

// returns a string that can be used as a hsl web color
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
};

// returns angle in radians given degrees
function getRad(deg) {
	return deg * (Math.PI / 180);
}

// returns angle in degrees given radians 
function getDeg(rad) {
	return deg * (180 / Math.PI);
}

function roundDecimals(num, dec) {
	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// returns distance between two points
function getDistance(pt1, pt2) {
	return Math.sqrt( Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2) );
}

// returns angle between two points
function getAngle(pt1, pt2) {
	let a = Math.atan( (pt2.y - pt1.y) / (pt2.x - pt1.x) ) * 180 / Math.PI;
	// Normalize for 360 deg calculation
	if (pt2.x < pt1.x) a += 180;
	if (a < 0) a += 360;
	return a;
}

// creates an alias for requestAnimationFrame for backwards compatibility
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// ----- ----- ----- Collision helper fuctions ----- ----- ----- //

// Vehicle colliding with a building, fence, etc.
function vehicleToTerrain(vehicle, building) {
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

// Vehicle colliding with a pedestrian; NOTE: this occurs when a moving vehicle strikes a pedestrian at sufficient speed to do damage.
function vehicleToPedestrian(vehicle, oth) {
	// TODO
}

// Vehicle colliding with another vehicle
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

// Pedestrian colliding with a building, fence, etc.
function pedestrianToTerrain (pedestrian, oth) {
	// TODO
}

// Pedestrian colliding with another pedestrian
function pedestrianToPedestrian (pedestrian, oth) {
	// TODO
}

// Pedestrian colliding with a vehicle; NOTE: this occurs when a pedestrian approaches a stationary or slow moving vehicle and does not result in damage.
function pedestrianToVehicle (pedestrian, oth) {
	// TODO
}

// ----- ----- ----- global parameters ----- ----- ----- //
const PARAMS = {
	DEBUG: false,
	MUSIC: true,
	MAP_WIDTH: 6400,
	MAP_HEIGHT: 6400,
	GRID_WIDTH: 64,
	GRID_HEIGHT: 64,
	SCALE: 1
};
