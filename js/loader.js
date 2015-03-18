/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.KEYBOARD = {
	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};
app.keydown = [];

app.IMAGES = {
	shipImage:	"images/Hunter1.png",
	enemyImage:	"images/Drone1.png",
	explosionImage: "images/explosion.png",
	explosionImage2: "images/explosion2.png",
	explosionImage3: "images/explosion3.png",
};

//http://indiegamr.com/generate-repeatable-random-numbers-in-js/
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;
 
	Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
 
    return min + rnd * (max - min);
}
app.seed = Math.random()*800;

window.onload = function(){
	console.log("window.onload called");
	
	app.game.app = app;
	app.game.utils = app.utils;
	app.player.utils = app.utils;
	app.player.drawLib = app.drawLib;
	
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	
	app.queue.on("complete", function(){
		console.log("images loaded called");
		app.game.init(app.player, app.drawLib);
	});
	
	app.queue.loadManifest([
		{id:	"soundtrack",		src:	"sounds/soundtrack.mp3"},
	]);
	
	
}

window.addEventListener("keydown", function(e){
	app.keydown[e.keyCode] = true;
	e.preventDefault();
});
window.addEventListener("keyup", function(e){
	app.keydown[e.keyCode] = false;
	
	if(e.keyCode == 83) app.game.toggleSoundtrack(); //s
	e.preventDefault();
});

window.addEventListener('touchstart', function(e){
	e.preventDefault();
	app.keydown[app.KEYBOARD.KEY_SPACE] = true;
}, false);
window.addEventListener('touchend', function(e){
	e.preventDefault();
	app.keydown[app.KEYBOARD.KEY_SPACE] = false;
}, false);