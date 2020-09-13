var Tree = function(x, y, z, h) {

    // position
    this.x = x;
    this.y = y;
    this.z = z;
    
    // render position
    this.px = this.py = 0;
    
    // distance from camera
    this.dist = 0;

    this.scale = this.locSc = 1;
	
    this.vis = true;

    this.pt = [];
    this.qd = [];

    this.init(h);
}

Tree.prototype = {

    setScale : function(s) {
		
		this.scale = s;
    },
    
    init : function(h) {

        var c = '#F58023';

        for (var i = 0; i < h + 3; i++) {

            addSprite(this, 0, -120 - (i * 20), 0, i == 0 ? '#42B59A' : '#46BEA2', 120);    
        }

        addBox(this, 0, -35, 0, 40, 70, 40, ['', '', c, c, c, c]);

        // shadow
        addQuad(this, [45, 0, 45], [-45, 0, 45], [-45, 0, -45], [45, 0, -45], 'img_shadow', -1);
    },
    
    update : function() {

        // hide the trunks when viewed from from a high angle
        for (var i = 0; i < this.qd.length; i++) {

            for (var j = 0; j < this.qd[i].length; j++) {

                if (game.isLkDn) this.qd[i][j].hid = true;
                else this.qd[i][j].hid = false;
            }
        }
    }
}