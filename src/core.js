// sections
var menu, game;

// screen transition
var trans, transFunc;

var cv = null;
var cvRect = null;
var ctx = null;

var audioCtx = null;

// game state
var state;

// scaling
var scale, ratio, originX;

var isMsDn = false;
var mPos;
var buttons = [];

// run init on load
window.onload = init;
window.addEventListener('resize', resize, false);

// mode
var isTouch = false;
var isPortrait = false;

var bg = null;

var lev = 1;

// fps
var ts = 0, frame = 0;


/* Initialisation */

function init() {
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	if (window.AudioContext) audioCtx = new window.AudioContext();

	state = Const.STATE_INIT;
	
	cv = document.getElementById('game');
	cvRect = cv.getBoundingClientRect();
	ctx = cv.getContext('2d', { alpha: false });
	ctx.webkitImageSmoothingEnabled = false;
	
	bg = ctx.createLinearGradient(0, 0, 0, 720);
	bg.addColorStop(0, "#9DDAEC");
	bg.addColorStop(1, "#3D81C0");

	ratio = cv.width / cv.height;
	
	resize();
	
	// handle mouse behavior
	mPos = {x:0, y:0};
	cv.addEventListener('mousemove', msMv, false);
	cv.addEventListener('mousedown', msDn, false);
	cv.addEventListener('mouseup', msUp, false);

	cv.addEventListener('touchmove', tMv, false);
	cv.addEventListener('touchstart', tDn, false);
	cv.addEventListener('touchend', tUp, false);
	
	cv.addEventListener('keydown', onKeyDown, false);
	cv.addEventListener('keyup', onKeyUp, false);
	
	// main update loop
	setInterval(update, 1000 / Const.FPS);

	//menu = new Menu();
	game = new Game(true);
	game.init();

	trans = new Transition();
	state = Const.STATE_GAME;

}

function resize() {

	cv.height = window.innerHeight;
	cv.width = cv.height * ratio; 

	originX = ((window.innerWidth - cv.width) / 2);

	cv.style.left = originX + "px";
	cv.style.position = "absolute";
	
	// set the scale (fixed ratio)
	scale = cv.width / Const.W;

	// check for device rotation
	var rot = document.getElementById("rotate");
	var holder = document.getElementById("holder");

	// device is portrait
	if (window.innerWidth < window.innerHeight) {
		
		rot.style.display = "block";
		holder.style.display = "none";
		
		isPortrait = true;

		// PAUSE GAMEPLAY?
	}
	// landscape
	else {

		rot.style.display = "none";
		holder.style.display = "block";

		// was portrait?
		//if (isPortrait) {

			//GAME.resize();
		//}			

		isPortrait = false;
	}
}

/* Keyboard */

function onKeyDown(event) {
	
	if (state == Const.STATE_GAME) {
		
		game.keyDn(event.keyCode);
	}
}

function onKeyUp(event) {
	
	if (state == Const.STATE_GAME) {
		
		game.keyUp(event.keyCode);
	}
}


/* Mouse Handling */

function msMv(event) {
	
	mPos = getmPos(cv, event);

	if (isMsDn) {
	
		if (state == Const.STATE_GAME) {

			game.hud.touch.press(mPos.x, mPos.y);
		}
	}
}

function msDn(event) {
	
	isMsDn = true;

	if (state == Const.STATE_GAME) game.msDn();
}

function msUp(event) {
	
	isMsDn = false;

	if (state == Const.STATE_GAME) game.msUp();
}


/* Touch Handling */

function tMv(event) {
	
	event.preventDefault();
	
	mPos = tPos(cv, event);

	if (isMsDn) {
	
		if (state == Const.STATE_GAME) {
		
			game.hud.touch.press(mPos.x, mPos.y)
		}
	}
}

function tDn(event) {
	
	event.preventDefault();
	mPos = tPos(cv, event);

	isMsDn = true;
	
	if (state == Const.STATE_GAME) {
		
		if (mPos.x < Const.W * 0.5 * scale) game.msDn(1);
		else game.msDn(2);
	}
}

function tUp(event) {
	
	isMsDn = false;

	event.preventDefault();
	mPos = tPos(cv, event);
	
	if (state == Const.STATE_GAME) {
	
		isTouch = true;
		
		if (mPos.x < Const.W * 0.5 * scale) game.msUp(1);
		else game.msUp(2);
	}
}

function tPos(cv, event) {
	
	return { x: event.changedTouches[0].pageX - cv.offsetLeft, y: event.changedTouches[0].pageY - cv.offsetTop };
}

function getmPos(cv, event) {
	
	return { x: event.pageX - cv.offsetLeft, y: event.pageY - cv.offsetTop };
}

function startGame() {
	
	transFunc = onTransGame;
	trans.start();
}

function quitGame() {
	
	transFunc = onTransQuit;
	trans.start();
}

function onTransQuit() {

	game = new Game(true);
	game.init();
}

function onTransGame() {
	
	game = new Game(false);
	game.init();
}

/* Maths */

function rnd() {

	return Math.random();
}

function getProjectilePos(angle, time) {

	var speed = 160;
	var mass = 2;

	return {

		x: speed * time * Math.cos(angle),
		y: speed * time * Math.sin(angle) - 0.5 * Const.G * (time * time) * -mass
	};
}

function getProjectileRange(angle) {

	var speed = 160;
	var mass = 2;

	return ((speed * speed) * Math.sin(2 * angle * Const.D2R)) / (Const.G * mass);
}


/* 3D Objects */

function addBox(obj, x, y, z, w, h, d, fc, lr, tw, th, td) {

	tW = tw || w;
	tH = th || h;
	tD = td || d;

	var b = [	[x - (tW / 2), y - (h / 2), z - (tD / 2)],
				[x + (tW / 2), y - (h / 2), z - (tD / 2)],
				[x + (tW / 2), y - (h / 2), z + (tD / 2)],
				[x - (tW / 2), y - (h / 2), z + (tD / 2)],

				[x - (w / 2), y + (h / 2), z - (d / 2)],
				[x + (w / 2), y + (h / 2), z - (d / 2)],
				[x + (w / 2), y + (h / 2), z + (d / 2)],
				[x - (w / 2), y + (h / 2), z + (d / 2)]];

	// if not all faces are defined, go to defaults
	if (fc.length < 6) {
	
		var col = '#fff';
		if (fc.length > 0) col = fc[0];
		fc = [col, col, col, col, col, col];
	}

	if (fc[0] != '') addQuad(obj, b[0], b[1], b[2], b[3], fc[0], lr);	//top
	if (fc[1] != '') addQuad(obj, b[4], b[5], b[6], b[7], fc[1], lr);	//bottom
	if (fc[2] != '') addQuad(obj, b[0], b[1], b[5], b[4], fc[2], lr);	//front
	if (fc[3] != '') addQuad(obj, b[3], b[2], b[6], b[7], fc[3], lr);	//back
	if (fc[4] != '') addQuad(obj, b[0], b[3], b[7], b[4], fc[4], lr);	//left
	if (fc[5] != '') addQuad(obj, b[1], b[2], b[6], b[5], fc[5], lr);	//right
}

function addQuad(obj, v1, v2, v3, v4, col, lr, a) {

	obj.qd.push([ addSprite(obj, v1[0], v1[1], v1[2], col, 10, 1, 0, lr, a),
					addSprite(obj, v2[0], v2[1], v2[2], col, 10, 1, 1, lr, a),
					addSprite(obj, v3[0], v3[1], v3[2], col, 10, 0, 1, lr, a),
					addSprite(obj, v4[0], v4[1], v4[2], col, 10, 0, 0, lr, a)]);
}

function addSprite(object, x, y, z, col, size, u, v, lr, a) {

	var obj = new SceneObject(col, size);
	obj.x = x + object.x;
	obj.y = y + object.y;
	obj.z = z + object.z;

	obj.u = u || 0;
	obj.v = v || 0;

	obj.lr = lr || 0;
	obj.a = a || 1;

	object.pt.push(obj);

	return obj;
}

function rotate(object, xTheta, yTheta, zTheta) {

	var len = object.uR.length;
	var x, y, n;

	// do rotation in specific order
	// Z
	var sinTheta = Math.sin(zTheta);
	var cosTheta = Math.cos(zTheta);
	
	for (n = 0; n < len; n++) {
	
		x = object.uR[n].x;
		y = object.uR[n].y;

		object.zR[n].x = (x * cosTheta - y * sinTheta);
		object.zR[n].y = (y * cosTheta + x * sinTheta);
		
		object.zR[n].z = object.uR[n].z;
	}

	// X
	sinTheta = Math.sin(xTheta);
	cosTheta = Math.cos(xTheta);
	
	for (n = 0; n < len; n++) {
	
		y = object.zR[n].y;
		z = object.zR[n].z;

		object.xR[n].x = object.zR[n].x;
		object.xR[n].y = (y * cosTheta - z * sinTheta);
		object.xR[n].z = (z * cosTheta + y * sinTheta);
	}

	// Y
	sinTheta = Math.sin(yTheta);
	cosTheta = Math.cos(yTheta);
	
	for (n = 0; n < len; n++) {
	
		x = object.xR[n].x;
		z = object.xR[n].z;

		object.yR[n].x = (x * cosTheta + z * sinTheta);
		object.yR[n].y = object.xR[n].y;
		object.yR[n].z = (z * cosTheta - x * sinTheta);
	}
}

/* Main Loop */

function update() {
	
	// clear the screen
	ctx.clearRect(0, 0, cv.width, cv.height);
	
	if (game) game.update(mPos.x, mPos.y);	
	if (trans) trans.update();

	//fps();
}

function drawText(text, x, y, size, drop, col, align) {

	ctx.font = 'bold ' + Math.floor(size * scale) + 'px Arial';
	ctx.textAlign = align || 'center';
	
	if (drop > 0) {
	
		ctx.fillStyle = '#000';
		ctx.fillText(text, Math.floor(x * scale), Math.floor((y + drop) * scale));
	}

	ctx.fillStyle = col || '#fff';		
	ctx.fillText(text, Math.floor(x * scale), Math.floor(y * scale));
}
/*
function fps() {
	
	frame++;
	
	var d = new Date().getTime(); 
	var tc = (d - ts) / 1000;
	var res = Math.floor((frame / tc));
	var lf = Math.max(0, (0 - originX) * (1 / scale));

	if (tc > 1) {
	
		ts = new Date().getTime();
		frame = 0;
	}		
	
	ctx.font = (18 * scale) + "px Arial";
	ctx.fillStyle = "#000";
	ctx.textAlign = "left";
	ctx.fillText(res + ' FPS', (lf + 10) * scale, 20 * scale);

	return res;
}
*/