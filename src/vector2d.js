var Vector2D = function(x, y) {
	
	this.x = x || 0;
	this.y = y || 0;
};

Vector2D.prototype = {
	
	magnitude : function() {
		
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	},
	
	normalise : function() {
		
		// catch zero divided by zero as it returns NaN
		if (this.x == 0 && this.y == 0) {
			
			return this;
		}
		
		var m = this.magnitude();
		
		this.x = this.x / m;
		this.y = this.y / m;
		
		return this;
	},
	
	angle : function(useRadians) {
		
		return Math.atan2(this.y,this.x) * (useRadians ? 1 : Const.R2D);
		
	},
	
	vector : function(ang) {
		
		this.x = Math.sin(ang * Const.D2R);
		this.y = -Math.cos(ang * Const.D2R);
	}
};