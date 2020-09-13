var PausePanel = function(x, y) {

	this.x = x || 0;
	this.y = y || 0;
	
	this.w = 480;
    this.h = 240;
    
    this.ox = this.w / 2;
    this.oy = this.h / 2;
	
	this.vis = false;

	this.bResume = new Button((this.x - 50) + 80, this.y - 25, 100, ">");
	this.bQuit = new Button((this.x - 50) - 80, this.y - 25, 100, "X");
}

PausePanel.prototype = {
	
	click : function(mx, my) {
		
		if (this.bQuit.click(mx, my)) {
			
			//game.music.stop();
			quitGame();
		}
		
		if (this.bResume.click(mx, my)) {

			game.isRunning = true;
			this.vis = false;

			game.hud.bPause.vis = true;
		}
	},
	
	draw : function() {
		
		if (this.vis) {
            
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = "#000";
            ctx.fillRect(Math.floor((this.x - this.ox) * scale), Math.floor((this.y - this.oy + 10) * scale), Math.floor(this.w * scale), Math.floor(this.h * scale));
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#444";
            ctx.fillRect(Math.floor((this.x - this.ox) * scale), Math.floor((this.y - this.oy) * scale), Math.floor(this.w * scale), Math.floor(this.h * scale));

			drawText('PAUSED', this.x, this.y - 60, 48, 0);

			this.bQuit.draw();
			this.bResume.draw();
		}
	},

	update : function(mx, my) {
		
		this.bQuit.update(mx, my);
		this.bResume.update(mx, my);
	}
}