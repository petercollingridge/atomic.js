var Atomic = (function () {
    // Constants
    var TAU = 2 * Math.PI;

    // Functions
    var random = Math.random;

    var INITIAL_SPEED = 1;

    function getParticle(x, y) {        
        // Velocity
        var speed = INITIAL_SPEED * random();
        var angle = TAU * random();

        return {
            x: x,
            y: y,
            dx: speed * Math.cos(angle),
            dy: speed * Math.cos(angle),
        };
    };

    function makeWorld(id, width, height) {
        var parent = document.getElementById(id);
        if (!parent) {
            throw new Error('Canvas ' + id + ' not found');
        }

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        parent.appendChild(canvas);

        var particles = [];
        var nParticles = 0;

        // Default config
        var config = {
            particleFill: 'rgb(100, 120, 200)',
            particleR: 5,
        }

        function addParticles(n) {
            for (var i = 0; i < n; i++) {
                var x = width * random();
                var y = height * random();
                particles.push(getParticle(x, y));
            }
            nParticles += n;
        };

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = config.particleFill;

            for (var i = 0; i < nParticles; i++) {
                ctx.beginPath();
                ctx.arc(particles[i].x, particles[i].y, config.particleR, 0, TAU, true);

                ctx.fill();
            }
        }

        return {
            particles: particles,
            addParticles: addParticles,
            draw: draw,
        };
    }

    return {
        makeWorld: makeWorld
    };
})();
