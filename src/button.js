var Button = function(x, y, s, text, col) {

	this.x = x || 0;
	this.y = y || 0;
	
	this.w = this.h = s;

	this.hw = s / 2;

	this.vis = true;
	this.isOv = false;

	this.alpha = 1;

	if (col == '') this.col = '';
	else this.col = col || '#666';

	// text label?
	this.t = text || '';
}

Button.prototype = {
	
	click : function(mx, my) {
		
		if (!this.vis) return false;

		return mx > this.getX() && mx < this.getX() + this.getW() && my > this.getY() && my < this.getY() + this.getH() ? true : false;
	},

	press : function(mx, my) {

		if (!this.vis) return false;

		if (mx > this.getX() && mx < this.getX() + this.getW() && my > this.getY() && my < this.getY() + this.getH()) {
			
			this.isDn = true;
		}
	},

	release : function() {

		this.isDn = false;
	},
	
	getX : function() {
		
		return this.x * scale;
	},
	
	getY : function() {
		
		return this.y * scale;
	},
	
	getW : function() {
		
		return this.w * scale;
	},
	
	getH : function() {
		
		return this.h * scale;
	},
	
	update : function(mx, my) {
		
		if (!this.isOv) {
			
			// rolling over?
			if (mx > this.getX() && mx < this.getX() + this.getW() && my > this.getY() && my < this.getY() + this.getH()) {
				
				this.isOv = true;
			}
		}
		else {
			
			// rolled out?
			if (mx < this.getX() || mx > this.getX() + this.getW() || my < this.getY() || my > this.getY() + this.getH()) {
			
				this.isOv = false;
				this.isDn = false;
			}
		}
	},
	
	draw : function() {
		
		if (this.vis) {
			
			var oy = this.isOv ? 4 : 0;

			if (!this.isOv) {
			
				// shadow
				ctx.globalAlpha = 0.25;
				ctx.beginPath();
				ctx.arc(Math.floor((this.x + this.hw) * scale), Math.floor((this.y + (this.hw + 4)) * scale), Math.floor(this.hw * scale), 0, Const.PI2);
				ctx.strokeStyle = "#000";
				ctx.lineWidth = Math.floor(this.hw * 0.2 * scale);
				ctx.stroke();
				ctx.globalAlpha = 1;
			}
			

			ctx.globalAlpha = this.alpha;

			ctx.beginPath();
			ctx.arc(Math.floor((this.x + this.hw) * scale), Math.floor((this.y + this.hw + oy) * scale), Math.floor(this.hw * scale), 0, Const.PI2);
			
			if (this.col != '') {
				
				ctx.fillStyle = this.col;
				ctx.fill();
			}
			
			ctx.strokeStyle = "#fff";
			ctx.fillStyle = "#fff";
			ctx.lineWidth = Math.floor(this.hw * 0.2 * scale);
			ctx.stroke();

			if (this.t == '>' || this.t == 'X' || this.t == 'II') {

				ctx.save();
            	ctx.translate(Math.floor((this.x + this.hw) * scale), Math.floor((this.y + oy + this.hw) * scale));	
				
				if (this.t == '>') {
					
					ctx.scale(0.5 * scale, 0.5 * scale);
					ctx.fill(new Path2D(d="M50 0L-30-50-30 50 50 0"));
				}
				else if (this.t == 'X') {
					
					ctx.scale(0.55 * scale, 0.55 * scale);
					ctx.fill(new Path2D(d="M25-46L0-21-25-46-46-25-21 0-46 25-25 46 0 21 25 46 46 25 21 0 46-25 25-46"));
				}
				else if (this.t == 'II') {

					ctx.scale(0.3 * scale, 0.3 * scale);				
					ctx.fill(new Path2D(d="M40-45L10-45 10 45 40 45 40-45"));
					ctx.fill(new Path2D(d="M-10-45L-40-45-40 45-10 45-10-45"));
				}

            	ctx.restore();
			}
			else if (this.t != '') {
		
				ctx.font = Math.floor(this.hw * scale) + "px Arial";
				ctx.textAlign = "center";
				ctx.fillText(this.t, Math.floor((this.x + this.hw) * scale), Math.floor((this.y + oy + (this.w * 0.66)) * scale));
			}

			ctx.globalAlpha = 1;
		}
	}
}