var TankGun = function(point) {

    this.anc = point;
    
    // position
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
    
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
    this.rx = (game.title) ? 10 : 60;
    this.ry = 0;
    this.rz = 0;

    this.firePoint = null;

    this.init();
}

TankGun.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },
    
    init : function() {

        this.firePoint = addSprite(this, 0, 0, 0, '', 50);

        // gun
        addBox(this, 0, 0, 32, 32, 32, 32, ['#666', '#666', '', '#444444', '#666', '#666']);

        for (var i = 0; i < this.pt.length; i++) {

            var vx = this.pt[i].x - this.x;
            var vy = this.pt[i].y - this.y;
            var vz = this.pt[i].z - this.z;

            this.uR.push({x: vx, y: vy, z: vz});
            this.zR.push({x: vx, y: vy, z: vz});
            this.yR.push({x: vx, y: vy, z: vz});
            this.xR.push({x: vx, y: vy, z: vz});
        }
    },
    
    update : function(inY, rx, ry, rz) {

        this.x = this.anc.x;
        this.y = this.anc.y;
        this.z = this.anc.z;

        if (this.rx < 0) this.rx = 0;
        else if (this.rx > 80) this.rx = 80;

        rotate(this, (this.rx + rx) * Const.D2R, (this.ry + ry) * Const.D2R, (this.rz + rz) * Const.D2R);

        for (var n = 0; n < this.pt.length; n++) {

            this.pt[n].x = this.yR[n].x + this.x;
            this.pt[n].y = this.yR[n].y + this.y;
            this.pt[n].z = this.yR[n].z + this.z;
        }
    }
}