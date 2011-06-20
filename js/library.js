function log(msg) {
	if(console.log) {
		console.log(msg);
	}
}


//	This class will be the base class for CanvasView, Collision Detector
//	and any other objects that need the Observer pattern

var Observer = function() {

	var objects = [];
	
	var registerObject = function(obj) {
		var numberOfObjects = objects.length;
		for(var i=0; i<numberOfObjects; i++) {
			if(obj === objects[i]) {
				log(obj.toString() + " has already been registered");
				return false;
			}
		}
		objects.push(obj);
	};
	
	var unregisterObject = function(obj) {
		var numberOfObjects = objects.length;
		for(var i=0; i<numberOfObjects; i++) {
			if(obj === objects[i]) {
				return objects.splice(i, 1);
			}
		}
	};
	
	return {
		registerObject : registerObject,
		unregisterObject : unregisterObject
	};
	
}




var CanvasView = function(ctx) {
	var ctx = ctx;

	var objects = [];
	
	var registerObject = function(obj) {
		var numberOfObjects = objects.length;
		for(var i=0; i<numberOfObjects; i++) {
			if(obj === objects[i]) {
				log(obj.toString() + " has already been registered");
				return false;
			}
		}
		objects.push(obj);
	};
	
	var unregisterObject = function(obj) {
		var numberOfObjects = objects.length;
		for(var i=0; i<numberOfObjects; i++) {
			if(obj === objects[i]) {
				return objects.splice(i, 1);
			}
		}
	};
	
	var draw = function() {
		ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		for(var i=0; i<objects.length; i++) {
			if(objects[i] instanceof Player) {
				drawPlayer(objects[i]);
			}
			if(objects[i] instanceof Ball) {
				drawBall(objects[i]);
			}
			drawPitch();
		}
	};
	
	var drawPlayer = function(player) {
		ctx.fillStyle = player.getColor();
		ctx.fillRect(player.getX(), player.getY(), player.getWidth(), player.getHeight());
	};
	
	var drawBall = function(ball) {
		//draw a circle
		ctx.beginPath();
		ctx.arc(ball.getX(), ball.getY(), ball.getRadius(), 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fillStyle = ball.getColor();
		ctx.fill();	
	};
	
	var drawPitch = function() {
		// The centre line
		ctx.fillStyle = "#000000";
		ctx.fillRect((ctx.canvas.clientWidth/2)-3,0,5,ctx.canvas.clientHeight);
		
		//draw a circle
		ctx.beginPath();
		ctx.arc(ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2, 20, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		ctx.fillStyle = "#ffffff";
		ctx.fill();
	};
	
	return {
		ctx : ctx,
		registerObject : registerObject,
		unregisterObject : unregisterObject,
		draw : draw
	};
	
}


var Paddle = function() {

	//	Instance attributes set up with sensible defaults
	this.width = 20;
	this.height = 100;
	this.x = 0;
	this.y = 0;
	this.color = "#000000";
	this.speed = 10;
	
}

Paddle.prototype = {
	init : function(params) {
		if(params) {
			this.width = params.width || this.width;
			this.heigh = params.height || this.height;
			this.x = params.x || this.x;
			this.y = params.y || this.y;
			this.color = params.color || this.color;
			this.speed = params.speed || this.speed;
		}
	},
	
	getX : function() {
		return this.x;
	},
	
	getY : function() {
		return this.y;
	},
	
	getColor : function() {
		return this.color;
	},
	
	getWidth : function() {
		return this.width;
	},
	
	getHeight : function() {
		return this.height;
	},
	
	draw : function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
	
	moveUp : function() {
		this.y = (this.y - this.speed);
	},
	
	moveDown : function() {
		this.y = (this.y + this.speed);
	}	
}



var KeyboardControls = (function() {

	var controls;
	
	function init(controller) {
		controls = controller;
	}
	
	$(document).keydown(function(evt) {
	  if (evt.keyCode == 38) controls.p2_up = true;
	  else if (evt.keyCode == 40) controls.p2_down = true;
	  else if (evt.keyCode == 87) controls.p1_up = true;
	  else if (evt.keyCode == 83) controls.p1_down = true;
	  else if (evt.keyCode == 13) Pong.start();
	  else if (evt.keyCode == 32) Pong.pause();
	});
	
	$(document).keyup(function(evt) {
	  if (evt.keyCode == 38) controls.p2_up = false;
	  else if (evt.keyCode == 40) controls.p2_down = false;
	  else if (evt.keyCode == 87) controls.p1_up = false;
	  else if (evt.keyCode == 83) controls.p1_down = false;
	});
	
	return {
		init : init
	}
	
}());




/*
*	Ball class. Can create a graphical representation of a ball within
*	the context that is provided to the constructor. Detects collisions
*	of objects passed in to it's move() method and respond accordingly.
*
*	@param	obj		2d context of the game's canvas
*/
function Ball() {
	
	//	Set attributes to sensible defaults
	this.radius = 8;
	this.x = 0;
	this.y = 0;
	this.dx = -8;
	this.dy = 3;
	this.color = "#000000";
	this.name = "Ball";
		
}

Ball.prototype = {
	
	getX : function() {
		return this.x;
	},
	
	getY : function() {
		return this.y;
	},
	
	getRadius : function() {
		return this.radius;
	},
	
	getColor : function() {
		return this.color;
	},

	//	This function accepts an array of obstacles. It iterates through each object
	//	in the array and check whether it has hit it and reverse dx if it has.
	//	Otherwise it moves the ball along it's current trajectory
	move : function(obstacles) {
		//	This makes the ball bounce off the top or bottom
		if(this.y <= 0 || this.y >= 400) {
			//this.flash();
			this.dy = (-this.dy);
		}
		//	Move the ball...
		this.x = (this.x + this.dx);
		this.y = (this.y + this.dy);
	},
	
	collide : function(obj, ctx) {
		//this.flash(ctx);
		this.reverse();
	},
	
	reverse : function() {
		this.dx = (-this.dx);
	},
	
	centralise : function(width, height) {
		this.x = width / 2;
		this.y = height / 2;
	},
	
	//	Creates a "just bounced" effect
	flash : function(ctx) {
		
		var flash1 = setInterval(function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius * 2), 0, Math.PI*2, true);
			ctx.closePath();
			ctx.lineWidth = 5;
			ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
			ctx.stroke();	
		}, 10);
		
		var flash2 = setInterval(function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius * 3), 0, Math.PI*2, true);
			ctx.closePath();
			ctx.lineWidth = 5;
			ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
			ctx.stroke();
		}, 20);
		
		var flash3 = setInterval(function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius * 4), 0, Math.PI*2, true);
			ctx.closePath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
			ctx.stroke();
		}, 30);
		
		setTimeout(function () {
			clearInterval(flash1);
			clearInterval(flash2);
			clearInterval(flash3);
		}, 50);
		
	},
	
	sparkle : function() {
		var self = this;
		var int = setInterval(function() {
			self.ctx.fillRect(self.x - (self.dx * 2), self.y - (self.dy * 2), 8, 8);
			self.ctx.fillStyle = "rgba(0,0,0,0.5)";
			self.ctx.fillRect(self.x - (self.dx * 4), self.y - (self.dy * 4), 8, 8);
			self.ctx.fillStyle = "rgba(0,0,0,0.4)";
			self.ctx.fillRect(self.x - (self.dx * 6), self.y - (self.dy * 6), 8, 8);
			self.ctx.fillStyle = "rgba(0,0,0,0.3)";
			self.ctx.fillRect(self.x - (self.dx * 8), self.y - (self.dy * 8), 8, 8);
			self.ctx.fillStyle = "rgba(0,0,0,0.2)";
			self.ctx.fillRect(self.x - (self.dx * 10), self.y - (self.dy * 10), 8, 8);
			/*
log("Sparkle");
			self.ctx.fillStyle = "rgba(0,0,0,"+Math.random()+")";
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 3)), self.y - (self.dy * (Math.random() * 2)), 1, 1);
			self.ctx.fillStyle = "rgba(0,0,0,"+(Math.random() * ((0.4 + 0.1) - 0.1))+")";
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 3)), self.y - (self.dy * (Math.random() * 2)), 2, 2);
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 3)), self.y - (self.dy * (Math.random() * 2)), 3, 2);
			self.ctx.fillStyle = "rgba(0,0,0,"+(Math.random() * ((0.4 + 0.1) - 0.1))+")";
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 4)), self.y - (self.dy * (Math.random() * 3)), 3, 3);
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 5)), self.y - (self.dy * (Math.random() * 3)), 4, 3);
			self.ctx.fillStyle = "rgba(0,0,0,"+(Math.random() * ((0.3 + 0.1) - 0.1))+")";
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 5)), self.y - (self.dy * (Math.random() * 4)), 4, 4);
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 5)), self.y - (self.dy * (Math.random() * 4)), 5, 4);
			self.ctx.fillStyle = "rgba(0,0,0,"+(Math.random() * ((0.3 + 0.1) - 0.1))+")";
			self.ctx.fillRect(self.x - (self.dx * (Math.random() * 10)), self.y - (self.dy * (Math.random() * 8)), 5, 5);
*/
			}, 20);
		setTimeout(function() {
			clearInterval(int);
			}, 100);
	}

}




/*
*	Player class. Represents a player in the game.
*
*	@param	obj				2d context of the game's canvas
*	@param	string		The name of the player eg. "Player 1"
*	@param	string		Start position, either 'left' or 'right'
*	@params	obj				Paramaters for the players Paddle
*/
function Player(uniqueID, startPos, params) {

	this.id = uniqueID;
	
	this.name = "Player";

	this.paddle = new Paddle();
	
}

Player.prototype = {

	getX : function() {
		return this.paddle.getX();
	},

	getY : function() {
		return this.paddle.getY();
	},

	getWidth : function() {
		return this.paddle.getWidth();
	},

	getHeight : function() {
		return this.paddle.getHeight();
	},

	getColor : function() {
		return this.paddle.getColor();
	},
	
	up : function() {
		this.paddle.moveUp();
		return this;
	},
	
	down : function() {
		this.paddle.moveDown();
		return this;
	},
	
	rightAlign : function(x) {
		this.paddle.x = x - this.paddle.width;
	},
	
	leftAlign : function(x) {
		this.paddle.x = x;
	},
	
	getLeftBoundary : function() {
		return this.paddle.x;
	},
	
	getRightBoundary : function() {
		return this.paddle.x + this.paddle.width;
	}, 
	
	getTop : function() {
		return this.paddle.y;
	},
	
	getBottom : function() {
		return this.paddle.y + this.paddle.height;
	},
	
	hit : function() {
		var self = this;
		log(this.name + " was hit");
		var color = this.paddle.color;
		this.paddle.color = "#555555";
		setTimeout(function() {
			self.paddle.color = color;
		}, 30);
	},
	
	celebrate : function() {
		var flashID = setInterval(this.paddle.flash, 80);
		setTimeout(function() {
			clearInterval(flashID);
		}, 3000);
		return this;
	},
	
	inRange : function(obj) {
		return obj.x < this.getRightBoundary() && obj.x > this.getLeftBoundary()
						&& obj.y < this.getBottom() && obj.y > this.getTop();
	},
	
	collide : function(obj) {
		log(this.id+" collided with "+ obj.name);
	}
}



var CollisionEngine = function() {
	this.objects = [];
}

CollisionEngine.prototype.registerObject = function(obj) {
	var numberOfObjects = this.objects.length;
	for(var i=0; i<numberOfObjects; i++) {
		if(obj === this.objects[i]) {
			log(obj.toString() + " has already been registered");
			return false;
		}
	}
	this.objects.push(obj);
};

CollisionEngine.prototype.unregisterObject = function(obj) {
	var numberOfObjects = this.objects.length;
	for(var i=0; i<numberOfObjects; i++) {
		if(obj === this.objects[i]) {
			return this.objects.splice(i, 1);
		}
	}
};

CollisionEngine.prototype.detectCollision = function() {
	var numberOfObjects = this.objects.length;
	for(var i=0; i<numberOfObjects; i++) {
		for(var j=i+1; j<numberOfObjects; j++) {
			if(this.objects[i].inRange(this.objects[j])) {
				this.objects[i].collide(this.objects[j]);
				this.objects[j].collide(this.objects[i]);
			}
		}
	}
}

var Score = function(ctx) {
	var ctx = ctx;

	var scores = {};
	
	var initialise = function(params) {
		ctx = params.ctx;
		if(params.players) {
			players = params.players;
			len = players.length;
			for(var i=0; i<len; i++) {
				addPlayer(players[i]);
			}
		}
	}
	
	var addPlayer = function(player) {
		scores[player.id] = 0;
	}
	
	var getScore = function(playerID) {
		if(playerID) {
			return scores[playerID];
		} else {
			return scores;		
		}
	}
	
	var scoreUp = function(playerID) {
		log("scoreUp called for "+playerID);
		if(scores[playerID] != undefined) {
			scores[playerID]++;
		}
	}
	
	var resetScores = function() {
		for(var player in scores) {
			scores[player] = 0;
		}
	}
	
	var draw = function() {
		ctx.font = "120px Synchro LET";
		ctx.fillText(scores.p0, (ctx.canvas.clientWidth / 2) - 100, 100);
		ctx.fillText(scores.p1, (ctx.canvas.clientWidth / 2) + 30, 100);
	}
	
	return {
		init : initialise,
		registerPlayer : addPlayer,
		getScore : getScore,
		scoreUp : scoreUp,
		reset : resetScores,
		draw : draw
	}
	
}


