"use strict";
app.Planet = function(){
	function Planet(x,y,radius, color, drawLib) {
		this.color = color;
		
		this.x = x;
		this.y = y;
		this.innerRadius = radius;
		
		this.radius = this.innerRadius * 2.2;
		
		this.width = this.radius*2+6;
		this.height = this.radius*2+6;
		this.drawLib = drawLib;
		
		this.gravity = this.radius*0.1;
		
		//Generating image
		var canv = this.drawLib.getTempCanvas(this.width, this.width);
		var ctx = canv.getContext("2d");
		
		//Planet's fill
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.radius+3, this.radius+3);
		ctx.arc(this.radius+3, this.radius+3, this.innerRadius, 0, Math.PI/2);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.radius+3, this.radius+3);
		ctx.arc(this.radius+3, this.radius+3, this.innerRadius, Math.PI/2, Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.radius+3, this.radius+3);
		ctx.arc(this.radius+3, this.radius+3, this.innerRadius, Math.PI, Math.PI*1.5);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.radius+3, this.radius+3);
		ctx.arc(this.radius+3, this.radius+3, this.innerRadius, Math.PI*1.5,Math.PI*2);
		ctx.fill();
		ctx.stroke();
		
		this.image = this.drawLib.makeImage(canv);
		
		canv = this.drawLib.getTempCanvas(this.width, this.width);
		ctx = canv.getContext("2d");
		//influence gradient
		var grad = ctx.createRadialGradient(this.radius+3, this.radius+3,this.innerRadius,this.radius+3, this.radius+3,this.radius);
		grad.addColorStop(0, "rgba(100,100,100,200)");
		grad.addColorStop(1, "rgba(255,255,255,0)");
		ctx.beginPath();
		ctx.fillStyle = grad;
		ctx.arc(this.radius+3, this.radius+3, this.radius, 0, Math.PI*2);
		ctx.fill();
		
		//Planets area of influence
		ctx.strokeStyle = this.color;
		ctx.setLineDash([5]);
		ctx.beginPath();
		ctx.arc(this.radius+3, this.radius+3, this.radius, 0, Math.PI*2);
		ctx.stroke();
		
		this.influenceImage = this.drawLib.makeImage(canv);
		
		this.spin = 0;
	};
		

	var p = Planet.prototype;
	p.utils = undefined;
	
	  p.draw = function(ctx) {
			var halfW = this.width/2;
			var halfH = this.height/2;
			
			ctx.save();
			ctx.translate(this.x, this.y);
			if(this.image){
				ctx.save();
				ctx.rotate(this.spin);
				ctx.drawImage(this.influenceImage, -halfW, -halfH, this.width, this.width);
				ctx.restore();
				ctx.drawImage(this.image, -halfW, -halfH, this.width, this.width);
			}else{
				console.log("NO IMAGE");
				//Planet's fill
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(0, 0, this.innerRadius, 0, Math.PI*2);
				ctx.fill();
				
				//Planets area of influence
				ctx.strokeStyle = this.color;
				ctx.setLineDash([5]);
				ctx.beginPath();
				ctx.arc(0, 0, this.radius, 0, Math.PI*2);
				ctx.stroke();
			}
			ctx.restore();
	  };
	
	p.update = function(dt) {
		this.spin += Math.PI/30*dt;
	  };
	  
	 p.explode  = function() {
		this.active = false;
	  };
	  
	  // private
	  function inBounds(obj) {
		return obj.y <= obj.canvasHeight + obj.height * 0.5;
	  };
	
	return Planet;
	
}();
