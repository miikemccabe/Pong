var Pong = (function() {
	var ctx, ball, view, collisionEngine, scoreKeeper, scoreKeeper;
	
	var goal = 5;
	
	var p1, p2;
	
	var uniqueID = function() {
		var id = 0;
		return function(string) {
			return string+id++;
		};
	}();
	
	var gameID = false;
	var running = false;
	
	var controls = {
		p1_up		: false,
		p1_down	: false,
		p2_up 	: false,
		p2_down	:	false
	
	};
	
	var init = function() {
	
		ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
		
		KeyboardControls.init(controls);
	
		p1 = new Player(uniqueID("p"));
		p2 = new Player(uniqueID("p"));
		p2.rightAlign(ctx.canvas.clientWidth);
		p1.center(400);
		p2.center(400);
		
		ball = new Ball();		
		ball.centralise(ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		
		view = new CanvasView(ctx);
		
		view.registerObject(p1);
		view.registerObject(p2);
		view.registerObject(ball);
		view.update();
		
		collisionEngine = new CollisionEngine();
		
		collisionEngine.registerObject(p1);
		collisionEngine.registerObject(p2);
		collisionEngine.registerObject(ball);
		
		scoreKeeper = new Score(ctx);
		scoreKeeper.registerPlayer(p1);
		scoreKeeper.registerPlayer(p2);
	}
	
	var start = function() {
		log("Start called");
		running = true;
		displayScores();
		
		if(!ball) {
			ball = new Ball();
			ball.centralise(ctx.canvas.clientWidth, ctx.canvas.clientHeight);
			view.registerObject(ball);
			collisionEngine.registerObject(ball);
		}
		
		if(!gameID) {
			scoreKeeper.reset();
			gameID = setInterval(function() {
				draw();
			}, 10);
		}	
	}
	
	var stop = function() {
		running = false;
		clearInterval(gameID);
		gameID = false;
		log("Stop called");
	}
	
	var pause = function() {
		running = !running;
		log("Pause called");
	}
	
	var draw = function() {
		if(running) {
		
			view.update();
			
			if(controls.p1_up && !controls.p1_down) {
				p1.up();
			}
			if(controls.p1_down && !controls.p1_up) {
				p1.down();
			}
			if(controls.p2_up && !controls.p2_down) {
				p2.up();
			}
			if(controls.p2_down && !controls.p2_up) {
				p2.down();
			}
			//scoreKeeper.draw(scoreKeeper.getScore());
			if(ball) {
				ball.move([p1, p2]);
				collisionEngine.detectCollision();
				if(isBallOut()) {
					setScore();
					view.unregisterObject(ball);
					collisionEngine.unregisterObject(ball);
					ball = false;
				}
			}				
		}
	}
	
	var setScore = function() {
		log("Ball is out");
		if(ball.x < 0) {
			scoreKeeper.scoreUp(p2.id);
		} else {
			scoreKeeper.scoreUp(p1.id);
		}
		displayScores();
		if(scoreKeeper.getScore(p1.id) === goal || scoreKeeper.getScore(p2.id) === goal) {
			scoreKeeper.getScore(p1.id) === goal ? gameOver(p1) : gameOver(p2);
		}
	}
	
	var gameOver = function(player) {
		alert("Game Over. " + player.name + " wins!");
		player.celebrate();
	}
	
	var isBallOut = function() {
		if(ball.x < 0 || ball.x > ctx.canvas.clientWidth) {
			return true;
		} else {
			return false;
		}
	}
	
	var displayScores = function() {
		log("displayScores Called");
		$("#p1 .score").text(scoreKeeper.getScore(p1.id));
		$("#p2 .score").text(scoreKeeper.getScore(p2.id));
	}
	
	return {
		init : init,
		start : start,
		pause : pause
	}

}());



	




