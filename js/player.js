// ship.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.player = {
	x: 320,
	y: 420,
	width: 34,
	height: 42,
	radius: 20,
	
	flySpeed: 20, //Flying in space speed
	spinSpeed: Math.PI, //Spinning in space speed
	walkSpeed: 100, //Walking on land speed
	thrust: 30,// Thrust off planet speed
	tangentSpeed: 10,
	orientSpeed: Math.PI*1.8, //Speed of auto-orientation with planet
	
	walkSpeedAngle: -1,
	xVel:0,
	yVel:0,
	rVel:0, //Rotational velocity
	
	onGround: false,
	angle:0,
	image: undefined,
	color: "green",
	drawLib: undefined,
	utils:undefined,
	
	planet: undefined,
	angleWithPlanet: 0,
	
	maxFuel: 1000,
	fuel: 1000,
	score: 0,
	
	init: function(){
		this.grad=ctx.cr
	},
	
	reset: function(){
		this.fuel = this.maxFuel;
		this.xVel = this.yVel = this.rVel = 0;
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.setPlanet(undefined);
		this.onGround = false;
	},
	
	draw: function(ctx) {
		var halfw = this.width/2;
		var halfh = this.height/2;
		
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.angle);
		
		if(!this.image){
			if(!this.grad){
				this.grad = ctx.createLinearGradient(0,0,0,this.height);
				this.grad.addColorStop(0, this.color);
				this.grad.addColorStop(1, "black");
			}
			ctx.fillStyle = this.grad;
			ctx.fillRect(-halfw, -halfh, this.width, this.height);
		}else{
			
		}
		
		
		ctx.restore();
		//this.drawDebug(ctx);
	},
	
	update: function(dt){
		this.x += this.xVel;
		this.y += this.yVel;
		this.angle += this.rVel;

		if(this.planet){
							
				
			
			//Fall towards planet if not on ground
			if(!this.onGround && this.getDistanceToPlanet()-this.radius > this.planet.innerRadius){
				this.angleWithPlanet = 
					this.utils.getAngleBetween( [this.x - this.planet.x, this.y - this.planet.y],[0, 1]) % (Math.PI*2);
				//this.moveVerticalOnPlanet(this.getDistanceToPlanet()-this.getGravity()*dt);
				this.moveTowardPlanet(this.getGravity()*dt);
			}else { 
				//Set on surface
				if(!this.onGround){
					this.angleWithPlanet = 
						this.utils.getAngleBetween( [this.x - this.planet.x, this.y - this.planet.y],[0, 1]) % (Math.PI*2);
					this.moveVerticalOnPlanet(this.planet.innerRadius + this.radius);
				}
				this.onGround = true;
			this.xVel *= 0.97; //Dampening
			this.yVel *= 0.97;	
			}
			
			if(this.getDistanceToPlanet()-this.radius > this.planet.radius){
				this.setPlanet(undefined);
			}
			
			//Orient with planet
			var desiredAngle = this.angleWithPlanet + Math.PI/2;
			if(this.angle != desiredAngle){
				var diff = (desiredAngle%(Math.PI*2)) - (this.angle%(Math.PI*2));
				diff %= Math.PI*2;
				this.angle += this.orientSpeed*dt * (diff > Math.PI || (diff < 0 && diff > -Math.PI) ? -1:1);
				if(Math.abs(diff) < this.orientSpeed*dt){
					this.angle = desiredAngle;
				}
			}
		}
		//else{
		//}
	},
	
	drawPlanetIndicator: function(ctx, planet){
		if(planet == this.planet) return;
		
		var vec = [planet.x - this.x, planet.y-this.y];
		var dist = Math.round(Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]) - planet.radius - this.radius);
		if(dist > 1000) dist = (dist/1000).toFixed(2) + "k"
		vec = this.utils.normalizeVector(vec);
		var ang = this.utils.getAngleBetween( [this.x - planet.x, this.y - planet.y], [1, 0]) - Math.PI/2;
		
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.translate(this.x,this.y);
		ctx.translate(vec.x * this.radius*2, vec.y * this.radius*2);
		
		ctx.save();
		ctx.rotate(ang);
		ctx.textAlign = "center";
		this.drawLib.text(ctx,dist + "m",0,0,12,planet.color);
		ctx.restore();
		
		ctx.translate(vec.x * 25, vec.y * 25);
		ctx.rotate(ang);
		
		ctx.strokeStyle = planet.color;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(-10,10);
		ctx.lineTo(0,0);
		ctx.lineTo(10,10);
		ctx.stroke();
		
		ctx.restore();
	},
	
	moveLeft: function(dt){
		if(this.planet && this.onGround){
			if(this.walkSpeedAngle == -1){
				this.walkSpeedAngle = this.walkSpeed/this.planet.innerRadius;
			}
			this.angleWithPlanet -= this.walkSpeedAngle*dt;
			this.angleWithPlanet %= Math.PI*2;
			this.updateLocationWithPlanet();
			//this.moveTangetToPlanet(-this.walkSpeed*dt);
			//this.onGround = false;
		}else if(this.planet){
			if(this.fuel > 0) this.moveTangetToPlanet(-this.tangentSpeed*dt);
		}else{
			this.angle -= this.spinSpeed*dt;
		}
	},
	moveRight: function(dt){
		if(this.planet && this.onGround){
			if(this.walkSpeedAngle == -1){
				this.walkSpeedAngle = this.walkSpeed/this.planet.innerRadius;
			}
			this.angleWithPlanet += this.walkSpeedAngle*dt;
			this.angleWithPlanet %= Math.PI*2;
			this.updateLocationWithPlanet();
			//this.moveTangetToPlanet(this.walkSpeed*dt);
			//this.onGround = false;
		}else if(this.planet){
			if(this.fuel > 0) this.moveTangetToPlanet(this.tangentSpeed*dt);
		}else{
			this.angle += this.spinSpeed*dt;
		}
	},
	
	moveUp: function(dt){
		if(this.fuel <= 0) return;
		if(!this.planet){
			this.xVel -=  Math.cos(this.angle+Math.PI/2) * this.flySpeed*dt;
			this.yVel -=  Math.sin(this.angle+Math.PI/2) * this.flySpeed*dt;
			
			this.fuel -= this.flySpeed*dt;
		}else {
			this.xVel -=  Math.cos(this.angle+Math.PI/2) * this.thrust*dt;
			this.yVel -=  Math.sin(this.angle+Math.PI/2) * this.thrust*dt;
			this.fuel -= this.thrust*dt;
			this.onGround = false;
		}
	},
	moveDown: function(dt){
		if(this.fuel <= 0) return;
		if(!this.planet){
			this.xVel +=  Math.cos(this.angle+Math.PI/2) * this.flySpeed*dt;
			this.yVel +=  Math.sin(this.angle+Math.PI/2) * this.flySpeed*dt;
		
			this.fuel -= this.flySpeed*dt;
		}else {
			this.xVel +=  Math.cos(this.angle+Math.PI/2) * this.thrust*dt;
			this.yVel +=  Math.sin(this.angle+Math.PI/2) * this.thrust*dt;
			this.fuel -= this.thrust*dt;
			this.onGround = false;
		}
	},
	
	slowDown: function(dt){
		var damp = 0.95;
		var fuelVec = {x:this.xVel*(1-damp),y:this.yVel*(1-damp)};
		var fuelUsed = Math.sqrt(fuelVec.x*fuelVec.x + fuelVec.y*fuelVec.y);
		this.fuel -= fuelUsed;
		this.yVel *= damp;
		this.xVel *= damp;
	},
	
	updateLocationWithPlanet: function(){
		var newPos = this.utils.rotateVector( [this.getDistanceToPlanet(), 0], this.angleWithPlanet);
		
		this.x = newPos.x + this.planet.x;
		this.y = newPos.y + this.planet.y;
	},
	
	moveVerticalOnPlanet: function(pos){
		
		var newPos = this.utils.rotateVector( [pos, 0], this.angleWithPlanet);
		
		this.x = newPos.x + this.planet.x;
		this.y = newPos.y + this.planet.y;
		var lastDist = this.getDistanceToPlanet();
		var diff = (pos - lastDist);
		
		this.xVel =  Math.cos(this.angle+Math.PI/2) * diff;
		this.yVel =  Math.sin(this.angle+Math.PI/2) * diff;
	},
	
	moveTowardPlanet: function(speed){
		var xv = this.planet.x - this.x;
		var yv = this.planet.y - this.y;
		var vec = this.utils.normalizeVector([xv,yv]);
		
		xv = vec.x;
		yv = vec.y;
		
		xv *= speed;
		yv *= speed;
		
		this.xVel += xv;
		this.yVel += yv;
	},
	
	moveTangetToPlanet: function(speed){
		var myRightVec = this.getRightVector(speed);
		this.xVel += myRightVec.x;
		this.yVel += myRightVec.y;
		
		this.fuel -= Math.abs(speed);
	},
	
	getGravity: function(){
		//Max gravity on surface, 10% gravity at farthest edge
		var dist = this.getDistanceToPlanet();
		var perc = 1- (dist-this.planet.innerRadius)/(this.planet.radius-this.planet.innerRadius);
		perc = Math.max(perc, 0.1); //Minimum 10%
		return this.planet.gravity * perc;
	},
	
	getDistanceToPlanet: function(){
		var dx = this.planet.x - this.x;
		var dy = this.planet.y - this.y;
		return Math.sqrt(dx*dx+dy*dy);
	},
	
	setPlanet: function(planet){
		if(planet != this.planet){
			this.planet = planet;
			this.walkSpeedAngle = -1;
			if(planet){
				this.thrust = Math.max(planet.gravity -4, 30);
				//Get angle between our position and the planet's right vector (radians=0)
				this.angleWithPlanet = 
					this.utils.getAngleBetween( 	[this.x - planet.x, this.y - planet.y],
												[0, 10]);
												
				this.updateLocationWithPlanet();
			}
		}
	},
	
	getUpVector: function(scale){
		return this.utils.rotateVector([0,-scale], this.angle);
	},
	
	getRightVector: function(scale){
		return this.utils.rotateVector([scale,0], this.angle);
	},
	
	getSpeed: function(){
		var speed = Math.sqrt(this.xVel*this.xVel + this.yVel * this.yVel);
		if(Math.abs(speed) < 0.01) speed = 0;
		return speed;
	},
	
	drawDebug: function(ctx){
		var right = this.getRightVector(40);
		var up = this.getUpVector(40);
		
		right.x += this.x;
		right.y += this.y;
		up.x += this.x;
		up.y += this.y;
		
		ctx.save();
		
		ctx.strokeStyle = "orange";
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(right.x,right.y);
		ctx.stroke();
		
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(up.x,up.y);
		ctx.stroke();
		
		
		ctx.strokeStyle = "cyan";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(this.xVel*10 + this.x,this.yVel*10 + this.y);
		ctx.stroke();
		
		ctx.restore();
		
		ctx.save()
		ctx.translate(this.x,this.y);
		ctx.rotate(this.angle);
			
		ctx.strokeStyle = "black";
		ctx.setLineDash([5]);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI*2);
		ctx.stroke();
		
		var textVec = {x:0, y:-40};
		this.drawLib.text(ctx, "PlanetAngle: " + this.angleWithPlanet, textVec.x, textVec.y, 12, "cyan");
		textVec.y -= 15;
		this.drawLib.text(ctx, "Angle: " + this.angle, textVec.x, textVec.y, 12, "cyan");
		textVec.y -= 10;
		ctx.restore();
	},
}; // end app.ship