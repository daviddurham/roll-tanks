var Shadow = function() {

    // position and render position
    this.x = this.y = this.z = this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;

	this.scale = 1;
	
    this.vis = true;
    this.hid = true;

    this.ptO = [];
    this.pt = [];
    this.qd = [];

    // unrotated points
    this.uR = [];
    this.zR = [];
    this.yR = [];
    this.xR = [];

    this.locSc = 1;

    // shadow
    addQuad(this, [30, -50, 30], [-30, -50, 30], [-30, -50, -30], [30, -50, -30], 'img_shadow', -1);

    for (i = 0; i < this.pt.length; i++) {

        this.ptO.push({x: this.pt[i].x, y: this.pt[i].y, z: this.pt[i].z});

        var vx = this.pt[i].x - this.x;
        var vy = this.pt[i].y - this.y;
        var vz = this.pt[i].z - this.z;

        this.uR.push({x: vx, y: vy, z: vz});
        this.zR.push({x: vx, y: vy, z: vz});
        this.yR.push({x: vx, y: vy, z: vz});
        this.xR.push({x: vx, y: vy, z: vz});
    }
}

Shadow.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    setVisible : function(flag) {

        for (var i = 0; i < this.pt.length; i++) this.pt[i].hid = !flag;
    },

    update : function(obj) {

        this.locSc = (obj.pt[0].y / 250) == 0 ? 1 : 1 / (obj.pt[0].y / 250);

        this.x = obj.pt[0].x;
        this.z = obj.pt[0].z;

        for (n = 0; n < this.pt.length; n++) {

            this.pt[n].x = (this.yR[n].x * this.locSc) + this.x;
            this.pt[n].y = (this.yR[n].y) + this.y;
            this.pt[n].z = (this.yR[n].z * this.locSc) + this.z;
        }
    }
}