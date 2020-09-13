var Cloud = function(s) {

    // actual position and render position
	this.x = this.y = this.z = this.px = this.py = 0;

    // distance from camera
    this.dist = 0;

    this.w = this.h = s / 2;
    this.h = s / 2;

	this.scale = 1;
	this.ox = this.w * -0.5;
    this.oy = this.h * -0.5;

    this.locSc = 1;
    
    this.lr = -4;
}

Cloud.prototype = {
	
	setScale : function(s, sy) {
		
        this.scale = s;
        
        this.scaleY = sy || s;

        this.ox = (this.w * this.scale) * -0.5;
		this.oy = (this.h * this.scaleY) * -0.5;
	},
	
	draw : function() {
        
        this.py += 30;

        if (this.w * this.scale * scale > 0 && (this.px < Const.W + 100 && this.px > -100)) {

            ctx.beginPath();
            ctx.arc((this.px + this.ox) * scale, (this.py + this.oy - 32) * scale, this.w * this.scale * scale, 0.9 * Math.PI, 2.1 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
	}
}