"use strict";
app.Door = function(){
	function Door(game, drawLib, image) {
		this.game = game;
		
		this.x = undefined;
		this.y = undefined;
		this.planet = undefined;
		
		this.imgWidth = 80;
		this.imgHeight = 80;
		this.width = 60;
		this.height = 60;
		this.radius = this.height/4;
		this.drawLib = drawLib;
		
		this.active = true;
		
		this.sprite = 0;
		this.touched = false;
		
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
		

	var p = Door.prototype;
	p.utils = undefined;
	
	p.draw = function(ctx) {
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		
		if(this.image){
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(this.image, this.imgWidth * Math.floor(this.sprite), this.imgHeight* (this.isLocked() ? 1:0), this.imgWidth, this.imgHeight, -halfW,-halfH,this.width,this.height);
		}else{
			console.log("NO IMAGE");
			ctx.fillStyle = "yellow";
			ctx.strokeStyle = "orange";
			ctx.beginPath();
			ctx.moveTo(this.width, this.height/2);
			ctx.arc(this.width/2, this.height/2, this.width/2, 0, Math.PI*2);
			ctx.fill();
			ctx.stroke();
		}
		ctx.restore();
	};
	
	p.update = function(dt){
		this.sprite += 5*dt;
		if(this.sprite >= 12) this.sprite = 0;
	};
	
	p.onTouch = function(player) {
		if(!this.isLocked() && !this.touched){
			this.game.nextLevel();
			this.touched = true;
		}
	};
	
	p.isLocked = function(){
		return this.game.keysLeft > 0;
	};

	// private
	function inBounds(obj) {
		return obj.y <= obj.canvasHeight + obj.height * 0.5;
	};
	
	return Door;
	
}();
