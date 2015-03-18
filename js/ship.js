// ship.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.ship = {
	x: 320,
	y: 420,
	width: 34,
	height: 42,
	speed: 250,
	image: undefined,
	color: "yellow",
	drawLib: undefined,
	exhaust: undefined, 
	
	init: function(){
		console.log("app.ship.init() called");
		
		this.exhaust = new app.Emitter();
		this.exhaust.numParticles = 100;
		this.exhaust.red = 255;
		this.exhaust.green = 150;
		
		this.exhaust.createParticles(this.emitterPoint());
	},
	
	draw: function(ctx) {
		this.exhaust.updateAndDraw(ctx, this.emitterPoint());
		
		var halfw = this.width/2;
		var halfh = this.height/2;
		
		if(!this.image){
			this.drawLib.rect(ctx,this.x-halfw, this.y-halfh, this.width, this.height, this.color);
		}else{
			this.drawLib.drawShip(ctx,this.image, this.x,this.y, this.width, this.height);
		}
	},
	
	moveLeft: function(dt){
		this.x -= this.speed*dt;
	},
	moveRight: function(dt){
		this.x += this.speed*dt;
	},
	
	moveUp: function(dt){
		this.y -= this.speed*dt;
	},
	moveDown: function(dt){
		this.y += this.speed*dt;
	},
	
	emitterPoint: function(){
		return {
			x: this.x,
			y: this.y + this.height/2 + 2
		};
	},
}; // end app.ship