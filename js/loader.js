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
	"KEY_SPACE": 32,
	"KEY_R": 82
};
app.keydown = [];

app.IMAGES = {
	coinImage:	"images/coin_sprites.png",
	fuelImage:	"images/fuel_sprites.png",
	doorImage:	"images/Door.png",
	keyImage:	"images/key.png",
	spikesImage:	"images/spikes.png",
};

app.SOUNDS = {
	music:undefined,
	coin:undefined,
}

app.LEVELS = [
	{ // ###### LEVEL 1 ##########
		spawn:{x:0,y:0},
		planets:[
			{
				name:"Plurf",
				position:{x:100,y:100},
				color:"violet",
				size:125,
				info:{ "Population": "You", "Movie Awards":"Worst Cameraman"},
				objects:[
					{type:"coin",angle:120},
					{type:"coin",angle:240},
					{type:"coin",angle:360}
				]
			},
			{
				name:"Goaltonia",
				position:{x:2180,y:400},
				color:"gold",
				size:50,
				info:{ "Silly Names": 16, "Worst Fruit":"Cabbage"},
				objects:[
					{type:"door",angle:180}
				]
			},
			{
				name:"Grun",
				position:{x:1400,y:-550},
				color:"green",
				size:150,
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
				position:{x:1900,y:1900},
				color:"blue",
				size:250,
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
					
					{type:"spikes", angle:15},
					{type:"spikes", angle:36+15},
					{type:"spikes", angle:36*2+15},
					{type:"spikes", angle:36*3+15},
				]
			}
			
		]
	},
	
	{ // ###### LEVEL 2 ##########
		spawn:{x:0,y:0},
		planets:[
			{
				name:"Plurf",
				position:{x:100,y:100},
				color:"violet",
				size:125,
				info:{ "Population": "You", "Movie Awards":"Worst Cameraman"},
				objects:[
					{type:"fuel",angle:120},
					{type:"coin",angle:240},
					{type:"coin",angle:360}
				]
			},
			{
				name:"Goaltonia",
				position:{x:4180,y:1200},
				color:"gold",
				size:200,
				info:{ "Silly Names": 16, "Worst Fruit":"Cabbage"},
				objects:[
					{type:"door",angle:180},
					{type:"spikes", angle:270},
					{type:"spikes", angle:90},
					{type:"spikes", angle:0},
				]
			},
			{
				name:"Grun",
				position:{x:1400,y:-550},
				color:"green",
				size:150,
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
				position:{x:4900,y:-1900},
				color:"blue",
				size:250,
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
					
					{type:"spikes", angle:15},
					{type:"spikes", angle:36+15},
					{type:"spikes", angle:36*2+15},
					{type:"spikes", angle:36*5+15},
					{type:"spikes", angle:36*6+15},
					{type:"spikes", angle:36*7+15},
				]
			}
			
		]
	},{ // ###### LEVEL 3 ##########
		spawn:{x:0,y:0},
		planets:[
			{
				name:"Plurf",
				position:{x:100,y:100},
				color:"violet",
				size:125,
				info:{ "Population": "You", "Movie Awards":"Worst Cameraman"},
				objects:[
					{type:"spikes",angle:100},
					{type:"coin",angle:220},
					{type:"spikes",angle:340}
				]
			},
			{
				name:"Goaltonia",
				position:{x:-5180,y:-5400},
				color:"gold",
				size:50,
				info:{ "Silly Names": 16, "Worst Fruit":"Cabbage"},
				objects:[
					{type:"door",angle:180}
				]
			},
			{
				name:"Grun",
				position:{x:1400,y:-550},
				color:"green",
				size:150,
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
				position:{x:-5900,y:1900},
				color:"blue",
				size:250,
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
					
					{type:"spikes", angle:15},
					{type:"spikes", angle:36+15},
					{type:"spikes", angle:36*2+15},
					{type:"spikes", angle:36*3+15},
					{type:"spikes", angle:36*4+15},
					{type:"spikes", angle:36*5+15},
					{type:"spikes", angle:36*6+15},
					{type:"spikes", angle:36*7+15},
					{type:"spikes", angle:36*8+15},
					{type:"spikes", angle:36*9+15},
				]
			}
			
		]
	},{ // ###### LEVEL 4 ##########
		spawn:{x:0,y:0},
		planets:[
			{
				name:"Plurf",
				position:{x:100,y:100},
				color:"violet",
				size:50,
				info:{ "Population": "You", "Movie Awards":"Worst Cameraman"},
				objects:[
					{type:"coin",angle:120},
					{type:"coin",angle:240},
					{type:"coin",angle:360}
				]
			},
			{
				name:"Goaltonia",
				position:{x:500,y:-500},
				color:"gold",
				size:50,
				info:{ "Silly Names": 16, "Worst Fruit":"Cabbage"},
				objects:[
					{type:"door",angle:180}
				]
			},
			{
				name:"Grun",
				position:{x:-500,y:-500},
				color:"green",
				size:50,
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
				position:{x:500,y:500},
				color:"blue",
				size:50,
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
					
					{type:"spikes", angle:15},
					{type:"spikes", angle:36+15},
					{type:"spikes", angle:36*2+15},
					{type:"spikes", angle:36*3+15},
				]
			}
			
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
	
	app.SOUNDS.music = document.getElementById("music");
	app.SOUNDS.coin = document.getElementById("coinFX");
	
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
		{id:	"spikesImage",		src:	"images/spikes.png"},
	]);
	
	
}

window.addEventListener("keydown", function(e){
	app.keydown[e.keyCode] = true;
	e.preventDefault();
});
window.addEventListener("keyup", function(e){
	app.keydown[e.keyCode] = false;
	
	if(e.keyCode == 83) app.game.toggleSoundtrack(); //s
	if(e.keyCode == 78) app.game.nextLevel(); //s
	e.preventDefault();
});

window.addEventListener('touchstart', function(e){
	e.preventDefault();
	app.keydown[app.KEYBOARD.KEY_SPACE] = true;
}, false);
window.addEventListener('touchend', function(e){
	e.preventDefault();
	app.keydown[app.KEYBOARD.KEY_SPACE] = false;
}, false);7