var SceneObject = function(col, s, img) {

    this.col = col;
    this.w = this.h = s / 2;

    this.img = img || null;

    if (this.img) {

        this.w = this.img.width;
        this.h = this.img.height;
    }

    // actual position, render position and texture co-ords
	this.x = this.y = this.z = this.px = this.py = this.u = this.v = 0;

    // distance from camera
    this.dist = 0;

	this.scale = 1;
	this.ox = this.w * -0.5;
    this.oy = this.h * -0.5;
    
    this.locSc = 1;
    
    this.lr = 0;
    this.a = 1;
    
    // hide states
    this.vis = this.hid = false;
}

SceneObject.prototype = {
	
	setScale : function(s, sy) {
		
        this.scale = s;
        
        this.scaleY = sy || s;
		
		this.ox = (this.w * this.scale) * -0.5;
		this.oy = (this.h * this.scaleY) * -0.5;
	},
	
	draw : function() {
		
		if (this.vis && this.w * this.scale * scale > 0) {
        
            if (this.img) {
            
                ctx.drawImage(this.img, (this.px + this.ox) * scale, (this.py + this.oy) * scale, this.img.width * this.scale * scale, this.img.height * this.scaleY * scale);
            }
            else if (this.col != '') {
            
                if (this.a < 1) ctx.globalAlpha = this.a;
                
                ctx.beginPath();
                ctx.arc(this.px * scale, this.py * scale, this.w * this.scale * scale, 0, Const.PI2);    
                ctx.fillStyle = this.col;
                ctx.fill();
                ctx.closePath();

                if (this.a < 1) ctx.globalAlpha = 1;
            }
        }
	}
}