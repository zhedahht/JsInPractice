$(document).ready(function () {
    makeFireworkGroup("canvasForfireworks");
});

function makeFireworkGroup(canvasId) {
    var fireworkGroup = new FireworkGroup(canvasId);
    
    var renderAndUpdateFunc = renderAndUpdate(fireworkGroup)
    setInterval(renderAndUpdateFunc, 15);
    
    var shotFireworkGroupFunc = shotFireworkGroup(fireworkGroup)
    setInterval(shotFireworkGroupFunc, 1000);
}

function shotFireworkGroup(fireworkGroup) {
    return function() {
        fireworkGroup.shot();
    };
}

function renderAndUpdate(fireworkGroup) {
    return function() {
        fireworkGroup.render();
        fireworkGroup.update();
    };
}

function FireworkGroup(canvasId) {
    var numberOfGroup = 3;
    var fireworkGroupElement = document.getElementById(canvasId);
    var context = fireworkGroupElement.getContext("2d");
    
    var width = fireworkGroupElement.clientWidth;
    var height = fireworkGroupElement.clientHeight;
    
    var fireworkGroup = initFireworkGroup(width, height);

    this.render = function() {
        context.fillStyle = "#113";
        context.fillRect(0, 0, width, height)
        
        fireworkGroup.forEach(function(firework) {
           firework.render(context);
        });
    }
    
    this.update = function() {
        fireworkGroup.forEach(function(firework) {
           firework.update();
        });
    }
    
    this.shot = function() {
        fireworkGroup.forEach(function(firework) {
           firework.shot();
        });
    }

    function initFireworkGroup(width, height) {
        var fireworkGroup = [];
        for(var i = 0; i < numberOfGroup; ++i) {
            var pos = {
                x: Math.round((width / numberOfGroup) * (i + 0.5)),
                y: height - 50
            };
            var canvasSize = {
                width: width,
                height: height
            };

            fireworkGroup[i] = new Firework(pos, canvasSize);    
        }
        
        return fireworkGroup;
    }
}

function Firework(pos, canvasSize) {
    var shots = [];
    this.render = function(context) {
        shots.forEach(function(shot) {
            shot.render(context);
        });
    }
    
    this.update = function() {
        // remove old shots
        for(var i = 0; i < shots.length; ++i) {
            shot = shots[i];
            if (shot.isOld()) {
                shots.splice(i, 1);
            }
        }
        
        shots.forEach(function(shot) {
            shot.update();
        });
    }
    
    this.shot = function() {
        var newShot = new Shot(pos, canvasSize);
        shots.push(newShot);
    }
}

function Shot(pos, canvasSize) {
    var numberOfParticles = 50;
    var shotHeight = 400;
    var life = 100;
    var age = 0;
    var particles = initShot(pos, canvasSize);

    this.render = function(context) {
        particles.forEach(function(particle) {
            particle.render(context);
        });
    }
    
    this.update = function() {
        age++;
        
        particles.forEach(function(particle) {
            particle.update();
        });
    }
    
    this.isOld = function() {
        return age >= life;
    }
    
    function initShot(pos, canvasSize) {
        var particles = [];
        for(var i = 0; i < numberOfParticles; ++i) {
            var particlePos = {
                x: pos.x,
                y: pos.y - shotHeight
            }
            var angle = Math.PI * 2 * i / numberOfParticles;
            var linearSpeed = 1.5;
            var speed = {
                x: linearSpeed * Math.cos(angle),
                y: linearSpeed * Math.sin(angle),
            }
            
            var resistance = 0.9995;
            var gravity = {
                x: 0,
                y: 0.005
            }
            var color = "rgba(255, 255, 255, 1.0)";
            var size = 2;
            
            var particle = new Particle(particlePos, speed, resistance,
                                        gravity, color, size);
            particles.push(particle);
        }
        
        return particles;
    }
}

function Particle(pos, speed, resistance, gravity, color, size) {
    var curPos = {
        x: pos.x,
        y: pos.y
    };
    var curSpeed = speed;
    
    this.render = function(context) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(curPos.x, curPos.y, size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill(); 
    }
    
    this.update = function() {
        curSpeed.x = curSpeed.x * resistance + gravity.x;
        curSpeed.y = curSpeed.y * resistance + gravity.y;
        
        curPos.x += curSpeed.x;
        curPos.y += curSpeed.y;
    }
}