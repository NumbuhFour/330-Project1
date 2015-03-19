"use strict";
app.Coin = function(){
	function Coin(drawLib, image) {
		
		this.x = undefined;
		this.y = undefined;
		this.planet = undefined;
		
		this.imgWidth = 10;
		this.imgHeight = 13;
		this.width = 50;
		this.height = 65;
		this.drawLib = drawLib;
		
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
		

	var p = Coin.prototype;
	p.utils = undefined;
	
	p.draw = function(ctx) {
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		if(this.image){
			ctx.imageSmoothingEnabled = false; /// future
			ctx.drawImage(this.image, 0, this.imgHeight, this.imgWidth, this.imgHeight, -halfW,-halfH,this.width,this.height);
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
	
	p.onTouch = function(player) {
		
	};

	// private
	function inBounds(obj) {
		return obj.y <= obj.canvasHeight + obj.height * 0.5;
	};
	
	return Coin;
	
}();
