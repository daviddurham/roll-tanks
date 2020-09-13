var Floor = function() {
    
    // position
    this.x = 0;
    this.y = -50;
    this.z = 0;
    
    // render position
    this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;

    this.scale = 1;
    this.locSc = 1;

    this.vis = true;

    this.pt = [];
    this.qd = [];

    // start of the edge quads
    this.edgeStart;

    var col, c1 = '#9CC841', c2 = '#F58023';

    for (var i = -5; i < 5; i ++) {

        for (var j = -5; j < 5; j ++) {

            if ((i + j) % 2 == 0) col = c1;//'test';
            else col = '#BDD549';

            addQuad(this, [(200 * i) - 0, 0, (200 * j) - 0], [(200 * i) + 200, 0, (200 * j) - 0], [(200 * i) + 200, 0, (200 * j) + 200], [(200 * i) - 0, 0, (200 * j) + 200], col, -2);
        }
    }

    // end of the surface quads
    this.edgeStart = this.qd.length;

    addBox(this, 0, 12.5, 0, 2000, 25, 2000, ['', '', c1, c1, c1, c1], -3);
    addBox(this, 0, 62.5, 0, 2000, 75, 2000, ['', '', c2, c2, c2, c2], -3);

    //underwater part
    //addBox(this, 0, 125, 0, 2000, 50, 2000, ['', '', '#644B9E','#644B9E','#644B9E','#644B9E'], -3);
}

Floor.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },

    update : function() {

        // hide the edges when viewed from from a high angle
        for (var i = this.edgeStart; i < this.qd.length; i++) {

            for (var j = 0; j < this.qd[i].length; j++) {

                if (game.isLkDn) this.qd[i][j].hid = true;
                else this.qd[i][j].hid = false;
            }
        }
    }
}