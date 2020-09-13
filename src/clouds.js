var Clouds = function(x, z) {

    // position
    this.x = x;
    this.z = z;

    // radius
    this.r = 50000
    
    // possible to turn off
    this.vis = true;
    this.hid = false;

    this.sky = null;
    this.clouds = [];
}

Clouds.prototype = {

    init : function(sceneObjects) {

        this.sky = new Sky();
        this.sky.vis = true;
        this.sky.px = 840;
		this.sky.setScale(1680, 1.5);
        
        var step = 2 * Math.PI / 40;
		var i;

		for (i = 0; i < 40; i++) {

            var size = 8000 + Math.floor(rnd() * 10000);
			var cloud = new Cloud(size);
			cloud.x = Math.cos(step * i) * this.r;
			cloud.y = 0
			cloud.z = -Math.sin(step * i) * this.r;
			
            this.clouds.push(cloud);
            sceneObjects.push(cloud);
		}
    },

    update : function(px, pz) {

        var step = 2 * Math.PI / 40;

        var closest = 0;
        var cDist = 999999;

        for (var i = 0; i < this.clouds.length; i++) {

            if (game.isLkDn) this.clouds[i].hid = true;
            else this.clouds[i].hid = false;

			this.clouds[i].x = px + (Math.cos(step * i) * this.r);
            this.clouds[i].z = pz - (Math.sin(step * i) * this.r);
            
            if (this.clouds[i].vis) {

                // find the cloud closest to px = this.sky.px
                var dist = Math.abs(this.clouds[i].px - this.sky.px);
                
                if (dist < cDist) {
                    
                    cDist = dist;
                    closest = i;
                }
            }
        }
    
        this.sky.py = this.clouds[closest].py;
    }
}