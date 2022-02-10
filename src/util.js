// // returns a string that can be used as a rgb web color
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
};

// // returns a string that can be used as a hsl web color
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
};

// returns a random integer between 0 and n-1
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

// returns angle in radians given degrees
function getRad(deg) {
	return deg * (Math.PI / 180);
}

// returns angle in degrees given radians 
function getDeg(rad) {
	return rad * (180 / Math.PI);
}

// Rounds a number to a given a number of decimal points
function roundDecimals(num, dec) {
	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
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

// ----- ----- ----- global parameters ----- ----- ----- //
const PARAMS = {
	DEBUG: false,
	MUSIC: true,
	MAP_WIDTH: 6400,
	MAP_HEIGHT: 6400,
	GRID_WIDTH: 64,
	GRID_HEIGHT: 64,
	VECTOR_SCALE: 5,
	SCALE: 1
};
