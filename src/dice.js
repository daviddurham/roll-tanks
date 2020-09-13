var Dice = function(x, y, z) {

    // position
    this.x = x;
    this.y = y;
    this.z = z;
    
    // render position
    this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;
    this.scale = 1;
    this.locSc = 1;
	
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

    // rotations for each number (0 - 4)
    this.numbers = [{x:0, y:90, z: 0}, {x:-90, y:90, z:0}, {x:0, y:180, z:90}, {x:90, y:90, z:0}, {x:180, y:90, z:0}];

    this.value = 0;
    this.rC = -1;
    this.enabled = false;

    this.dy = 50;

    this.btn = new Button(0, 0, 160, '');

    addBox(this, 0, 0, 0, 300, 300, 300, ['#F29AC0', '#F29AC0', '#FEDDB4', '#FEDDB4', '#EDEDA5', '#EDEDA5'], 2);
    addBox(this, 0, 0, 0, 300, 300, 300, ['0', '4', '1', '-3', '-2', '2'], 2);
    
    // using actual img textures
    //addBox(this, 0, 0, 0, 200, 200, 200, ['img_dice0', 'img_dice4', 'img_dice1', 'img_dice3', '-img_dice2', 'img_dice2']);
    
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

Dice.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    click : function(mx, my) {

        if (this.hid || !this.enabled) return;

		if (this.btn.click(mx, my)) {

            this.setVisible(false);
            this.enabled = false;

            game.setStat(this.value);
		}
    },
    
    setVisible : function(flag) {

        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].hid = !flag;
        }
    },

    roll : function() {

        this.setVisible(true);

        this.value = Math.floor(rnd() * 5);

        this.rx = this.numbers[this.value].x;
        this.ry = this.numbers[this.value].y + (rnd() * 40) - 20;
        this.rz = this.numbers[this.value].z;

        // drop from height
        this.y = -2000;
        //this.z = -1000;

        // roll it back
        this.rx -= (10 * 50);
        this.ry -= (5 * 50);

        this.rC = 0;
    },
    
    update : function(mx, my) {
        
        if (this.rC >= 0 && this.rC < 50) {

            this.rx += 10;
            this.ry += 5;

            this.rC++;
        }
        else {

            if (this.rC != -1) game.enableTanks();
            this.rC = -1;
        }

        this.y += this.dy;
        this.dy += 5;

        if (this.y > -200) {

            this.y = -200;
            this.dy *= -0.25;

            if (this.dy < 0 && this.dy > -0.1) this.dy = 0;
            //else this.z += 10;
        }

        rotate(this, this.rx * Const.D2R, this.ry * Const.D2R, this.rz * Const.D2R);

        var i;
        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].x = this.yR[i].x + this.x;
            this.pt[i].y = this.yR[i].y + this.y;
            this.pt[i].z = this.yR[i].z + this.z;
        }

        this.btn.x = this.px - 80;
        this.btn.y = this.py - 80;
        this.btn.update(mx, my);
    }
}