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
	thrust: 150,// Thrust off planet speed
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
	
	init: function(){
		this.grad=ctx.cr
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
			
			ctx.strokeStyle = "black";
			ctx.setLineDash([5]);
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2);
			ctx.stroke();
		}else{
			
		}
		
		
		ctx.restore();
		this.drawDebug(ctx);
	},
	
	update: function(dt){
		this.x += this.xVel;
		this.y += this.yVel;
		this.angle += this.rVel;

		if(this.planet){
							
				
			
			//Fall towards planet if not on ground
			if(!this.onGround && this.getDistanceToPlanet()-this.radius > this.planet.innerRadius){
				this.angleWithPlanet = 
					this.utils.getAngleBetween( [this.x - this.planet.x, this.y - this.planet.y],[0, 1]);
				//this.moveVerticalOnPlanet(this.getDistanceToPlanet()-this.getGravity()*dt);
				this.moveTowardPlanet(this.getGravity()*dt);
			}else { 
				//Set on surface
				if(!this.onGround){
					this.angleWithPlanet = 
						this.utils.getAngleBetween( [this.x - this.planet.x, this.y - this.planet.y],[0, 1]);
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
		vec = this.utils.normalizeVector(vec);
		vec.x *= this.radius*2;
		vec.y *= this.radius*2;
		
		ctx.save();
		ctx.translate(this.x + vec.x, this.y + vec.y);
		var ang = this.utils.getAngleBetween( [this.x - planet.x, this.y - planet.y], [1, 0]);
		ctx.rotate(ang);
		ctx.strokeStyle = planet.color;
		ctx.globalAlpha = 0.5;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(10,-10);
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
			this.updateLocationWithPlanet();
			//this.moveTangetToPlanet(-this.walkSpeed*dt);
			//this.onGround = false;
		}else if(this.planet){
			this.moveTangetToPlanet(-this.tangentSpeed*dt);
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
			this.updateLocationWithPlanet();
			//this.moveTangetToPlanet(this.walkSpeed*dt);
			//this.onGround = false;
		}else if(this.planet){
			this.moveTangetToPlanet(this.tangentSpeed*dt);
		}else{
			this.angle += this.spinSpeed*dt;
		}
	},
	
	moveUp: function(dt){
		if(!this.planet){
			this.xVel -=  Math.cos(this.angle+Math.PI/2) * this.flySpeed*dt;
			this.yVel -=  Math.sin(this.angle+Math.PI/2) * this.flySpeed*dt;
		}else {
			this.xVel -=  Math.cos(this.angle+Math.PI/2) * this.thrust*dt;
			this.yVel -=  Math.sin(this.angle+Math.PI/2) * this.thrust*dt;
			this.onGround = false;
		}
	},
	moveDown: function(dt){
		if(!this.planet){
			this.xVel +=  Math.cos(this.angle+Math.PI/2) * this.flySpeed*dt;
			this.yVel +=  Math.sin(this.angle+Math.PI/2) * this.flySpeed*dt;
		}else {
			this.xVel +=  Math.cos(this.angle+Math.PI/2) * this.thrust*dt;
			this.yVel +=  Math.sin(this.angle+Math.PI/2) * this.thrust*dt;
			this.onGround = false;
		}
	},
	
	slowDown: function(dt){
		this.xVel *= 0.95;
		this.yVel *= 0.95;
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
				this.thrust = planet.gravity + 2;
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
		
		/*var textVec = this.utils.rotateVector([40,-40], this.angle);
		textVec.x += this.x;
		textVec.y += this.y;
		this.drawLib.text(ctx, "Grounded: " + this.onGround, textVec.x, textVec.y, 12, "cyan");*/
	},
}; // end app.ship