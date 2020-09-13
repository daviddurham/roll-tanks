var Health = function(x, z) {

    // position
    this.x = x;
    this.y = -100;
    this.z = z;
    
    // render position
    this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;
    this.scale = 1;
    this.locSc = 1;
	
    this.vis = true;
    this.enabled = true;

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

    addBox(this, 0, -20, 0, 80, 80, 40, ['#fff', '', '#ddd', '#ddd', '#ddd', '#ddd'], 0);
    addBox(this, 0, -20, 0, 80, 80, 40, ['', '', '+', '+', '', ''], 0);
    
    // shadow
    addQuad(this, [40, 50, 20], [-40, 50, 20], [-40, 50, -20], [40, 50, -20], '#000', -1, 0.2);
    
    // using actual img textures
    //addBox(this, 0, 0, 0, 200, 200, 200, ['#fff', '', 'img_dice1', 'img_dice3', '#ddd', '#ddd']);
    
    for (var i = 0; i < this.pt.length; i++) {

        var vx = this.pt[i].x - this.x;
        var vy = this.pt[i].y - this.y;
        var vz = this.pt[i].z - this.z;

        this.uR.push({x: vx, y: vy, z: vz});
        this.zR.push({x: vx, y: vy, z: vz});
        this.yR.push({x: vx, y: vy, z: vz});
        this.xR.push({x: vx, y: vy, z: vz});
    }
}

Health.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },
    
    setVisible : function(flag) {

        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].hid = !flag;
        }

        this.enabled = flag;
    },

    setPosition : function(x, z) {

        this.x = x;
        this.z = z;
    },

    update : function() {
        
        this.ry += 2;

        rotate(this, this.rx * Const.D2R, this.ry * Const.D2R, this.rz * Const.D2R);

        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].x = this.yR[i].x + this.x;
            this.pt[i].y = this.yR[i].y + this.y;
            this.pt[i].z = this.yR[i].z + this.z;
        }
    }
}