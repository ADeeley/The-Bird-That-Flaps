var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function canvas() {
    this.width  = 800;
    this.height = 600;
}


function Game() {
    this.distance = 0;
    this.incrementDistance = function() {
        this.distance++;
    }

    this.drawDistance = function() {
        ctx.font = "16px Ariel";
        ctx.fillStyle = "#4B4B4B";
        ctx.fillText("Distance: " + this.distance, 8, 20);
    }

    this.restart = function() {
        alert("You perished.\nDistance: " + this.distance);
        document.location.reload();
    }

    this.startScreen = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "60px Ariel";
        ctx.fillStyle = "#4B4B4B";
        ctx.fillText("The bird that flaps", 20, canvas.height/3);
        ctx.font = "30px Ariel";
        ctx.fillText("Press space to start", 120, canvas.height/2);
    }
}

function StateMachine() {
    this.startScreen = true;
    this.gameLoop    = false;

    this.startGame = function() {
        this.startScreen = false;
        this.gameLoop    = true;
    }
}

function eventHandler(e) {
    /**
     * Chooses the correct keyevents depending upon the current state
     */
    if (e.keyCode == 32) {
        if (stateMachine.startScreen) {
            stateMachine.startGame();
            console.log(stateMachine.startScreen);

        }
        else {
            bird.flap();
        }
    }
}

window.addEventListener('keydown', eventHandler, false);

function Physics() {
    this.terminalVelocity = 4;
    this.acceleration     = 0.05;
}

function Bird() {
    this.velocity  = 0;
    this.x         = canvas.width/4;
    this.y         = canvas.height/2;
    this.size      = 10;
    this.flapping  = false;
    this.flapCount = 0;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = "#08457e";
        ctx.fill();
        ctx.closePath();
    }

    this.applyGravity = function() {
    /**
     * Makes the bird fall until it hits the canvas floor
     * Gravity doesn't apply when flapping
     */
        if (!(this.y + this.size + this.velocity >= canvas.height) && !this.flapping) {
            this.y += this.velocity;
            if (this.velocity < physics.terminalVelocity) {
                this.velocity += physics.acceleration;
            }
        }
    }


    this.flap = function() {
    /**
     * Flaps the bird up the screen
     */
        // upon pressing flap
        console.log("Flap pressed");
            if (bird.y > 40 & !this.flapping) {
                this.y -= 10;
                this.velocity = 0;
                this.flapping = true;
                this.flapCount++;
        }
    }

    this.subsequentFlaps = function() {
    /**
     * flaps the bird up smoothly for each flap press
     */
        if (this.flapping && this.flapCount <=4) {
            this.y -= 10;
            this.flapCount++;
        }
        else {
            this.flapCount = 0;
            this.flapping = false;
        }
    }
}

function Gate() {
    this.gapSize      = 100;
    this.topHeight    = Math.floor(Math.random() * 200);
    this.bottomHeight = canvas.height - (this.topHeight + this.gapSize);
    this.topX         = canvas.width;
    this.topY         = 0;
    this.bottomX      = this.topX;
    this.bottomY      = this.gapSize + this.topHeight;
    this.width        = 40;

    this.draw = function() {
        ctx.beginPath()
        ctx.rect(this.topX, this.topY, this.width, this.topHeight);
        ctx.rect(this.bottomX, this.bottomY, this.width, this.bottomHeight);
        ctx.fillstyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
    }

    this.move = function() {
    /**
     * Moves the gate to the left hand side of the screen
     */
        this.topX--;
        this.bottomX--;
    }
}

function Gates() {
    this.gatesArr = [new Gate()];

    this.drawAll = function() {
        for (var i = 0; i < this.gatesArr.length; i++) {
            this.gatesArr[i].draw();
        }
    }

    this.moveAll = function() {
        for (var i = 0; i < this.gatesArr.length; i++) {
            this.gatesArr[i].move();
        }
    }

    this.addGates = function() {
        for (var i = 0; i < this.gatesArr.length; i++) {
            if (this.gatesArr[i].topX == (canvas.width/3) *2) {
                this.gatesArr.push(new Gate());
            }
        }
    }
    
    this.destroyGates = function() {
        for (var i = 0; i < this.gatesArr.length; i++) {
            if (this.gatesArr[i].topX < -this.gatesArr[i].width)
                this.gatesArr.shift();
        }
    }
    
    this.detectCollisions = function() {
        var g = 0;
        for (var i = 0; i < this.gatesArr.length; i++) {
            g = this.gatesArr[i];
            if (!(bird.x + bird.size < g.topX 
                || bird.x - bird.size > g.topX + g.width 
                || bird.y + bird.size < g.topY 
                || bird.y - bird.size > g.topY + g.topHeight) 
                || !(bird.x + bird.size < g.bottomX 
                || bird.x - bird.size > g.bottomX + g.width 
                || bird.y + bird.size < g.bottomY 
                || bird.y - bird.size> g.bottomY + g.bottomHeight)) {
                game.restart();
            }
        }
    }
}

var bird         = new Bird();
var gates        = new Gates();
var physics      = new Physics();
var game         = new Game();
var stateMachine = new StateMachine();

function draw() {
    if (stateMachine.gameLoop) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bird.draw();
        bird.applyGravity();
        bird.subsequentFlaps();
        gates.drawAll();
        gates.moveAll();
        gates.addGates();
        gates.destroyGates();
        gates.detectCollisions();
        game.incrementDistance();
        game.drawDistance();
    }
    else if (stateMachine.startScreen) {
        game.startScreen();
    }
}

// call draw every 10ms
setInterval(draw, 10);
