var Atomic = (function () {
    // Constants
    var TAU = 2 * Math.PI;

    // Functions
    var random = Math.random;

    // Default config
    var INITIAL_SPEED = 1;
    var PARTICLE_FILL = 'rgb(100, 120, 200)';
    var PARTICLE_R = 5;

    function getParticle(x, y, r, colour) {
        // Velocity
        var speed = INITIAL_SPEED * random();
        var angle = TAU * random();

        return {
            x: x,
            y: y,
            r: r,
            dx: speed * Math.cos(angle),
            dy: speed * Math.cos(angle),
            colour: colour
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
        var animationId;

        // World config
        var config = {
            particleFill: PARTICLE_FILL,
            particleR: PARTICLE_R,
        }

        function addParticles(n) {
            for (var i = 0; i < n; i++) {
                var x = width * random();
                var y = height * random();
                var r = config.particleR;
                var colour = config.particleFill;
                particles.push(getParticle(x, y, r, colour));
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

        function tick() {
            for (var i = 0; i < nParticles; i++) {
                p = particles[i];
                p.x += p.dx;
                p.y += p.dy;
            }
        }

        function update() {
            tick();
            draw();
            animationId = window.requestAnimationFrame(update);
        }

        function start() {
            animationId = window.requestAnimationFrame(update);
        }

        function stop() {
            if (animationId) {
                window.cancelAnimationFrame(animationId);
                animationId = false;
            }
        }

        function toggleRunning() {
            if (animationId) {
                stop();
            } else {
                start();
            }
        }

        function set(attr, value) {
            config[attr] = value;
        }

        return {
            set: set,
            draw: draw,
            particles: particles,
            addParticles: addParticles,
            stop: stop,
            start: start,
            toggleRunning: toggleRunning
        };
    }

    return {
        makeWorld: makeWorld
    };
})();
