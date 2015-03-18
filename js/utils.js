// utils.js

"use strict";
var app = app || {};

app.utils = function(){

	/*
	Function Name: clamp(val, min, max)
	Return Value: returns a value that is constrained between min and max (inclusive) 
	*/
	function clamp(val, min, max){
		return Math.max(min, Math.min(max, val));
	}
	
	
	/*
		Function Name: getRandom(min, max)
		Return Value: a floating point random number between min and max
	*/
	function getRandom(min, max) {
	  return Math.random() * (max - min) + min;
	}
	
	
	/*
		Function Name: getRandomInt(min, max)
		Return Value: a random integer between min and max
	*/
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	// Function Name: getMouse(e)
	// returns mouse position in local coordinate system of element
	function getMouse(e){
		var mouse = {}
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
		return mouse;
	}
	
	function getAngleBetween(p1, p2){
		var angleRadians = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) + Math.PI;
		return angleRadians;
	}
	
	function rotateVector(vec, angle){
		var rtn = {	x: Math.cos(angle) * vec[0] - Math.sin(angle) * vec[1],
					y: Math.sin(angle) * vec[0] + Math.cos(angle) * vec[1] };
		return rtn;
	}
	
	function normalizeVector(vec){
		var x = vec[0];
		var y = vec[1];
		
		var mag = Math.sqrt(x*x + y*y);
		x /= mag;
		y /= mag;
		return {x:x, y:y};
	}
	
	function distanceBetween(p1, p2){
		var dx = p1.x-p2.x;
		var dy = p1.y-p2.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	// the "public interface" of this module
	return{
		clamp : clamp,
		getRandom : getRandom,
		getRandomInt : getRandomInt,
		getMouse : getMouse,
		getAngleBetween : getAngleBetween,
		rotateVector : rotateVector,
		normalizeVector : normalizeVector,
		distanceBetween : distanceBetween,
	};
}(); 
