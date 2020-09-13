Col = {
	
	circle : function(ax, ay, ar, bx, by, br) {
		
		var dx = bx - ax;
		var dy = by - ay;
		
		return ((dx * dx) + (dy * dy) - (ar + br) * (ar + br));
	},
	
	aabb : function(ax, ay, aw, ah, bx, by, bw, bh) {
		
		// bounding values of A
		var aMinX = ax - (0.5 * aw);
		var aMaxX = ax + (0.5 * aw);
		var aMinY = ay - (0.5 * ah);
		var aMaxY = ay + (0.5 * ah);
		
		// bounding values of B
		var bMinX = bx - (0.5 * bw);
		var bMaxX = bx + (0.5 * bw);
		var bMinY = by - (0.5 * bh);
		var bMaxY = by + (0.5 * bh);
		
		// bounds are not in contact - no collision
		if (aMinX > bMaxX || aMaxX < bMinX || aMinY > bMaxY || aMaxY < bMinY) {
			
			return false;
		}
		
		return true;
	}
};