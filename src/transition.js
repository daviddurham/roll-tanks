var Transition = function() {
	
	this.v = false;
	this.w = false;
	
	// position - start at the bottom
	this.p = Const.H;
	
	this.speed = 60;
	this.isTop = true;
}

Transition.prototype = {
	
	start : function() {
		
		this.p = Const.H;
		this.v = true;
		this.w = false;
		this.isTop = true;
	},
	
	onComplete : function() {
		
		this.v = false;
	},
	
	onHidden : function() {
		
		this.w = true;
		var scope = this;

		setTimeout(function() {scope.w = false; transFunc();}, 100);
	},
	
	update : function() {
		
		if (this.v) {

			if (!this.w) {
			
				this.p -= this.speed;
				
				if (this.p <= 0 && this.isTop) {
					
					this.onHidden();
					this.isTop = false;
				}
				else if (this.p <= (Const.H) * -1) {
					
					this.onComplete();
				}
			}	

			// clear between
			var px = 0, py = 0;
			if (this.p > 0) py = (this.p) * scale;
			
			//ctx.clearRect(px, py, cv.width, (this.p + Const.H) * scale);

			ctx.fillStyle = "#000";
			ctx.fillRect(px, py, cv.width, (this.p + (Const.H + 50)) * scale);
		}
	}
}