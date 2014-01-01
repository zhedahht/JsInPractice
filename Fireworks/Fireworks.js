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
                y: height * 0.95
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
            if (shot.isDead()) {
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
    var shotHeightRange = new Range(canvasSize.height * 0.55,
                                    canvasSize.height * 0.75);
    var shotHeight = randomInRange(shotHeightRange);
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
    
    this.isDead = function() {
        return age >= life;
    }
    
    function initShot(pos, canvasSize) {
        var particles = [];
        var color = pickColor();
        
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
    var curColor = new Color(col)
    
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

function Range(min, max) {
    this.min = min;
    this.max = max;
}

function randomInRange(range) {
    return Math.random() * (range.max - range.min) + range.min;
}

var pickColor = (function() {
    var colors = [
        new Color(0x00, 0xFF, 0xFF), // Aqua
        new Color(0x8A, 0x2B, 0xE2), // BlueViolet
        new Color(0x7F, 0xFF, 0x00), // Chartreuse
        new Color(0xFF, 0x14, 0x93), // DeepPink
        new Color(0x22, 0x8B, 0x22), // ForestGreen
        new Color(0xAD, 0xFF, 0x2F), // GreenYello
        new Color(0xFF, 0x69, 0xB4), // HotPink
        new Color(0xCD, 0x5C, 0x5C), // IndianRed
        new Color(0xF0, 0xE6, 0x8C), // Khaki
        new Color(0x7C, 0xFC, 0x00), // LawGreen
        new Color(0x00, 0xFA, 0x9A), // MediumSrpingGreen
        new Color(0xFF, 0xA5, 0x00), // Orange
        new Color(0x80, 0x00, 0x00), // Purple
        new Color(0xFF, 0x00, 0x00), // Red
        new Color(0x87, 0xCE, 0xEB), // SkyBlue
        new Color(0xFF, 0x63, 0x47), // Tomato
        new Color(0xEE, 0x82, 0xEE), // Violet
        new Color(0xF5, 0xDE, 0xB3), // Wheat
        new Color(0xFF, 0xFF, 0x00), // Yello
              ];
    
    return function() {
        var indexRange = new Range(0, colors.length - 1);
        var index = Math.round(randomInRange(indexRange));
        return colors[index];
    }
})();

function Color(red, green, blue, alpha) {
    var r = red,
        g = green,
        b = blue,
        a = alpha;
        
    this.toString = function() {
        if (a === undefined) {
            a = 1.0;
        }
        
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
    
    this.clone = function() {
        return new Color(r, g, b, a);
    }
    
    this.setAlpha = function(newAlpha) {
        a = newAlpha;
    }
}