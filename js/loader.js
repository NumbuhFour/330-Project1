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
	coinImage:	"images/coin_sprites.png",
	fuelImage:	"images/fuel_sprites.png",
	doorImage:	"images/Door.png",
	keyImage:	"images/key.png",
};

app.LEVELS = [
	{
		spawn:{x:0,y:0},
		planets:[
			{
				name:"Redius",
				position:{x:180,y:400},
				color:"red",
				size:50,
				info:{ "Silly Names": 16},
				objects:[
					{type:"door",angle:0}
				]
			},
			{
				name:"Grun",
				position:{x:400,y:50},
				color:"green",
				size:100,
				info:{"Gas Provider":"BP"},
				objects:[
					{type:"fuel", angle:0},
					{type:"fuel", angle:90},
					{type:"fuel", angle:180},
					{type:"key", angle:270},
				]
			},
			{
				name:"Bluton",
				position:{x:900,y:900},
				color:"blue",
				size:200,
				info:{"Last Visitor":"Bill Gates"},
				objects:[
					{type:"coin", angle:0},
					{type:"coin", angle:36},
					{type:"coin", angle:36*2},
					{type:"coin", angle:36*3},
					{type:"coin", angle:36*4},
					{type:"coin", angle:36*5},
					{type:"coin", angle:36*6},
					{type:"coin", angle:36*7},
					{type:"coin", angle:36*8},
					{type:"coin", angle:36*9},
				]
			}
			
		],
		enemies:[
			
		]
	},
]

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
		{id:	"coinImage",		src:	"images/coin_sprites.png"},
		{id:	"fuelImage",		src:	"images/fuel_sprites.png"},
		{id:	"doorImage",		src:	"images/Door.png"},
		{id:	"keyImage",		src:	"images/key.png"},
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