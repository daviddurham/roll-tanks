var Explosion = function() {

    // position and render position
    this.x = this.y = this.z = this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;

    this.scale = this.locSc = 1;
    this.vis = this.hid = true;

    this.pt = [];
    this.qd = [];

    // unrotated points
    this.uR = [];
    this.zR = [];
    this.yR = [];
    this.xR = [];

    this.exploding = false;

    addSprite(this, 0, 0, 0, '#fff', 512, 0, 0, 0, 0.5);
    //addBox(this, 0, 0, 0, 200, 200, 200, ['#eeeeee', '#eeeeee', '#dddddd', '#dddddd', '#cccccc', '#cccccc']);

    for (i = 0; i < this.pt.length; i++) {

        var vx = this.pt[i].x - this.x;
        var vy = this.pt[i].y - this.y;
        var vz = this.pt[i].z - this.z;

        this.uR.push({x: vx, y: vy, z: vz});
        this.zR.push({x: vx, y: vy, z: vz});
        this.yR.push({x: vx, y: vy, z: vz});
        this.xR.push({x: vx, y: vy, z: vz});
    }

    this.setVisible(false);
}

Explosion.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    setVisible : function(flag) {

        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].hid = !flag;
        }
    },

    explode : function(x, y, z) {

        this.x = x;
        this.y = y;
        this.z = z;

        for (n = 0; n < this.pt.length; n++) {

            this.pt[n].x = this.yR[n].x + this.x;
            this.pt[n].y = this.yR[n].y + this.y;
            this.pt[n].z = this.yR[n].z + this.z;
        }

        this.t = 0;
        this.exploding = true;

        this.setVisible(true);
    },
    
    update : function() {

        if (this.exploding) {
            
            this.t += 0.333;

            if (t > 10) {

                this.exploding = false;
            }

            for (var n = 0; n < this.pt.length; n++) {

                this.pt[n].x = this.yR[n].x + this.x;
                this.pt[n].y = this.yR[n].y + this.y;
                this.pt[n].z = this.yR[n].z + this.z;
            }
        }
    }
}