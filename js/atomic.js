var Atomic = (function () {
    // Constants
    var TAU = 2 * Math.PI;

    // Functions
    var random = Math.random;
    var min = Math.min;
    var max = Math.max;
    var sqrt = Math.sqrt;

    // Default config
    var INITIAL_SPEED = 1;
    var PARTICLE_FILL = 'rgb(100, 120, 200)';
    var PARTICLE_R = 5;
    var BOND_LIMIT = 18;
    var BIN_SIZE = BOND_LIMIT;

    function getParticle(x, y, r, colour, speed) {
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

        var binRows, binCols, nBins;

        // Initial world config
        var config = {
            particleFill: PARTICLE_FILL,
            particleR: PARTICLE_R,
            initialSpeed: INITIAL_SPEED,
            bondLimit: BOND_LIMIT,
        };
        _setBinSize(BIN_SIZE);

        function _addParticles(positions, params) {
            if (!params) { params = {}; }
            
            var r = params.r || config.particleR;
            var colour = params.colour || config.particleFill;
            var maxSpeed = params.speed || config.initialSpeed;
            
            var n = positions.length;
            for (var i = 0; i < n; i++) {
                var x = positions[i][0];
                var y = positions[i][1];
                var speed = random() * maxSpeed;
                particles.push(getParticle(x, y, r, colour, speed));
            }

            nParticles += n;
        };

        function addParticles(n, params) {
            // Generate random positions
            var positions = [];
            for (var i = 0; i < n; i++) {
                positions.push([width * random(), height * random()]);
            }
            _addParticles(positions, params);
        };

        function addParticleBlock(x1, y1, w, h, params) {
            // Make sure values are within bounds
            x1 = max(0, x1);
            y1 = max(0, y1);
            w = min(w, width - x1);
            h = min(h, height - y1);
            var x2 = x1 + w;
            var y2 = y1 + h;

            var positions = [];
            var x = x1;
            var y = y1;
            var dx = config.bondLimit;
            var dy = dx * sqrt(3) / 2;
            var rows = 0;

            while (y < y2) {
                positions.push([x, y]);
                x += dx;
                if (x > x2) {
                    y += dy;
                    x = x1;
                    rows++;
                    if (rows % 2) {
                        x += dx * 0.5;
                    }
                }
            }

            _addParticles(positions, params);
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
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

                // Particles move
                p.x += p.dx;
                p.y += p.dy;

                // Particles bounce
                if (p.x < p.r) {
                    p.x = 2 * p.r - p.x;
                    p.dx *= -1;
                } else if (p.x > width - p.r) {
                    p.x = 2 * (width - p.r) - p.x;
                    p.dx *= -1;
                }
                if (p.y < p.r) {
                    p.y = 2 * p.r - p.y;
                    p.dy *= -1;
                } else if (p.y > height - p.r) {
                    p.y = 2 * (height - p.r) - p.y;
                    p.dy *= -1;
                }
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
            if (attr === 'binSize') {
                _setBinSize(value);
            } else if (attr === 'bondLimit') {
                _setBondLimit(value);
            } else {
                config[attr] = value;
            }
        }

        // Set the size for binning when calculating particle collisions
        function _setBinSize(size) {
            config.binSize = max(config.bondLimit, size);
            binRows = Math.ceil(width / size);
            binCols = Math.ceil(height / size);
            nBins = binRows * binCols;
        }

        function _setBondLimit(size) {
            config.bondLimit = size;
            if (size < config.binSize) {
                _setBinSize(size);
            }
        }

        function _getBinnedParticles() {
            var bins = [];
            for (i = 0; i < nBins; i++) {
                bins.push([]);
            }
        }

        return {
            set: set,
            draw: draw,
            particles: particles,
            addParticles: addParticles,
            addParticleBlock: addParticleBlock,
            stop: stop,
            start: start,
            toggleRunning: toggleRunning
        };
    }

    return {
        makeWorld: makeWorld
    };
})();
