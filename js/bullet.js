// bullet.js

"use strict";

var app = app || {};

app.Bullet = function() {
	function Bullet(x,y,speed){
		this.x = x;
		this.y = y;
		this.active = true;
		this.xVel = Math.random()*speed*2 - speed;
		this.yVel = -speed;
		this.width = 5;
		this.height = 5;
		this.color = "#fff";
		this.color = app.drawLib.getRandomColor();
	}
	
	//public functions
	var p = Bullet.prototype;
	
	p.update = function(dt){
		this.x += this.xVel * dt;
		this.y += this.yVel * dt;
		
		if(this.x < 0) {
			this.x = 0;
			this.xVel *=-1;
		}if(this.x >= app.blastem.WIDTH) {
			this.x = app.blastem.WIDTH;
			this.xVel *=-1;
		}
		this.active = this.active && inBounds(this.y);
	};
	
	p.draw = function(ctx){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x-this.width/2,this.y-this.height/2, this.width, this.height);
	};
	
	//Private function
	function inBounds(y){
		return y >= -10;	
	};
	
	return Bullet;
	
}();//Call