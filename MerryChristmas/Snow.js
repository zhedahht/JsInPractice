$(document).ready(function () {
    SnowLib.makeSnow("christmasSnow", "./Christmas.jpg");
});

(function() {
    SnowLib = {
        makeSnow: function (canvasId, imagePath) {
                      var christmasSnow = new ChristmasSnow(canvasId, imagePath);
                      var renderAndUpdateFunc = renderAndUpdate(christmasSnow)
                      setInterval(renderAndUpdateFunc, 15);
                  }
    };

    function renderAndUpdate(christmasSnow) {
        return function() {
            christmasSnow.render();
            christmasSnow.update();
        }
    }
    
    function ChristmasSnow(canvasId, imagePath) {
        var snowElement = document.getElementById(canvasId);
        this.canvasContext = snowElement.getContext("2d");
    
        this.width = snowElement.clientWidth;
        this.heigth = snowElement.clientHeight;
    
        this.image = initImage(imagePath);
        this.snow = initSnow(this.width, this.heigth);
    }
    
    function initImage(imagePath) {
        var image = new Image();
        image.src = imagePath;
        return image;
    }
    
    function Range(min, max) {
        this.min = min;
        this.max = max;
    }
    
    function initSnow(width, height) {
        var radiusRange = new Range(3, 10),
            speedYRange = new Range(1, 3),
            speedX = 0.05,
            alphaRange = new Range(0.5, 1.0),
            moveXRange = new Range(4, 18);
        
        var snowSettings = new SnowSettings(radiusRange,
                       width, 
                       height, 
                       speedYRange, 
                       speedX, 
                       alphaRange, 
                       moveXRange);
    
        var snow = [];
        var snowNumber = 200;
        for(var i = 0; i < snowNumber; ++i) {
            snow[i] = new Snow(snowSettings);
        }
    
        return snow;
    }
    
    ChristmasSnow.prototype.render = function() {
        this.canvasContext.drawImage(this.image, 0, 0);
    
        for(var i = 0; i < this.snow.length; ++i) {
            this.snow[i].render(this.canvasContext);
        }
    }
    
    ChristmasSnow.prototype.update = function() {
        for(var i = 0; i < this.snow.length; ++i) {
            this.snow[i].update();
        }
    }
    
    function SnowSettings(radiusRange, maxX, maxY, speedYRange,
                          speedX, alphaRange, moveXRange) {
        this.radiusRange = radiusRange;
        this.maxX = maxX;
        this.maxY = maxY;
        this.speedYRange = speedYRange;
        this.speedX = speedX;
        this.alphaRange = alphaRange;
        this.moveXRange = moveXRange;
    }
    
    function Snow(snowSettings) {
        this.snowSettings = snowSettings;
    
        this.radius = randomInRange(snowSettings.radiusRange);
        this.initialX = Math.random() * snowSettings.maxX;
        this.y = Math.random() * snowSettings.maxY;
        this.speedY = randomInRange(snowSettings.speedYRange);
        this.speedX = snowSettings.speedX;
        this.alpha = randomInRange(snowSettings.alphaRange);
        this.angle = Math.random(Math.PI * 2);
        this.x = this.initialX + Math.sin(this.angle);
        this.moveX = randomInRange(snowSettings.moveXRange);
    }
    
        Snow.prototype.render = function(canvasContext) {
        canvasContext.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        canvasContext.closePath();
        canvasContext.fill(); 
    }
    
    Snow.prototype.update = function() {
        this.y += this.speedY;
        if (this.y > this.snowSettings.maxY) {
            this.y -= this.snowSettings.maxY;
        }
    
        this.angle += this.speedX;
        if (this.angle > Math.PI * 2) {
            this.angle -= Math.PI * 2;
        }
    
        this.x = this.initialX + this.moveX * Math.sin(this.angle);
    }
    
    function randomInRange(range) {
        var random = Math.random() * (range.max - range.min) + range.min;
        return random;
    }
})();
