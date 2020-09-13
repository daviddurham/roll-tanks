var Game = function(title) {

	// drive a tank around while the title is shown
	this.title = title;
	
	// pause flag
	this.isRunning = true;

	// create an array to keep track of all the objects in the scene
	// to position all the objects you just need to loop through it
	this.objs = [];

	// list of quads (sets of 4 points) in the scene
	this.qd = [];

	// define the camera with position and rotation
	this.cam = {x: 0, y: 0, z: 0, ry: 0, rx: 0};

	// is looking down
	this.isLkDn = false;

	this.isMapCam = true;//false;
	this.mapCam = {x: 0, y: -2000, z:0, ry: 0, rx: Math.PI / 2};
	
	// rotation targets
	this.rxT = this.ryT = 0;

	// focal length to determine perspective scaling
	this.focalLength = 800;
	
	// tanks
	this.p = null;

	// dice
	this.dice = [];

	// stats (move, error, power)
	this.stats = ['','',''];
	this.currStat = 0;

	// far background
	this.clouds = null;

	this.fl = [];
	this.trees = [];
	//this.walls = [];

	this.tm1 = [];
	this.tm2 = [];

	this.arc = null;
	this.shell = null;
	this.shad = null;
	this.exp = null;

	this.pUp = null;

	this.hud = new HUD();
	//this.music = new Music();
	
	// inputs
	this.inputs = [0, 0, 0, 0, 0];
	this.inX = this.inY = 0;

	// 0 - waiting/disabled, 1 - moving, 2 - firing 
	this.gS = 0;

	// the turn number
	this.round = 1;

	// who's turn (1 = player, 2 = enemy)
	this.turn = 1;
	
	// currently active tank
	this.currTank = -1;

	// the tank the enemy is targetting
	this.eTar = -1;

	// AI rotate to angle
	this.eToR = 0;

	// AI turn direction
	this.eTD = 1;

	// AI turret elevation
	this.eToL = 0
	this.eTL = 1;

	this.eTurn = true;
	
	this.tanksOn = false;
	this.win = -1;

	this.getHealth = false;

	// let the game play itself :)
	this.autoplay = false;//true;
}

Game.prototype = {
	
	init : function() {

		// add floor squares
		var f = new Floor();
		this.fl.push(f);
		this.addObj(f);

		// add a randomized wall
		/*
		var x = Math.floor(rnd() * 500) - 300;
		var z = Math.floor(rnd() * 500) - 300;
		var i, w = 500, d = 50, tmp;
		
		if (rnd() > 0.5) {

			tmp = d;
			d = w;
			w = tmp;
		}

		var wl = new Wall(x, -50, z, w, d);
		this.walls.push(wl);
		this.addObj(wl);
		*/

		for (i = 0; i < 3; i++) {

			var d = new Dice(-600 + (i * 600), -200, 0);
			this.dice.push(d);
			this.addObj(d);

			d.setVisible(false);
		}

		this.clouds = new Clouds(0, 0);
		this.clouds.init(this.objs);

		// all the tank positions (first half is player team)
		var tanks = this.title ? [{x: -500, z: 100, r:0}] : [{x: -500, z: -550, r:20}, {x: 500, z: -550, r:340}, {x: -600, z: 500, r:160}, {x: 600, z: 500, r:200}, {x: 0, z: 700, r:180}];
		var t, t1 = 2;

		for (i = 0; i < tanks.length; i++) {

			if (i < t1) {
			
				t = new Tank(tanks[i].x, -30, tanks[i].z, '#EC1C5A');
				this.tm1.push(t);
			}
			else {

				t = new Tank(tanks[i].x, -30, tanks[i].z, '#644B9E');
				t.enabled = t.btn.vis = false;
				this.tm2.push(t);
			}

			t.ry = tanks[i].r;// * Const.D2R;

			this.addObj(t);
			this.addObj(t.tur);
			this.addObj(t.tur.gun);
		}

		var tr = [{x:-100, z:200}, {x:200, z:-200},{x:-400, z:-700}, {x:-800, z:-200},{x:300, z:700},{x:700, z:-300},{x:0, z:-800},{x:200, z:-700},{x:800, z:800},{x:800, z:600}];

		for (i = 0; i < tr.length; i++) {

			var h = Math.floor(rnd() * 5) + 5;
			
			// add a tree
			t = new Tree(tr[i].x, -50, tr[i].z, h);
			this.trees.push(t);
			this.addObj(t);
		}

		this.arc = new Arc(this.tm1[0].tur.gun.firePoint);
		this.arc.setVisible(false);
		this.addObj(this.arc);

		this.shell = new Shell();
		this.addObj(this.shell);

		this.shad = new Shadow();
		this.shad.setVisible(false);
		this.addObj(this.shad);

		this.exp = new Explosion();
		this.addObj(this.exp);

		this.pUp = new Health(0, 0);
		this.addObj(this.pUp);
		
		if (this.title) {
			
			this.pUp.setVisible(false);
			this.bPlay = new Button(840 - 55, 330, 110, ">");
		}
	},

	// objects are made up of points and quads
	addObj : function(obj) {

		var i;

		for (i = 0; i < obj.pt.length; i++) {

			this.objs.push(obj.pt[i]);
		}

		if (obj.qd) {
		
			for (i = 0; i < obj.qd.length; i++) {

				this.qd.push(obj.qd[i]);
			}
		}
	},

	// set the positions of the point sprites
	drawObj : function(obj) {

		var x, y, z, tx, ty, tz;

		// shift all coordinates values with the camera
		x = obj.x - this.cam.x;
		y = obj.y - this.cam.y;
		z = obj.z - this.cam.z;
		
		// rotation around y axis
		var angle = this.cam.ry / 2;
		tx = Math.cos(angle) * x - Math.sin(angle) * z;
		tz = Math.sin(angle) * x + Math.cos(angle) * z;
		
		// the temporary variables are used because x needs 
		// to be the original x and not the x just calculated
		x = tx;
		z = tz;
		
		// rotation around x axis
		angle = this.cam.rx;

		ty = Math.cos(angle) * y - Math.sin(angle) * z;
		tz = Math.sin(angle) * y + Math.cos(angle) * z;
		y = ty;
		z = tz;

		obj.dist = z;

		var scaleRatio = this.focalLength / (this.focalLength + z);
		
		if (!obj.lockX) obj.px = (x * scaleRatio) + (840);
		obj.py = (y * scaleRatio) + (360);

		if (!obj.lockScale) obj.setScale(scaleRatio);

		// 'hidden' is used to turn off things we don't want to render
		// 'visible' is for active objects that are just out of view etc.
		if (obj.hid) {

			obj.vis = false;
		}
		// check to make sure you're in front of the camera
		// adding a bit of tolerance for now...
		else if (z > 0 || Math.abs(z) < 800) {

			// being drawn offscreen? (again a bit of tolerance)
			obj.vis = obj.px > Const.W + 300 || obj.px < -300 || obj.py > Const.H + 500 || obj.py < -500 ? false : true;
		}
		else {

			// if not in front of the camera, hide
			obj.vis = false;
		}
	},

	action : function() {

		// enemy turn - no input
		if (this.turn == 2) return;

		// if we're in moving state - move to firing state
		if (this.gS == 1) {

			this.gS = 2;

			this.hud.currPrompt++;
			this.setArcVisible(true);
		}
		// if we're in firing state... FIRE!
		else if (this.gS == 2) {

			this.hud.currPrompt = 0;
			this.setArcVisible(false);

			// apply targetting error
			var err1 = Math.floor(rnd() * this.stats[1] * 2) - this.stats[1];
			var err2 = Math.floor(rnd() * this.stats[1] * 2) - this.stats[1];

			// fire!
			this.shell.fire(this.arc.x, this.arc.y, this.arc.z, this.p.rx + this.p.tur.rx + this.p.tur.gun.rx + err1, this.p.ry + this.p.tur.ry + this.p.tur.gun.ry + err2);
			this.shad.setVisible(true);
			this.gS = 0;
		}
	},

	setArcVisible: function(flag) {

		if (flag) this.arc.anc = this.p.tur.gun.firePoint;
		this.arc.setVisible(flag);
	},

	roll : function() {

		this.tanksOn = false;
		for (var i = 0; i < this.dice.length; i++) this.dice[i].roll();

		this.exp.setVisible(false);

		// clear shields for this team
		if (this.turn == 1) for (i = 0; i < this.tm1.length; i++) this.tm1[i].sd = 0;
		else for (i = 0; i < this.tm2.length; i++) this.tm2[i].sd = 0;

		// show health pickup
		this.pUp.setVisible(true);
	},

	collectHealth : function(tank) {

		if (tank.hp < 1 && tank.hp > 0) {
			
			// boost health
			tank.hp+=0.1;

			// move pickup
			var i, hit = true;

			while (hit) {

				this.pUp.x = (rnd() * 1000) - 450;
				this.pUp.z = (rnd() * 1000) - 450;

				var h = false;

				if (Col.aabb(tank.x, tank.z, 1000, 1000, this.pUp.x, this.pUp.z, 50, 50)) h = true;

				for (i = 0; i < this.fl.length; i++) {

					if (!Col.aabb(this.x, this.z, 0, 0, game.fl[i].x, game.fl[i].z, 1850, 1850)) h = true;
				}

				for (i = 0; i < this.tm1.length; i++) {

					if (Col.aabb(this.tm1[i].x, this.tm1[i].z, 250, 250, this.pUp.x, this.pUp.z, 50, 50)) h = true;
				}
				
				for (i = 0; i < this.tm2.length; i++) {
				
					if (Col.aabb(this.tm2[i].x, this.tm2[i].z, 250, 250, this.pUp.x, this.pUp.z, 50, 50)) h = true;
				}

				for (i = 0; i < game.trees.length; i++) {

					if (Col.aabb(game.trees[i].x, game.trees[i].z, 50, 50, this.pUp.x, this.pUp.z, 50, 50)) h = true;
				}

				hit = h;
			}

			this.pUp.setVisible(false);
		}
	},

	onShot : function() {

		// no winner yet?
		if (this.win < 0) {

			// next player
			this.p = null;
			this.stats = ['','',''];

			if (++this.turn > 2) {
				
				this.turn = 1;
				this.round++;
			}

			this.isMapCam = true;
			this.hud.t = 0;
		}
	},

	explode : function(x, y, z) {

		this.exp.explode(x, y, z);

		// damage tanks
		this.damage(x, z, this.tm1);
		this.damage(x, z, this.tm2);

		this.shad.setVisible(false);
	},

	damage : function(x, z, team) {

		// damage tanks
		var i, d, dmg;

		for (i = 0; i < team.length; i++) {

			d = Col.circle(team[i].x, team[i].z, 1, x, z, 256);

			// was hit?
			if (d <= 0) {

				// a direct hit will take 50% HP (n/256/2 = n/512)
				dmg = Math.sqrt(Math.abs(d)) / 512;

				// shield takes damage first
				if (team[i].sd > 0) { 
				
					team[i].sd -= dmg;

					// if shield depleted, remaining damage take off hp
					if (team[i].sd < 0) {
						
						dmg = -1 * team[i].sd;
						team[i].sd = 0;
					}

					team[i].sd = team[i].sd;
				}

				if (team[i].hp > 0) {
				
					// take damage and cap at zero
					team[i].hp = Math.max(0, team[i].hp - dmg);
					if (team[i].hp <= 0) this.kill(team[i]);
				}
			}
		}
	},

	kill : function(tank) {

		tank.setVisible(false);

		// check for win/loss
		var i, t1 = 0, t2 = 0;
		
		for (i = 0; i < this.tm1.length; i++) t1 += this.tm1[i].hp;
		for (i = 0; i < this.tm2.length; i++) t2 += this.tm2[i].hp;

		if (t1 <= 0) this.result(0);
		else if (t2 <= 0) this.result(1);
	},

	result : function(win) {

		this.win = win;
		this.hud.t2 = 0;
	},
	
	setKey : function(key, state) {

		if (key == 37 || key == 65 || key == 81) {	// 81 is Q
		
			// left
			this.inputs[2] = -state;
		}
		else if (key == 39 || key == 68) {
			
			// right
			this.inputs[3] = state;
		}
		else if (key == 38 || key == 87 || key == 90) {	// 90 is Z
		
			// up
			this.inputs[0] = -state;
		}
		else if (key == 40 || key == 83) {
			
			// down
			this.inputs[1] = state;
		}

		// action
		if (key == 32) {

			if (!this.inputs[4]) this.action();
			this.inputs[4] = state;
		}
	},

	setInputs: function() {

		this.inX = this.inputs[2] + this.inputs[3];
		this.inY = this.inputs[0] + this.inputs[1];
	},

	keyDn : function(key) {
		
		this.setKey(key, 1);
		this.setInputs();
	},
	
	keyUp : function(key) {
		
		this.setKey(key, 0);
		this.setInputs();
	},
	
	msDn : function() {
	
		this.hud.press(mPos.x, mPos.y);
	},
	
	msUp : function() {

		if (this.bPlay) {

			if (this.bPlay.click(mPos.x, mPos.y)) {
		
				/*
				if (audioCtx) {

					// Create empty buffer
					var b = audioCtx.createBuffer(1, 1, 22050);
					var s = audioCtx.createBufferSource();
					
					s.buffer = b;
					s.connect(audioCtx.destination);
		
					// Play sound
					if (s.start) {
		
						s.start(0);
					}
				}
				*/

				lev = 2;
				startGame();
			}
		}

		this.hud.click(mPos.x, mPos.y);
		this.hud.release();

		var i;
		for (i = 0; i < this.dice.length; i++) this.dice[i].click(mPos.x, mPos.y);
		for (i = 0; i < this.tm1.length; i++) this.tm1[i].click(mPos.x, mPos.y);
	},

	enableTanks : function() {

		if (this.tanksOn) return;

		// this is called from each dice, so only let it be called once
		this.tanksOn = true;

		// reset health targetting flag
		this.getHealth = false;

		var i, j, k, tl = this.tm1.length;

		if (this.turn == 1 && !this.autoplay) {

			// enable tank buttons
			for (i = 0; i < tl; i++) {
				
				if (this.tm1[i].hp > 0) {
				
					this.tm1[i].enabled = this.tm1[i].btn.vis = true;
				}
			}

			this.hud.currPrompt = 1;
		}
		else {

			var en = this.turn == 1 ? this.tm2 : this.tm1;
			var al = this.turn == 1 ? this.tm1 : this.tm2;
			
			tl = en.length;

			// enemy picks target...
			// which tank on player team has lowest hp
			this.eTar = Math.floor(rnd() * tl);
			this.eTurn = true;

			for (i = 0; i < tl; i++) {

				// find the lowest HP (that isn't zero)
				if (en[i].hp < en[this.eTar].hp || en[this.eTar].hp <= 0) {

					if (en[i].hp > 0) this.eTar = i;
				}
			}

			var d1, d2;
			
			// enemy tank
			var et = 0;

			// now target is picked, choose the tank closest to it
			for (i = 0; i < al.length; i++) {

				// low hp? choose this tank
				if (al[i].hp <= 0.5 && al[i].hp > 0) {

					et = i;
					break;
				}
				
				if (al[i].hp > 0) {

					d1 = new Vector2D(al[et].x - en[this.eTar].x, al[et].x - en[this.eTar].x);
					d2 = new Vector2D(al[i].x - en[this.eTar].x, al[i].x - en[this.eTar].x);
					
					if (d2.magnitude() < d1.magnitude() || al[et].hp <= 0) {

						et = i;
					}
				}
			}

			this.p = al[et];

			var done = false;

			// find a bearing
			for (i = 0; i < 360; i++) {

				var dist = 1500;
				var v = new Vector2D();
				v.vector(i);

				var blocked = false;

				for (j = 1; j < dist; j += 50) {
				
					var tx = this.p.x + (v.x * j);
					var tz = this.p.z - (v.y * j);

					for (k = 0; k < this.fl.length; k++) {

						if (!Col.aabb(tx, tz, 50, 50, this.fl[k].x, this.fl[k].z, 1850, 1850)) {

							// break and try next angle...
							blocked = true;
							break;
						}
					}

					/*
					for (k = 0; k < game.walls.length; k++) {

						if (Col.aabb(tx, tz, 50, 50, game.walls[k].x, game.walls[k].z, game.walls[k].w, game.walls[k].d)) {

							blocked = true;
							break;
						}
					}
					*/
					
					for (k = 0; k < this.trees.length; k++) {

						if (Col.aabb(tx, tz, 100, 100, this.trees[k].x, this.trees[k].z, 100, 100)) {

							blocked = true
							//console.log("hit tree");
							break;
						}
					}

					if (!blocked) {

						// go for the health when less than 9
						if (this.p.hp < 0.9) {

							// still not blocked and target range reached?
							if (Col.circle(tx, tz, 1, this.pUp.x, this.pUp.z, 100) <= 0) {

								this.eToR = i;
								
								// set turn direction
								this.eTD = this.p.ry > this.eToR ? this.eTD = -1 : 1;
								
								this.getHealth = true;
								done = true;
								break;
							}
						}
						

						// still not blocked and target range reached?
						if (Col.circle(tx, tz, 1, en[this.eTar].x, en[this.eTar].z, 400) <= 0) {

							this.eToR = i;
							
							// set turn direction
							this.eTD = this.p.ry > this.eToR ? this.eTD = -1 : 1;
							
							this.getHealth = false;
							done = true;
							break;
						}
					}
				}

				// has angle been found?
				if (done) break;
			}

			if (!done) console.log("path not found");

			// set stats
			for (i = 0; i < 3; i++) {

				this.selectDice(i);
			}
		}
	},

	selectDice : function(dice) {

		var sc = this;

		var o = [0, 1, 2];
		o.sort(function(a, b){return sc.dice[a].value - sc.dice[b].value});
		o.reverse();

		var a = o[2];
		o[2] = o[1];
		o[1] = a;

		setTimeout(function() { 
				
			sc.setStat(sc.dice[o[dice]].value);
			sc.dice[o[dice]].setVisible(false);

		}, 500 * (dice + 1));
	},

	enableDice : function() {

		var i;

		this.tanksOn = false;

		for (i = 0; i < this.dice.length; i++) this.dice[i].enabled = true;
	},

	selectTank : function(tank) {

		// here's where we set the active tank
		this.p = tank;

		// disable tank buttons
		for (var i = 0; i < this.tm1.length; i++) {
			
			this.tm1[i].enabled = this.tm1[i].btn.vis = false;
		}

		this.enableDice();
		this.hud.setPrompt(2);
	},

	setStat : function(val) {

		var i;

		this.stats[this.currStat] = val;
		
		// set shield
		if (this.currStat == 2) this.p.sd = val * 0.1;
		
		this.currStat++;

		this.hud.currPrompt = this.currStat + 2;

		// all stats set?
		if (this.currStat > 2) {

			// go to tank
			game.isMapCam = false;
			game.gS = 1;
			this.currStat = 0;

			for (i = 0; i < this.tm1.length; i++) this.tm1[i].selected = false;
			for (i = 0; i < this.tm2.length; i++) this.tm2[i].selected = false;

			this.hud.setPrompt(5);
		}
	},

	// the function making it all happen
	updateScene : function () {

		var i, j, k, l;

		// use the mouse to rotate the camera left and right
		//this.cam.ry += (mPos.x - (840 * scale)) / 2000;
		
		// use the mouse to rotate the camera up and down
		//this.cam.rx += (mPos.y - (360 * scale)) / 10000;

		// distant clouds (lock centre to camera position)
		this.clouds.update(0, 0);

		// update objects in scene (their root positions - don't remove!)
		for (i = 0; i < this.objs.length; i++) this.drawObj(this.objs[i]);

		// update root positions of objects?
		// i'm not sure why i need to do this anymore!?
		for (i = 0; i < this.tm1.length; i++) this.drawObj(this.tm1[i]);
		for (i = 0; i < this.tm2.length; i++) this.drawObj(this.tm2[i]);
		for (i = 0; i < this.dice.length; i++) this.drawObj(this.dice[i]);

		this.drawObj(this.arc);
		this.drawObj(this.shell);
		this.drawObj(this.shad);
		this.drawObj(this.exp);
		this.drawObj(this.pUp);

		// draw sky first (updated based on cloud position)
		if (this.cam.rx < 0.5) this.clouds.sky.draw();

		// sort based on distance from camera
		this.objs.sort(this.zSort);

		// check for quads
		var quadsDrawn = [];

		// draw 3D objects
		for (i = 0; i < this.objs.length; i++) {

			var isQuad = false;

			// is this point part of a quad?
			for (j = 0; j < this.qd.length; j++) {

				// already drawn quad?
				var isQuadDrawn = false;

				for (k = 0; k < 4; k++) {

					// is this sprite any of the points on this quad?
					if (this.objs[i] == this.qd[j][k]) {

						for (l = 0; l < quadsDrawn.length; l++) {

							if (j == quadsDrawn[l]) {
								
								isQuadDrawn = true;
								isQuad = true;
								break;
							}
						}

						if (isQuadDrawn) break;

						// draw the quad
						this.drawQuad(this.qd[j], false);

						// mark this quad as drawn
						quadsDrawn.push(j);
						isQuad = true;
						break;
					}
				}
			}

			if (!isQuad) {
				
				this.objs[i].draw();
			}
		}
	},

	drawQuad : function(quad) {

		var i;

		// don't draw the quad if any points are not visible;
		for (i = 0; i < 4; i++) {
			
			if (!quad[i].vis) return;
		}

		if (quad[0].col.charAt(0) != '#') {

			this.drawTexturedQuad(quad);
			return;
		}

		ctx.fillStyle = quad[0].col;

		if (quad[0].a < 1) ctx.globalAlpha = quad[0].a;

		ctx.beginPath();
		ctx.moveTo(Math.floor((quad[3].px + quad[3].ox) * scale), Math.floor((quad[3].py + quad[3].ox) * scale));
		
		for (i = 0; i < 4; i++) {

			ctx.lineTo(Math.floor((quad[i].px + quad[i].ox) * scale), Math.floor((quad[i].py + quad[i].ox) * scale));
		}

		ctx.fill();
		ctx.closePath();

		if (quad[0].a < 1) ctx.globalAlpha = 1;
	},

	drawTexturedQuad : function(quad) {

		var i, tex, t = quad[0].col, xFlip = 0;
		var w = 128, h = 128;

		// split the quad into triangles
		var tris = [[0, 1, 2], [2, 3, 0]];

		// flipped?
		if (t.charAt(0) == "-") {

			t = t.substr(1);
			xFlip = 1;
		}

		// number texture? render as text
		if (!isNaN(t)) {

			ctx.font = "bold " + w + "px sans-serif";
			ctx.textAlign = "center";
			ctx.fillStyle = "#333";
		}
		else if (t == '+')
		{
			ctx.font = "bold " + w + "px sans-serif";
			ctx.textAlign = "center";
			ctx.fillStyle = "#46BEA2";
		}
		else {
		
			// define texture in color value of the points in the quad
			tex = document.getElementById(t);
			w = tex.width;
			h = tex.height;
		}
	
		for (i = 0; i < 2; i++) {
		
			var pp = tris[i];

			var x0 = (quad[pp[0]].px + quad[pp[0]].ox) * scale;
			var y0 = (quad[pp[0]].py + quad[pp[0]].oy) * scale;
			var x1 = (quad[pp[1]].px + quad[pp[1]].ox) * scale;
			var y1 = (quad[pp[1]].py + quad[pp[1]].oy) * scale;
			var x2 = (quad[pp[2]].px + quad[pp[2]].ox) * scale;
			var y2 = (quad[pp[2]].py + quad[pp[2]].oy) * scale;

			var u0 = Math.abs(quad[pp[0]].u - xFlip) * w, u1 = Math.abs(quad[pp[1]].u - xFlip) * w, u2 = Math.abs(quad[pp[2]].u - xFlip) * w;
			var v0 = quad[pp[0]].v * h, v1 = quad[pp[1]].v * h, v2 = quad[pp[2]].v * h;

        	// set clipping area so that only pixels inside the triangle will
        	// be affected by the image drawing operation
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(Math.floor(x0), Math.floor(y0));
			ctx.lineTo(Math.floor(x1), Math.floor(y1));
			ctx.lineTo(Math.floor(x2), Math.floor(y2)); 
			ctx.closePath();
			ctx.clip();

        	// compute matrix transform... thanks stack overflow :)
        	var d = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
        	var da = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
        	var db = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
        	var dc = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
        	var dd = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
        	var de = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
        	var df = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

        	// draw the transformed image
        	ctx.transform(da / d, dd / d, db / d, de / d, dc / d, df / d);
			
			// number or texture?
			if (!isNaN(t) || t == '+') ctx.fillText(t, w / 2, h - 16);
			else ctx.drawImage(tex, 0, 0);

        	ctx.restore();
    	}
	},

	zSort : function(a, b) {

		if (a.lr < b.lr) return -1;
		else if (a.lr > b.lr) return 1;

		return b.dist - a.dist;
	},

	update : function(mx, my) {

		var i, j;
		var s = this;

		// background - change colour if looking down/up
		ctx.fillStyle = s.cam.rx > 0 ? '#3D81C0' : '#2A00F7';
		ctx.fillRect(0, 0, 1680 * scale, 720 * scale);

		s.hud.update(mx, my);

		if (s.title) {

			s.tm1[0].update(mx, my, 1, -1);
		}
		else if (s.hud.touch.v) {
		
			s.inX = s.inY = 0;

			// test touch controls
			if (s.hud.touch.up.isDn) s.inY = -1;
			if (s.hud.touch.down.isDn) s.inY = 1;
			if (s.hud.touch.left.isDn) s.inX = -1;
			if (s.hud.touch.right.isDn) s.inX = 1;
		}

		if (s.isRunning) {

			var eInX = 0, eInY = 0;

			// which is the enemy team?
			var en = s.turn == 1 ? s.tm2 : s.tm1;

			if (s.turn == 2 || s.autoplay) {

				if (s.gS == 1) {
				
					// turning
					if (s.eTurn) { 
					
						eInX = s.eTD;

						// turn to target then move
						if (s.p.ry >= s.eToR - 1 && s.p.ry <= s.eToR + 1) {

							eInX = 0;
							s.eTurn = false;
						} 
					}
					// moving
					else {

						eInY = -1;

						var reached = false;

						if (s.getHealth) reached = Col.circle(s.p.x, s.p.z, 1, s.pUp.x, s.pUp.z, 120) <= 0;
						else reached = Col.circle(s.p.x, s.p.z, 1, en[s.eTar].x, en[s.eTar].z, 500) <= 0;

						// no fuel
						if (s.stats[0] <= 0) reached = true;

						// move to within range of target (or fuel runs out) then aim
						if (reached) {
						
							// set elevation...
							// get dist between tanks
							var v = new Vector2D(-1*(s.p.x - en[s.eTar].x), s.p.z - en[s.eTar].z);
							
							s.eToR = Math.round(v.angle() + 90);
							if (s.eToR < 360) s.eToR += 360;
							if (s.eToR >= 360) s.eToR -= 360;

							if (s.eToR % 2 != 0) s.eTor++;

							var rot = s.p.tur.ry + s.p.ry;
							if (rot >= 360) rot -= 360;
							else if (rot < 0) rot += 360;
										
							s.eTD = rot > s.eToR ? -1 : 1;

							var test = 99999;
							s.eToL = 0;
							
							for (i = 15; i < 80; i++) {

								var r = Math.abs(getProjectileRange(i) - v.magnitude());

								if (r < test) {

									test = r;
									s.eToL = i;
								}
							}

							s.eTL = s.p.rx + s.p.tur.rx + s.p.tur.gun.rx > s.eToL ? -1 : 1;
							s.setArcVisible(true);

							// start moving turret
							s.gS = 2;
						}
					}
				}
				else if (s.gS == 2) {

					eInX = s.eTD;
					eInY = s.eTL;

					var rot = s.p.tur.ry + s.p.ry;
					if (rot >= 360) rot -= 360;
					else if (rot < 0) rot += 360;

					var elev = s.p.rx + s.p.tur.rx + s.p.tur.gun.rx;

					if (rot > s.eToR - 2 && rot < s.eToR + 2) eInX = s.eTD = 0
					if (elev == s.eToL) eInY = s.eTL = 0;

					// turn turret to target then fire
					if (rot >= s.eToR - 2 && rot <= s.eToR + 2 && elev == s.eToL) {
						
						eInX = eInY = 0;

						s.setArcVisible(false);
						s.gS = 0;

						// fire (after a short delay)
						var sc = this;

						setTimeout(function() { 
							
							// apply targetting error
							var err1 = Math.floor(rnd() * sc.stats[1] * 2) - sc.stats[1];
							var err2 = Math.floor(rnd() * sc.stats[1] * 2) - sc.stats[1];

							sc.shell.fire(sc.arc.x, sc.arc.y, sc.arc.z, sc.p.rx + sc.p.tur.rx + sc.p.tur.gun.rx + err1, sc.p.ry + sc.p.tur.ry + sc.p.tur.gun.ry + err2);
							sc.shad.setVisible(true);

						}, 750);
					}
				}
			}

			if (!s.title) {

				// update tanks
				for (i = 0; i < s.tm2.length; i++) {
					
					if (s.p == s.tm2[i]) s.tm2[i].update(mx, my, eInX, eInY);
					else s.tm2[i].update(mx, my, 0, 0);
				}

				for (i = 0; i < s.tm1.length; i++) {
					
					if (s.p == s.tm1[i]) {
						
						if (s.autoplay) s.tm1[i].update(mx, my, eInX, eInY);
						else s.tm1[i].update(mx, my, s.inX, s.inY);
					}
					else s.tm1[i].update(mx, my, 0, 0);
				}
			}

			if (s.gS == 2) {

				s.arc.update(s.p.rx + s.p.tur.rx + s.p.tur.gun.rx, s.p.ry + s.p.tur.ry + s.p.tur.gun.ry, s.p.rz + s.p.tur.rz + s.p.tur.gun.rz);
			}
			
			s.shell.update();
			s.shad.update(s.shell);

			s.pUp.update();

			// update tree visibility
			for (i = 0; i < s.trees.length; i++) s.trees[i].update();
			for (i = 0; i < s.dice.length; i++) s.dice[i].update(mx, my);

			// update floor visibility
			for (i = 0; i < s.fl.length; i++) s.fl[i].update();

			if (s.title) {

				s.xT = s.tm1[0].x + (Math.sin(s.tm1[0].ry * Const.D2R) );
				s.yT = s.tm1[0].y - 260;
				s.zT = s.tm1[0].z + (Math.cos(s.tm1[0].ry * Const.D2R) );

				s.ryT = (s.tm1[0].ry + 235) * Const.D2R;
				s.rxT = 10 * Const.D2R;
				
			}
			else if (s.isMapCam) {

				s.xT = s.mapCam.x;
				s.yT = s.mapCam.y;
				s.zT = s.mapCam.z;

				s.rxT = s.mapCam.rx;
				s.ryT = s.mapCam.ry;
			}
			else {

				// higher angle for firing stage
				if (s.gS == 1) {

					// camera follow
					s.xT = s.p.x + (Math.sin(s.p.ry * Const.D2R) * -100);//0
					s.yT = s.p.y - 300;//-500
					s.zT = s.p.z + (Math.cos(s.p.ry * Const.D2R) * -100);//-500

					s.ryT = s.p.ry * Const.D2R * 2;	//0	<-- no idea where this x2 comes from :)
					s.rxT = -s.p.rx * Const.D2R;//Math.PI * 0.05
				}
				else {

					// camera follow
					s.xT = s.p.x + (Math.sin(s.p.ry * Const.D2R) * -400);
					s.yT = s.p.y - 800;
					s.zT = s.p.z + (Math.cos(s.p.ry * Const.D2R) * -400);

					s.ryT = s.p.ry * Const.D2R * 2;
					s.rxT = 45 * Const.D2R;
				}
			}

			// damped movement
			s.cam.x += (s.xT - s.cam.x) / 10;
			s.cam.y += (s.yT - s.cam.y) / 10;
			s.cam.z += (s.zT - s.cam.z) / 10;

			// i've been using this crazy angle damping function so long i can't remember how it works 
			s.cam.ry += Const.R2D * Math.atan2((Math.cos(s.cam.ry * Const.D2R) * Math.sin(s.ryT * Const.D2R) - Math.sin(s.cam.ry * Const.D2R) * Math.cos(s.ryT * Const.D2R)), (Math.sin(s.cam.ry * Const.D2R) * Math.sin(s.ryT * Const.D2R) + Math.cos(s.cam.ry * Const.D2R) * Math.cos(s.ryT * Const.D2R))) / 10;
			s.cam.rx += Const.R2D * Math.atan2((Math.cos(s.cam.rx * Const.D2R) * Math.sin(s.rxT * Const.D2R) - Math.sin(s.cam.rx * Const.D2R) * Math.cos(s.rxT * Const.D2R)), (Math.sin(s.cam.rx * Const.D2R) * Math.sin(s.rxT * Const.D2R) + Math.cos(s.cam.rx * Const.D2R) * Math.cos(s.rxT * Const.D2R))) / 10;

			// this is used as a visibility flag for some elements
			s.isLkDn = s.cam.rx > Math.PI * 0.375 ? true : false;
		}

		s.updateScene();

		for (i = 0; i < s.tm1.length; i++) s.tm1[i].draw();
		for (i = 0; i < s.tm2.length; i++) s.tm2[i].draw();
		
		if (s.title) {

			drawText('ROLL', 840, 205, 128, 0, '#EC1C5A');
			drawText('TANKS', 840, 305, 100);
			drawText('2020 | David Durham | JS13K', 840, 700, 24);

			s.bPlay.update(mx, my);
			s.bPlay.draw();
		}
		else s.hud.draw();
	}
}