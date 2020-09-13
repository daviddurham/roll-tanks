var Arc = function(pt) {

    this.anc = pt;

    // position
    this.x = pt.x;
    this.y = pt.y;
    this.z = pt.z;
    
    // render position
    this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;

	this.scale = this.locSc = 1;
    this.vis = true;

    this.pt = [];
    this.qd = [];

    // unrotated points
    this.uR = [];

    // z-rotated
    this.zR = [];
    this.yR = [];
    this.xR = [];

    // rotation
    this.rx = this.ry = this.rz = 0;

    var i;

    for (i = 0; i < 20; i++) {

        addSprite(this, 0, 0, i * 100, '#FF0000', 48);
    }

    for (i = 0; i < this.pt.length; i++) {

        var vx = this.pt[i].x - this.x;
        var vy = this.pt[i].y - this.y;
        var vz = this.pt[i].z - this.z;

        this.uR.push({x: vx, y: vy, z: vz});
        this.zR.push({x: vx, y: vy, z: vz});
        this.yR.push({x: vx, y: vy, z: vz});
        this.xR.push({x: vx, y: vy, z: vz});

        this.pt[i].hid = true;
    }
}

Arc.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    setVisible : function(flag) {

        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].hid = !flag;
        }
    },
    
    update : function(rx, ry, rz) {

        var n;

        this.x = this.anc.x;
        this.y = this.anc.y;
        this.z = this.anc.z;

        for (n = 0; n < this.pt.length; n++) {

            var p = getProjectilePos((-rx * Const.D2R), (n + 1));

            this.uR[n].z = p.x;
            this.uR[n].y = p.y;

            if (p.y + this.y > -50) this.pt[n].hid = true;
            else this.pt[n].hid = false;
        }

        rotate(this, (this.rx) * Const.D2R, (this.ry + ry) * Const.D2R, (this.rz + rz) * Const.D2R);

        for (n = 0; n < this.pt.length; n++) {

            this.pt[n].x = this.yR[n].x + this.x;
            this.pt[n].y = this.yR[n].y + this.y;
            this.pt[n].z = this.yR[n].z + this.z;
        }
    }
}