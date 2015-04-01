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
	
	dt: 1/60.0,
	app: undefined,
	
	soundtrack: undefined,
	soundtrackPaused: false,
	camx:0,
	camy:0,
	camr:0,
	
	fuelBlink: 0,
	level: 0,
	
	planets: [],
	keysLeft: 0,
	
	dead: false,
	victory: false,
	lastScore: 0,
    
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
		this.coinImage = new Image();
		this.coinImage.src = this.app.IMAGES["coinImage"];
		this.fuelImage = new Image();
		this.fuelImage.src = this.app.IMAGES["fuelImage"];
		this.doorImage = new Image();
		this.doorImage.src = this.app.IMAGES["doorImage"];
		this.keyImage = new Image();
		this.keyImage.src = this.app.IMAGES["keyImage"];
		this.spikesImage = new Image();
		this.spikesImage.src = this.app.IMAGES["spikesImage"];
		this.loadLevel(0);
	},
	
	loadLevel:function(level){
		this.player.score = this.lastScore;
		this.dead = false;
		this.victory = false;
		this.player.reset();
		this.planets = [];
		this.keysLeft = 0;
		var data = app.LEVELS[level];
		this.player.x = data.spawn.x
		this.player.y = data.spawn.y;
		
		for(var i=0; i < data.planets.length; i++){
			var p = data.planets[i];
			var name = p.name;
			var x = p.position.x;
			var y = p.position.y;
			var col = p.color;
			var size = p.size;
			var info = p.info;
			var objects = p.objects;
			
			var planet = this.createPlanet(name,x,y,size,col);
			planet.extraInfo = info;
			this.loadPlanetObjects(planet,objects);
		}
	},
	
	loadPlanetObjects:function(planet, objects){
		for(var i in objects){
			var o = objects[i];
			var item = undefined;
			switch(o.type){
				case "fuel":
					item = new app.Fuel(this.drawLib, this.fuelImage);
					break;
				case "coin":
					item = new app.Coin(this.drawLib, this.coinImage);
					break;
				case "door":
					item = new app.Door(this, this.drawLib, this.doorImage);
					break;
				case "key":
					item = new app.Key(this, this.drawLib, this.keyImage);
					this.keysLeft ++;
					break;
				case "spikes":
					item = new app.Spikes(this, this.drawLib, this.spikesImage);
					break;
			}
			if(item != undefined){
				var off = 0;
				var angle = o.angle;
				if(o.surfaceOffset) off = o.surfaceOffset;
				planet.addPlanetObject(this.app.utils, item, angle*(Math.PI/180), off);
			}else{
				console.error("Unable to add item to planet: " + o);
			}
			
		}
	},
	
	keyObtained: function(){
		this.keysLeft --;
	},
	
	nextLevel: function(){
		this.lastScore = this.player.score;
		this.level++;
		if(this.level >= this.app.LEVELS.length){
			this.victory = true;
		}else{
			this.loadLevel(this.level);
		}
	},
	
	gameOver: function(){
		this.dead = true;
	},
	
/*
{
name:"Grun",
position:{x:400,y:50},
color:"green",
size:100,
info:{"Gas Provider":"BP"},
objects:[
	{type:"fuel", angle:0},
	{type:"fuel", angle:120},
	{type:"fuel", angle:240},
]
},*/
    
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
			planet.update(this.dt, this.player);
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
		
		//fuel bar
		var fuelPerc = this.player.fuel/this.player.maxFuel;
		if(fuelPerc <= 0.30){
			this.fuelBlink += 3*this.dt
		}else{
			this.fuelBlink = 0;
		}
		
		this.ctx.fillStyle = "black";
		this.strokeStyle = "black";
		this.ctx.lineWidth = 5;
		if(fuelPerc <= 0.30 && this.fuelBlink % 4 < 2) this.ctx.fillStyle = "red";
		
		this.ctx.fillRect(5,5,this.WIDTH-10, 20);
		this.ctx.fillStyle = "gray";
		this.ctx.fillRect(10,10,(this.WIDTH-20), 10);
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(10,10,(this.WIDTH-20)*fuelPerc, 10);
		this.drawLib.text(this.ctx, "Fuel", this.WIDTH/2, 20, 15, "white");
		
		//data
		this.ctx.save();
		this.ctx.globalAlpha = 0.55;
		this.strokeStyle = "black";
		this.ctx.lineWidth = 2;
		this.ctx.fillStyle = "cyan";
		var textX = 8;
		var textY = 43;
		var tspc = 15; // Text spacing;
		var ti = 0; //Text iter
		
		var numData = 3;
		var width = 9;
		var maxChar = 13;
		
		var pplan = this.player.planet;
		if(pplan){
			numData += 2;
			
			if(("Planet: " + pplan.name).length + 1 > maxChar) maxChar = ("Planet: " + pplan.name).length + 1;
			
			for(var key in pplan.extraInfo){
				numData ++;
				var str = key + ": " + pplan.extraInfo[key];
				if(str.length + 1 > maxChar) maxChar = str.length + 1;
			}
		}
		
		var height = tspc*numData;
		this.ctx.fillRect(5,30, maxChar*width, height+5);
		this.ctx.strokeRect(5,30, maxChar*width, height+5);
		
		var textColor = "rgb(0,0,120)";
		this.drawLib.text(this.ctx, "Score: " + this.player.score, textX, textY + tspc*(ti++), 15, textColor);
		this.drawLib.text(this.ctx, "Speed: " + this.player.getSpeed().toPrecision(3), textX, textY + tspc*(ti++), 15, textColor);
		this.drawLib.text(this.ctx, "Orien: " + this.player.angle.toPrecision(3), textX, textY + tspc*(ti++), 15, textColor);
		
		if(pplan){
			this.drawLib.text(this.ctx, "Planet: " + pplan.name, textX, textY + tspc*(ti++), 15, pplan.color);
			this.drawLib.text(this.ctx, "Size: " + (pplan.radius*2*Math.PI).toPrecision(4), textX, textY + tspc*(ti++), 15, textColor);
			
			for(var key in pplan.extraInfo){
				this.drawLib.text(this.ctx, key + ": " + pplan.extraInfo[key], textX, textY + tspc*(ti++), 15, textColor);
			}
			
		}
		
		this.ctx.restore();
	},
	
    update : function(){
		
		if(this.app.keydown[this.app.KEYBOARD.KEY_R]){
			this.loadLevel(this.level);
		}
		
		if(this.dead){
			this.lastScore = 0;
			this.level = 0;
			this.drawLib.clear(this.ctx, 0,0,this.WIDTH, this.HEIGHT);
			requestAnimationFrame( this.update.bind(this) );
			
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.drawLib.text(this.ctx,"Game Over", this.WIDTH/2,this.HEIGHT/2,40,"red");
			this.drawLib.text(this.ctx,"r to restart", this.WIDTH/2,this.HEIGHT/2+20,16,"red");
			this.ctx.restore();
			return;
		}else if(this.victory){
			this.lastScore = 0;
			this.level = 0;
			this.drawLib.clear(this.ctx, 0,0,this.WIDTH, this.HEIGHT);
			requestAnimationFrame( this.update.bind(this) );
			
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.drawLib.text(this.ctx,"Victory!", this.WIDTH/2,this.HEIGHT/2,40,"green");
			this.drawLib.text(this.ctx,"r to restart", this.WIDTH/2,this.HEIGHT/2+20,16,"green");
			this.ctx.restore();
			return;
		}
		
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
	
	createRandomPlanet: function(name){
		var planet = new app.Planet(name, 180,400,50, "red", this.drawLib);
		this.planets.push(planet);
		return planet;
	},
	
	createPlanet: function(name, x,y,rad,color){
		var planet = new app.Planet(name, x,y,rad, color, this.drawLib);
		this.planets.push(planet);
		return planet;
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