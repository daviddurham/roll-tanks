var Shell = function() {

    // position and render position
    this.x = this.y = this.z = this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;

    this.scale = this.locSc = 1;
	
    this.vis = true;
    this.hid = true;

    this.pt = [];
    this.qd = [];

    // unrotated points
    this.uR = [];
    this.zR = [];
    this.yR = [];
    this.xR = [];

    this.startX = this.startY = this.startZ = 0;
    this.rx = this.ry = 0;

    this.firing = false;
    this.hit = false;

    addSprite(this, 0, 0, 0, '#333', 64);

    for (i = 0; i < this.pt.length; i++) {

        var vx = this.pt[i].x - this.x;
        var vy = this.pt[i].y - this.y;
        var vz = this.pt[i].z - this.z;

        this.uR.push({x: vx, y: vy, z: vz});
        this.zR.push({x: vx, y: vy, z: vz});
        this.yR.push({x: vx, y: vy, z: vz});
        this.xR.push({x: vx, y: vy, z: vz});
    }

    this.pt[0].hid = true;
}

Shell.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    fire : function(x, y, z, rx, ry) {

        this.x = this.startX = x;
        this.y = this.startY = y;
        this.z = this.startZ = z;

        this.rx = rx;
        this.ry = ry;

        this.t = 0;
        this.firing = true;
        this.hit = false;
        
        this.pt[0].hid = false;
    },
    
    update : function() {

        if (this.firing) {
            
            var p = getProjectilePos((-this.rx * Const.D2R), this.t);
            p.y -= 30;

            this.yR[0].y = p.y;

            /// hmmm...
            this.yR[0].x = p.x * Math.sin(this.ry * Const.D2R);
            this.yR[0].z = p.x * Math.cos(this.ry * Const.D2R);

            this.t += 0.333;

            if (p.y > -30 && this.t > 0.5 && !this.hit) {

                this.hit = true;
                this.pt[0].hid = true;

                // EXPLODE
                game.explode(this.yR[0].x + this.x, this.yR[0].y + this.y, this.yR[0].z + this.z);
            }

            if (p.y > 1000) {
                
                // reset
                this.t = 0;
                this.firing = false;

                game.onShot();
            }
            else if (p.y > 500) {

                game.exp.setVisible(false);
            }

            for (n = 0; n < this.pt.length; n++) {

                this.pt[n].x = this.yR[n].x + this.x;
                this.pt[n].y = this.yR[n].y + this.y;
                this.pt[n].z = this.yR[n].z + this.z;
            }
        }
    }
}