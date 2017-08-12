var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function canvas() {
    this.width = 800;
    this.height = 600;
}
function keyDownHandler(e) {
    if (e.keyCode == 32) {
        bird.flap();
    }
}

function keyUpHandler(e) {
}

function Bird() {
    this.x    = canvas.width/4;
    this.y    = canvas.height/2;
    this.size = 10;

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
     */
        if (!this.y + this.size <= canvas.height) {
            this.y++;
          }
    }
    this.flap = function() {
        /**
         * Flaps the bird up the screen
         */
        if (bird.y > 40) {
            this.y -= 40;
        }
    }
}

function Gate() {
    this.gapSize       = 80;
    this.topHeight     = Math.floor(Math.random() * 200);
    this.bottomHeight  = canvas.height - (this.topHeight + this.gapSize);
    this.topX          = canvas.width;
    this.topY          = 0;
    this.bottomX       = this.topX;
    this.bottomY       = this.gapSize + this.topHeight;
    this.width         = 20;

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
            if (!(bird.x + bird.size < g.topX || bird.x - bird.size > g.topX + g.width 
                || bird.y + bird.size < g.topY || bird.y - bird.size > g.topY + g.topHeight) 
                || !(bird.x + bird.size < g.bottomX || bird.x - bird.size > g.bottomX + g.width 
                || bird.y + bird.size < g.bottomY || bird.y - bird.size> g.bottomY + g.bottomHeight)) {
            alert("You broke your neck and died");
            document.location.reload();
            }


                

        }
    }
}

var bird = new Bird();
var gates = new Gates();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    bird.applyGravity();
    gates.drawAll();
    gates.moveAll();
    gates.addGates();
    gates.destroyGates();
    gates.detectCollisions();



}

// call draw every 10ms
setInterval(draw, 10);
