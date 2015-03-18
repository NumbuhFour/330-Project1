//drawLib.js
"use strict";
var app = app || {};

app.drawLib = {
	grad: undefined,
	tempCan: undefined,
	
	clear: function(ctx,x,y,w,h){
		ctx.clearRect(x,y,w,h);
	},
	
	rect: function(ctx,x,y,w,h, col){
		ctx.save();
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
		ctx.restore();
	},
	
	backgroundGradient: function(ctx,width,height) {
		ctx.save();
		
		if(this.grad == undefined){
			Math.seed = app.seed;
			this.grad=ctx.createLinearGradient(0,0,0,height);
			for(var i = 0; i < 1; i+=0.1){
				this.grad.addColorStop(i, this.getRandomColor());
			}
		}
		/*
		grad.addColorStop(0,"#888");
		grad.addColorStop(0.85, "blue");
		grad.addColorStop(1,"#ff9999");
		*/
		
		ctx.fillStyle = this.grad;
		ctx.fillRect(0,0,width,height);
		ctx.restore();
	},
	
	getRandomColor: function(){
		var r = Math.round(Math.seededRandom(0,255));
		var g = Math.round(Math.seededRandom(0,255));
		var b = Math.round(Math.seededRandom(0,255));
		return "rgb(" + r + "," + g + "," + b + ")";
	},
	
	
	//For use with makeImage to save canvas-drawn images to memory
	getTempCanvas: function(width,height){
		if(this.tempCan == undefined){
			this.tempCan = document.createElement("canvas");
		}
		this.tempCan.width = width;
		this.tempCan.height = height;
		this.tempCan.getContext("2d").clearRect(0,0,this.tempCan.width, this.tempCan.height);
		return this.tempCan;
	},
	
	//Save canvas-drawn image to memory
	makeImage: function(canvas){
		var dataURL = canvas.toDataURL("image/png");
		var newImage = new Image();
		newImage.src = dataURL;
		return newImage;
	},
	
	text : function(ctx, string, x, y, size, color){
		ctx.save();
		ctx.font = 'bold ' + size + 'px Monospace';
		ctx.fillStyle = color;
		ctx.fillText(string, x,y);
		ctx.restore();
	}
	
}