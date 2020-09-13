var HUD = function() {
	
	this.paused = new PausePanel(840, 320);
	
	var rt = Math.min(1680, (window.innerWidth - originX) * (1 / scale));
	//var lf = Math.max(0, (0 - originX) * (1 / scale));

	// pause button
	this.bPause = new Button(rt - 94, 30, 64, 'II');

	this.touch = new TouchControls();

	this.turnMessage = ['PLAYER TURN', 'ENEMY TURN'];
	this.winMsg = ['DEFEAT', 'VICTORY!'];
	this.prompt = ['', 'Click on a RED tank to select it', 'Click on a dice to set FUEL level', 'Click on a dice to set firing INNACUARCY', 'Click on a dice to set SHIELD strength', 'Move with ARROW KEYS then press SPACEBAR', 'Aim then fire with the SPACEBAR'];
	this.promptT = ['', 'Tap on a RED tank to select it', 'Tap a dice to set FUEL level', 'Tap a dice to set firing INACCURACY', 'Tap a dice to set SHIELD strength', 'Move with DIRECTION buttons then press ACTION button', 'Aim then fire with the ACTION button'];
	this.currPrompt = 0;

	this.t = 0;
	this.t2 = 5;
}

HUD.prototype = {
	
	setScore : function(val) {
		
		this.score = val;
	},
	
	click : function(mx, my) {

		if (this.bPause.click(mx, my)) {

			game.isRunning = false;
			this.paused.vis = true;
			this.bPause.vis = false;
		}

		if (this.paused.vis) {

			this.paused.click(mx, my);
		}

		if (this.touch.v) {

			this.touch.click(mx, my);
		}
	},

	press : function(mx, my) {

		if (this.touch.v) {

			this.touch.press(mx, my);
		}
	},

	release : function() {

		this.bPause.release();
		this.touch.release();
	},
	
	setPrompt : function(p) {

		this.currPrompt = p;
	},

	draw : function() {
		
		if (this.paused.vis) {

			this.paused.draw();
		}
		else {
		
			this.bPause.draw();
			this.touch.draw();
		}

		if (this.t > 1) {

			if (this.t <= 3) {

				var h = Math.min((8 - (this.t * 3)) * 260, 260);

				if (h > 0) {
					
					ctx.fillStyle = "#000";
					ctx.fillRect(0, (360 - (h / 2)) * scale, Math.min(1680, (this.t - 1) * 4000) * scale, h * scale);
				}

				if (this.t > 1.5 && this.t < 2.5) {
				
					drawText(this.turnMessage[game.turn - 1], 840, 360, 96, 0);
					drawText('Round ' + game.round, 840, 440, 48, 0);
				}
			}
			else if (this.t < 4) {

				this.t = 5;
				game.roll();
			}
		}

		// victory/defeat message
		if (this.t2 > 1) {

			if (this.t2 <= 3) {

				var h = Math.min((8 - (this.t2 * 3)) * 260, 260);

				if (h > 0) {
					
					ctx.fillStyle = "#000";
					ctx.fillRect(0, (360 - (h / 2)) * scale, Math.min(1680, (this.t2 - 1) * 4000) * scale, h * scale);
				}

				if (this.t2 > 1.5 && this.t2 < 2.5) {
				
					drawText(this.winMsg[game.win], 840, 400, 128, 0);
				}
			}
			else if (this.t2 < 4) {

				this.t2 = 5;
				quitGame();
			}
		}

		if (game.p != null) {

			var lf = Math.max(0, (0 - originX) * (1 / scale));

			ctx.font = 'bold ' + (36 * scale) + 'px Arial';
	    	ctx.textAlign = 'left';
	    	ctx.fillStyle = '#fff';
			
        	ctx.fillText('INACCURACY ' + game.stats[1], (lf + 20) * scale, (50) * scale);
			
			if (game.stats[0] > 0/* && game.gS < 2 && game.p != null*/) {

				drawText(Math.floor(game.stats[0]), lf + 20, 680, 200, 0, '#fff', 'left');
				drawText((1 * game.stats[0]).toFixed(2).toString().substring(1), lf + 130, 680, 100, 0, '#fff', 'left')
			}
		}

		if (game.round == 1 && game.turn == 1) {
			
			var ty = this.currPrompt < 5 ? 460 : 120;

			if (isTouch) drawText(this.promptT[this.currPrompt], 840, ty, 36);
			else drawText(this.prompt[this.currPrompt], 840, ty, 36);
		}
	},
	
	update : function(mx, my) {
		
		this.paused.update(mx, my);
		this.bPause.update(mx, my);
		this.touch.update(mx, my);

		if (this.t < 5) {

			if (!game.title && game.isMapCam) {

				this.t += 0.0333;
			}
		}

		if (this.t2 < 5) {

			this.t2 += 0.0333;
		}
	}
}