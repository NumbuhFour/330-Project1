"use strict";
app.Fuel = function(){
	function Fuel(drawLib, image) {
		
		this.x = undefined;
		this.y = undefined;
		this.planet = undefined;
		
		this.imgWidth = 10;
		this.imgHeight = 14;
		this.width = 30;
		this.height = 39;
		this.radius = this.height;
		this.drawLib = drawLib;
		
		this.active = true;
		this.collected = false;
		this.alpha = 1;
		
		this.sprite = 0;
		this.fuel = 100;
		
		/*//Generating image
		var canv = this.drawLib.getTempCanvas(this.width, this.width);
		var ctx = canv.getContext("2d");
		
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "orange";
		ctx.beginPath();
		ctx.arc(this.width/2, this.height/2, this.width/2, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
		
		this.image = this.drawLib.makeImage(canv);*/
		this.image = image;
		
		this.angle = 0;
		
	};
		

	var p = Fuel.prototype;
	p.utils = undefined;
	
	p.draw = function(ctx) {
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		
		if(this.image){
			ctx.globalAlpha = this.alpha;
			ctx.imageSmoothingEnabled = false;
			var fuelPerc = this.fuel/100;
			ctx.drawImage(this.image, this.imgWidth * Math.floor(this.sprite), this.imgHeight*(1-fuelPerc), this.imgWidth, this.imgHeight*fuelPerc, -halfW,-halfH + this.height*(1-fuelPerc),this.width,this.height*fuelPerc);
		}else{
			console.log("NO IMAGE");
			ctx.fillStyle = "green";
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(this.width, this.height/2);
			ctx.arc(this.width/2, this.height/2, this.width/2, 0, Math.PI*2);
			ctx.fill();
			ctx.stroke();
		}
		ctx.restore();
	};
	
	p.update = function(dt){
		if(this.collected){
			this.alpha -= 1.2*dt;
			this.x -=  Math.cos(this.angle+Math.PI/2) * 60*dt;
			this.y -=  Math.sin(this.angle+Math.PI/2) * 60*dt;//Float up
			if(this.alpha <= 0) this.active = false;
		}
		
		this.sprite += 5*dt;
		if(this.sprite >= 1) this.sprite = 0;
	}
	
	p.onTouch = function(player) {
		if(this.collected || player.maxFuel == player.fuel) return;
		player.fuel += 3;
		this.fuel -= 3;
		if(this.fuel <= 0) this.collected = true;
	};

	// private
	function inBounds(obj) {
		return obj.y <= obj.canvasHeight + obj.height * 0.5;
	};
	
	return Fuel;
	
}();
