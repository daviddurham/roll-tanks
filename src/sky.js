var Sky = function() {

    this.w = 1;
    this.h = 1024;
    
    // render position
    this.px = this.py = 0;

    this.scale = 1;
	this.ox = this.w * -0.5;
	this.oy = this.h * -0.5;
}

Sky.prototype = {
	
	setScale : function(s, sy) {
		
        this.scale = s;
        
        this.scaleY = sy || s;
		
		this.ox = (this.w * this.scale) * -0.5;
		this.oy = (this.h * this.scaleY) * -0.5;
	},
	
	draw : function() {
		
		if (this.vis) {
        
            var grd = ctx.createLinearGradient((this.px + this.ox) * scale, (this.py + this.oy) * scale, (this.px + this.ox) * scale, ((this.py + this.ox) + (this.h * this.scaleY)) * scale);
            grd.addColorStop(0, '#2A00F7');
            grd.addColorStop(0.25, '#5D92F9');
            grd.addColorStop(0.45, '#fff');
            grd.addColorStop(0.5, '#fff');
            grd.addColorStop(0.5, '#3D81C0');
            grd.addColorStop(1, '#3D81C0');

            ctx.fillStyle = grd;
            ctx.fillRect((this.px + this.ox) * scale, (this.py + this.oy) * scale, this.w * this.scale * scale, this.h * this.scaleY * scale);
        }
	}
}