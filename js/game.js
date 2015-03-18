// blastem.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.game = {
	// CONSTANT properties
    WIDTH : 640, 
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
	drawLib: undefined,
	utils: undefined,
	
	player: undefined,
	score : 0,
	
	dt: 1/60.0,
	app: undefined,
	
	soundtrack: undefined,
	soundtrackPaused: false,
	camx:0,
	camy:0,
	camr:0,
	
	planets: [],
    
    // methods
	init : function(player, drawLib) {
		this.player = player;
		this.drawLib = drawLib;
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.soundtrack = createjs.Sound.play("soundtrack", {loop:-1, volume:0.4});
		this.pauseSoundtrack();
		
		this.camx = player.x;
		this.camy = player.y;
		this.camr = player.angle;
		
		this.update();
		
		//Make planets
		this.createPlanet(180,400,50, "red");
		this.createPlanet(400,50,100, "green");
		this.createPlanet(900,900,200,"blue");
	},
    
	moveSprites : function(){
		this.player.update(this.dt);
		
		//Update player
		if(this.app.keydown[this.app.KEYBOARD.KEY_LEFT]){
			this.player.moveLeft(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]){
			this.player.moveRight(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_UP]){
			this.player.moveUp(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_DOWN]){
			this.player.moveDown(this.dt);
		}
		
		if(this.app.keydown[this.app.KEYBOARD.KEY_SPACE]){
			this.player.slowDown(this.dt);
		}
		
		this.planets.forEach(function(planet){
			planet.update(this.dt);
			if(this.collides(planet,this.player)){
				this.player.setPlanet(planet);
			}
		},this);
	},
	
	checkForCollisions : function(){
		
	},
	
	drawSprites : function(){
		this.ctx.save();
		
		this.camx = (this.camx + this.player.x) / 2;
		this.camy = (this.camy + this.player.y) / 2;
		
		this.camr %= (Math.PI*2);
		var pangle = this.player.angle%(Math.PI*2);
		if(pangle - this.camr > Math.PI){
			this.camr += Math.PI*2;
		}else if(this.camr - pangle > Math.PI){
			this.camr -= Math.PI*2;
		}
		this.camr = (pangle+this.camr)/2;
		this.camr %= (Math.PI*2);
		
		//Camera
		this.ctx.translate(this.WIDTH/2, this.HEIGHT/2);
		this.ctx.rotate(-this.camr);
		this.ctx.translate(-this.camx, -this.camy);
		
		this.planets.forEach(function(planet){
			planet.draw(this.ctx);
			this.player.drawPlanetIndicator(this.ctx,planet);
		},this);
		
		this.planets.forEach(function(planet){
			if(this.utils.distanceBetween(planet,this.player) < 5000)
				this.player.drawPlanetIndicator(this.ctx,planet);
		},this);
		
		this.player.draw(this.ctx);
		
		this.ctx.restore();
	},
	
    update : function(){
		
		this.moveSprites();
		
		this.checkForCollisions();
		
		this.drawLib.clear(this.ctx, 0,0,this.WIDTH, this.HEIGHT);
		//this.drawLib.backgroundGradient(this.ctx, this.WIDTH, this.HEIGHT);
		
		this.drawSprites();
		
		requestAnimationFrame( this.update.bind(this) );
	},
	
	collides: function (a, b) {
		// a = sprite1
		// b = sprite2
		// bounding box collision detection
		// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		// we have to adjust our bounding boxes because
		// we're drawing sprites from their center x,y
		
		/*
		var ax = a.x - a.width/2;
		var ay = a.y - a.height/2;
		var bx = b.x - b.width/2;
		var by = b.y - b.height/2;
		
		return  ax < bx + b.width &&
				ax + a.width > bx &&
			   ay < by + b.height &&
				ay + a.height > by;*/
				
		var dx = a.x - b.x;
		var dy = a.y - b.y;
		var dist = dx*dx + dy*dy;
		var combinedRadius = a.radius + b.radius;
		
		return dist < combinedRadius*combinedRadius;
	},
	
	isOnScreen: function(x,y,width,height){
		var ax = this.player.x - this.WIDTH/2;
		var ay = this.player.y - this.HEIGHT/2;
		var bx = x - width/2;
		var by = y - height/2;
		
		return  ax < bx + b.width &&
				ax + a.width > bx &&
			   ay < by + b.height &&
				ay + a.height > by;
	},
	
	createRandomPlanet: function(){
		var planet = new app.Planet(180,400,50, "red", this.drawLib);
		this.planets.push(planet);
	},
	
	createPlanet: function(x,y,rad,color){
		var planet = new app.Planet(x,y,rad, color, this.drawLib);
		this.planets.push(planet);
	},
	
	resumeSoundtrack: function(){
		this.soundtrack.resume();
	},
	
	pauseSoundtrack: function(){
		this.soundtrack.pause();
	},
	
	toggleSoundtrack: function(){
		this.soundtrackPaused = !this.soundtrackPaused;
		if(this.soundtrackPaused)
			this.pauseSoundtrack();
		else
			this.resumeSoundtrack();
	},

}; // end app.blastem