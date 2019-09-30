var Atomic = (function () {
    // Constants
    var TAU = 2 * Math.PI;

    // Functions
    var random = Math.random;

    var INITIAL_SPEED = 1;

    var Particle = function(x, y) {
        // Position
        this.x = x;
        this.y = y;
        
        // Velocity
        var speed = INITIAL_SPEED * random();
        var angle = TAU * random();
        this.dx = speed * Math.cos(angle);
        this.dy = speed * Math.sin(angle);
    };

    function makeWorld(id, width, height) {
        var parent = document.getElementById(id);
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        parent.appendChild(canvas);

        var particles = [];

        function addParticles(n) {
            for (var i = 0; i < n; i++) {
                var x = width * random();
                var y = height * random();
                particles.push(new Particle(x, y));
            }
        };

        return {
            particles: particles,
            addParticles: addParticles,
        };
    }

    return {
        makeWorld: makeWorld
    };
})();
