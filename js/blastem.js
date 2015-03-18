// blastem.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.blastem = {
	// CONSTANT properties
    WIDTH : 640, 
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
    ship: undefined,
	drawLib: undefined,
	utils: undefined,
	score : 0,
	
	playerBullets : [],
	cooldown : 0,
	FIRE_RATE : 20,
	
	enemies: [],
	ENEMY_PROBABILITY_PER_SECOND: 1.0,
	enemyImage: undefined,
	
	dt: 1/60.0,
	app: undefined,
	
	pulsar: undefined,
	
	explosions : [ ],
	explosionImage : undefined,
	explosionImage2 : undefined,
	explosionImage3 : undefined,
	
	soundtrack: undefined,
	soundtrackPaused: false,
    
    // methods
	init : function(ship) {
			console.log("app.blastem.init() called");
			// declare properties
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			
			// set up player ship
			this.ship = ship;
			
			var image = new Image();
			image.src = this.app.IMAGES["shipImage"];
			this.ship.image = image;
			
			this.enemyImage = new Image();
			this.enemyImage.src = this.app.IMAGES['enemyImage'];
			
			this.ship.init();
			
			this.pulsar = new this.app.Emitter();
			this.pulsar.red = 255;
			this.pulsar.minXspeed = this.pulsar.minYspeed = -0.25;
			this.pulsar.maxXspeed = this.pulsar.maxYspeed = 0.25;
			this.pulsar.lifetime = 500;
			this.pulsar.expansionRate = 0.05;
			this.pulsar.numParticles = 100;
			this.pulsar.xRange = 1;
			this.pulsar.yRange = 1;
			this.pulsar.useCircles = false;
			this.pulsar.useSquares = true;
			this.pulsar.createParticles({x:100, y:100});
			
			var image = new Image();
			image.src = this.app.IMAGES['explosionImage'];
			this.explosionImage = image;
			image = new Image(); image.src = this.app.IMAGES['explosionImage2'];
			this.explosionImage2 = image;
			image = new Image(); image.src = this.app.IMAGES['explosionImage3'];
			this.explosionImage3 = image;
			
			this.soundtrack = createjs.Sound.play("soundtrack", {loop:-1, volume:0.4});
			
			this.update();
	},
    
	moveSprites : function(){
		
		//Update player
		if(this.app.keydown[this.app.KEYBOARD.KEY_LEFT]){
			//this.app.seed = Math.random()*800; //Annoy grader
			this.ship.moveLeft(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]){
			//this.app.seed = Math.random()*800; //Annoy grader
			this.ship.moveRight(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_UP]){
			//this.app.seed = Math.random()*800; //Annoy grader
			this.ship.moveUp(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_DOWN]){
			//this.app.seed = Math.random()*800; //Annoy grader
			this.ship.moveDown(this.dt);
		}
		
		var paddingX = this.ship.width/2;
		var paddingY = this.ship.height/2;
		this.ship.x = this.utils.clamp(this.ship.x, paddingX, this.WIDTH - paddingX);
		this.ship.y = this.utils.clamp(this.ship.y, paddingY, this.HEIGHT- paddingY);
		
			//Shooting
		this.cooldown --;
		if(this.cooldown <= 0 && this.app.keydown[app.KEYBOARD.KEY_SPACE]){
			this.shoot(this.ship.x, this.ship.y);
			this.cooldown = 60/this.FIRE_RATE; //60fps assumption
		}
		
		//Update bullets
		for(var i = 0; i < this.playerBullets.length; i++){
			this.playerBullets[i].update(this.dt);
		}
		this.playerBullets = this.playerBullets.filter(function(bullet) { 
			return bullet.active; //Filter out inactive bullets
		});
		
		//Update enemies
		for(var i=0; i < this.enemies.length; i++){
			this.enemies[i].update(this.dt);
		}
		this.enemies = this.enemies.filter(function(enemy){
			return enemy.active; //Remove inactive enemies
		});
		
			//Adding enemies
		if(Math.random() < this.ENEMY_PROBABILITY_PER_SECOND/60){
			this.enemies.push(new app.Enemy(this.enemyImage, this.WIDTH, this.HEIGHT));
			
			console.log("New enemy created. Enemy count: " + this.enemies.length);
		}
		
		this.explosions.forEach(function(exp){
			exp.update(this.dt);
		},this);
		
		this.explosion = this.explosions.filter(function(exp){
			return exp.active;
		})
	},
	
	checkForCollisions : function(){
		
		var self = this;
		this.playerBullets.forEach(
			function(bullet){
				self.enemies.forEach(function(enemy){
					if(self.collides(bullet,enemy)){
						enemy.active = false;
						//enemy.explode();
						self.createExplosion(enemy.x, enemy.y, -enemy.xVelocity/4, -enemy.yVelocity/4);
						bullet.active = false;
						self.score ++;
					}
				});
			}
		);
		
		this.enemies.forEach(
			function(enemy){
				if(enemy.active && self.collides(enemy,self.ship)){
					//enemy.explode();
					//self.ship.explode();
					enemy.active = false;
					self.score -= 5;
				}
			}
		);
	},
	
	drawSprites : function(){
		
		this.pulsar.updateAndDraw(this.ctx, {x:100, y:100});
		
		for(var i = 0; i < this.playerBullets.length; i++){
			this.playerBullets[i].draw(this.ctx);
		}
		
		this.enemies.forEach(
			function(e){
				e.draw(this.ctx);
			}, this //Pass what 'this' should reference to
		);
		
		this.ship.draw(this.ctx);
		
		this.explosions.forEach(function(exp){
			exp.draw(this.ctx);
		},this);
		
		this.drawLib.text(this.ctx, "Score : " + this.score, 15, 25, 20, "white");
	},
	
    update : function(){
		
		this.moveSprites();
		
		this.checkForCollisions();
		
		this.drawLib.clear(this.ctx, 0,0,this.WIDTH, this.HEIGHT);
		this.drawLib.backgroundGradient(this.ctx, this.WIDTH, this.HEIGHT);
		
		this.drawSprites();
		
		requestAnimationFrame( this.update.bind(this) );
	},
	
	shoot : function(x,y){
		console.log("Bang!");
		createjs.Sound.play("bullet");
		this.playerBullets.push(new app.Bullet(x,y,200));
	},
	
	collides: function (a, b) {
		// a = sprite1
		// b = sprite2
		// bounding box collision detection
		// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		// we have to adjust our bounding boxes because
		// we're drawing sprites from their center x,y
		var ax = a.x - a.width/2;
		var ay = a.y - a.height/2;
		var bx = b.x - b.width/2;
		var by = b.y - b.height/2;
		
		return  ax < bx + b.width &&
				ax + a.width > bx &&
			   ay < by + b.height &&
				ay + a.height > by;
	},
	
	
	createExplosion: function(x,y,xVel,yVel){
		//var exp = new app.ExplosionSprite(this.explosionImage, 84, 84, 84, 84, 1/7);
		var exp = new app.ExplosionSprite(this.explosionImage2, 128,128,64,64,1/16);
		exp.x = x;
		exp.y = y;
		exp.xVelocity = xVel;
		exp.yVelocity = yVel;
		this.explosions.push(exp);
		
		createjs.Sound.play("explosion");
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