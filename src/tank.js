var Tank = function(x, y, z, col) {

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

    this.vx = new Vector2D();
    this.vy = new Vector2D();

    this.damp = 0.95;
    this.accel = this.speed = 0;
    this.turnSpeed = 2;
    this.moveSpeed = 5;

    this.tur = null;

    this.btn = new Button(0, 0, 80, '', '');
    this.enabled = false;
    this.selected = false;

    this.hp = 1;
    this.sd = 0;

    this.hudAnc = null;

    this.init(col);
}

Tank.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    setVisible : function(flag) {

        var i;

        for (i = 0; i < this.pt.length; i++) this.pt[i].hid = !flag;
        for (i = 0; i < this.tur.pt.length; i++) this.tur.pt[i].hid = !flag;
        for (i = 0; i < this.tur.gun.pt.length; i++) this.tur.gun.pt[i].hid = !flag;
    },
    
    init : function(col) {

        var turretPoint = addSprite(this, 0, 0, 24, '', 50);
        var c1 = '#666';
        var c2 = '#333';
        var c3 = '#444444';

        // body
        addBox(this, 0, -64, 0, 88, 40, 104, [col, '', col, col, col, col]);
        addBox(this, 0, -36, 0, 88, 16, 104, ['', '', c1, c1, c1, c1]);

        // tracks
        addBox(this, 64, -40, 36, 32, 40, 56, [c2, '', c2, c2, c2, c3]);
        addBox(this, 64, -40, -36, 32, 40, 56, [c2, '', c2, c2, c2, c3]);

        addBox(this, -64, -40, 36, 32, 40, 56, [c2, '', c2, c2, c3, c2]);
        addBox(this, -64, -40, -36, 32, 40, 56, [c2, '', c2, c2, c3, c2]);

        // shadow
        addQuad(this, [80, -20, 80], [-80, -20, 80], [-80, -20, -80], [80, -20, -80], '#000', -1, 0.2);

        this.hudAnc = addSprite(this, 0, -150, 0, '', 50);

        for (var i = 0; i < this.pt.length; i++) {

            var vx = this.pt[i].x - this.x;
            var vy = this.pt[i].y - this.y;
            var vz = this.pt[i].z - this.z;

            this.uR.push({x: vx, y: vy, z: vz});
            this.zR.push({x: vx, y: vy, z: vz});
            this.yR.push({x: vx, y: vy, z: vz});
            this.xR.push({x: vx, y: vy, z: vz});
        }

        this.tur = new TankTurret(turretPoint);
    },
    
    click : function(mx, my) {

        if (!this.enabled) return;
        
		if (this.btn.click(mx, my)) {

            this.selected = true;
            game.selectTank(this);
		}
    },

    update : function(mx, my, inX, inY) {

        if (game.gS == 1 || game.title) {

            if (game.stats[0] > 0 || game.title) {

                if (inX > 0) {
                        
                    this.ry += 1;

                    if (this.ry >= 360) {
                        
                        this.ry -= 360;
                        game.cam.ry -= 360 * Const.D2R * 2;
                    }

                    game.stats[0] -= 0.005;
                }
                else if (inX < 0) {

                    this.ry -= 1;
                    if (this.ry < 0) {
                        
                        this.ry += 360;
                        game.cam.ry += 360 * Const.D2R * 2;
                    }

                    game.stats[0] -= 0.005;
                }

                if (inY > 0) {

                    this.accel = -0.1;
                    this.damp = 0.95;

                    game.stats[0] -= 0.005;
                }
                else if (inY < 0) {

                    this.accel = 0.1;
                    this.damp = 0.95;

                    game.stats[0] -= 0.005;
                }
                else {

                    this.accel = 0;
                    this.damp = 0.85;
                }
            }
            else {

                game.stats[0] = 0;

                game.gS = 2;
                game.setArcVisible(true);
            }
        }
        else if (game.gS == 2) {

            this.accel = 0;
            this.damp = 0.85;

            if (inX > 0) {
                
                this.tur.ry += 2;
                if (this.tur.ry > 360) this.tur.ry -= 360;
            }
            else if (inX < 0) {
    
                this.tur.ry -= 2;
                if (this.tur.ry < 0) this.tur.ry += 360;
            }

            if (inY > 0) {
                
                this.tur.gun.rx += 1;
            }
            else if (inY < 0) {
    
                this.tur.gun.rx -= 1;
            }
        }

        this.speed += this.accel;
        this.speed *= this.damp;

        rotate(this, this.rx * Const.D2R, this.ry * Const.D2R, this.rz * Const.D2R);

        var i;
        for (var i = 0; i < this.pt.length; i++) {
    
            this.pt[i].x = this.yR[i].x + this.x;
            this.pt[i].y = this.yR[i].y + this.y;
            this.pt[i].z = this.yR[i].z + this.z;
        }

        // move!
        this.vx.vector(this.ry);
        
        var dx = this.vx.x * this.speed * this.moveSpeed;
        var dz = this.vx.y * -this.speed * this.moveSpeed;
        var dy = 0;

        var canMove = true;

        for (i = 0; i < game.fl.length; i++) {

            if (!Col.aabb(this.x + dx, this.z + dz, 0, 0, game.fl[i].x, game.fl[i].z, 1850, 1850)) {

                canMove = false;
                break;
            }
        }

        /*
        if (canMove) {

            for (i = 0; i < game.tm1.length; i++) {

                if (game.tm1[i] == game.p) break;

                if (Col.aabb(this.x + dx, this.z + dz, 150, 150, game.tm1[i].x, game.tm1[i].z, game.tm1[i].w, game.tm1[i].d)) {

                    canMove = false;
                    break;
                }
            }
        }

        if (canMove) {

            for (i = 0; i < game.tm2.length; i++) {

                if (game.tm2[i] == game.p) break;
                
                if (Col.aabb(this.x + dx, this.z + dz, 150, 150, game.tm2[i].x, game.tm2[i].z, game.tm2[i].w, game.tm2[i].d)) {

                    canMove = false;
                    break;
                }
            }
        }
        */

        if (canMove) {

            for (i = 0; i < game.trees.length; i++) {

                if (Col.aabb(this.x + dx, this.z + dz, 150, 150, game.trees[i].x, game.trees[i].z, 50, 50)) {

                    canMove = false;
                    break;
                }
            }
        }

        if (canMove) {

            this.x += dx;
            this.z += dz;
        }

        if (Col.aabb(this.x, this.z, 150, 150, game.pUp.x, game.pUp.z, 50, 50)) {

            game.collectHealth(this);
        }

        // offset position of sprites
        for (var i = 0; i < this.pt.length; i++) {

            this.pt[i].x += dx;
            this.pt[i].y += dy;
            this.pt[i].z += dz;
        }

        this.tur.update(inX, inY, this.rx, this.ry, this.rz);

        this.btn.x = this.px - 40;
        this.btn.y = this.py - 40;
        this.btn.update(mx, my);
    },

    draw : function() {

        if (this.selected && game.isMapCam) {

            ctx.beginPath();
            ctx.arc(this.px * scale, this.py * scale, 45 * scale, 0, Const.PI2);	
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 10 * scale;
            ctx.stroke();
        }

        //this.btn.draw();

        if (!game.title && this.hp > 0) {

            drawText(Math.ceil(this.hp * 10), this.hudAnc.px + 80, this.hudAnc.py, 28, 0, '#fff', 'left');
            if (this.sd > 0) drawText(Math.ceil(this.sd * 10), this.hudAnc.px + 80, this.hudAnc.py + 40, 28, 0, '#fff', 'left');

            ctx.save();
            ctx.translate((this.hudAnc.px + 40) * scale, (this.hudAnc.py - 22) * scale);
            ctx.scale(0.3 * scale, 0.3 * scale);
            ctx.fillStyle = "#EF5181";
            ctx.fill(new Path2D(d="M110 35Q110 18 99 8 90 1 79 1 75 1 69 3 61 6 56 12L55 13Q51 7 44 4 37 0 31 0 18 0 9 10 0 20 0 34 0 48 8 57 12 62 19 69 29 77 36 83 47 94 50 96 54 100 56 100 57 100 69 90 84 78 96 65 104 56 107 49 110 43 110 35"));
            ctx.restore();

            if (this.sd > 0) {
                
                ctx.save();
                ctx.translate((this.hudAnc.px + 40) * scale, (this.hudAnc.py + 16) * scale);
                ctx.scale(0.3 * scale, 0.3 * scale);
                ctx.fillStyle = "#8E56A1";
                ctx.fill(new Path2D(d="M103 12Q94 8 82 4 66 0 55 0 46 0 34 2 18 5 7 12L7 59Q5 73 39 98 44 101 51 107 54 110 56 110 56 110 65 103 78 92 86 86 95 79 100 71 103 64 103 60L103 12"));
                ctx.restore();
            }
        }
    }
}