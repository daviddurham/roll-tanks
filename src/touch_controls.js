var TouchControls = function() {

	var rt = Math.min(1680, (window.innerWidth - originX) * (1 / scale));
	var lf = Math.max(0, (0 - originX) * (1 / scale));

	this.left = new Button(lf + 125, 720 - 300, 80, "");
	this.right = new Button(lf + 275, 720 - 300, 80, "");
	this.up = new Button(lf + 200, 720 - 375, 80, "");
	this.down = new Button(lf + 200, 720 - 225, 80, "");
	
	this.confirm = new Button(rt - 225, 720 - 300, 100, "A");
	
	// visible?
	this.v = isTouch;

	this.btns = [this.left, this.right, this.up, this.down, this.confirm];
}

TouchControls.prototype = {
	
	click : function(mx, my) {

		if (this.confirm.click(mx, my)) game.action();
	},

	press : function(mx, my) {

		for (var i = 0; i < this.btns.length; i++) this.btns[i].press(mx, my);
	},

	release : function() {

		for (var i = 0; i < this.btns.length; i++) this.btns[i].release();
	},

	update : function(mx, my) {
		
		for (var i = 0; i < this.btns.length; i++) this.btns[i].update(mx, my);
	},
	
	draw : function() {
		
		if (this.v && !game.isMapCam && game.turn == 1) {

			for (var i = 0; i < this.btns.length; i++) this.btns[i].draw();
		}
	}
}